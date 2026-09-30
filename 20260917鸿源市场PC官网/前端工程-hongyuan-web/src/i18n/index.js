/* #AI:dev 多语言运行时（核心层）
   —— 词条与格式化函数逐一对齐预览包 js/i18n.js；差异仅在实现方式：
   预览包用全局 window.__lang + 手动重渲染，本工程 lang 为响应式值（store/lang.js langBus），
   组件 computed 读 t()/fmtX() 时自动重算，语言切换全站即时生效。
   覆盖：公共骨架 + 8 页全部界面文案 + 演示数据译文（NAME_I18N / NEWS_I18N / DEALER_I18N / ABOUT_I18N）。
   翻译规则见《PC官网设计规范.md》第 8 章；价格口径见 8.6（fmtPrice/fmtUsd/fmtPriceDualHTML/fmtPriceDualText/priceLabel/fmtRubThs）。 */
import {
  I18N, I18N_MARKET, COUNTRIES, NAME_I18N, BRAND_I18N, SERIES_I18N,
  NEWS_I18N, DEALER_I18N, ABOUT_I18N
} from "./dictionaries";
import { SITE_CONFIG } from "@/config/siteConfig";
import { esc } from "@/utils/escape";
import { getLang } from "@/store/lang";

export { COUNTRIES };

/* ---------- 语言存取（预览包：document.documentElement.lang / data-lang 同步逻辑保留） ---------- */
export const langState = {
  set(lang) {
    document.documentElement.lang = (lang === "zh") ? "zh-CN" : lang;
    document.documentElement.setAttribute("data-lang", lang);
    try { localStorage.setItem("hy_lang", lang); } catch (e) {}
  }
};

/* 初始语言：localStorage hy_lang 记忆优先，无记录默认 ru（v1.8，YAN 2026-09-28 确认） */
function initialLang() {
  var stored = "ru";
  try { stored = localStorage.getItem("hy_lang") || "ru"; } catch (e) {}
  return (stored === "zh" || stored === "en") ? stored : "ru";
}
document.documentElement.lang = (initialLang() === "zh") ? "zh-CN" : initialLang();
document.documentElement.setAttribute("data-lang", initialLang());

/* ---------- 核心 API（与预览包 t/tf/tArr/tOr/V/… 行为一致） ---------- */
export function t(key) {
  var L = getLang();
  var d = I18N[L] || I18N.zh;
  if (d[key] != null) return d[key];
  if (I18N.zh[key] != null) return I18N.zh[key];
  return key;
}
/* 模板串：tf('rc.text', {n:8, m:'Hongyuan'}) */
export function tf(key, vars) {
  var s = t(key);
  Object.keys(vars || {}).forEach(function (k) { s = s.replace("{" + k + "}", vars[k]); });
  return s;
}
export function tArr(key, baseArr) {
  if (getLang() === "zh") return baseArr;
  var a = (I18N[getLang()] || {})[key];
  return (a && a.length === baseArr.length) ? a : baseArr;
}
export function tOr(key, fallback) {
  if (getLang() === "zh") return fallback;
  var v = (I18N[getLang()] || {})[key];
  return v != null ? v : fallback;
}
export function marketName() { return I18N_MARKET[getLang()].name; }
export function marketShort() { return I18N_MARKET[getLang()].short; }
/* 数据值本地化：颜色/燃料/排放/位置 */
export function V(zhVal) {
  if (getLang() === "zh") return zhVal;
  return t("v." + zhVal);
}
export function carName(car) {
  if (getLang() === "zh") return car.name;
  var n = NAME_I18N[car.id];
  return n ? n[getLang()] : car.name;
}
export function brandName(b) {
  if (getLang() === "zh") return b;
  var m = BRAND_I18N[b];
  return m ? m[getLang()] : b;
}
export function seriesName(s) {
  if (getLang() === "zh") return s;
  return SERIES_I18N[s] || s;
}
export function newsI(n) {
  if (getLang() === "zh") return n;
  var x = NEWS_I18N[n.id];
  return x ? x[getLang()] : n;
}
export function dealerI(i, m) {
  if (getLang() === "zh") return m;
  var x = DEALER_I18N[i];
  return x ? x[getLang()] : m;
}
export function aboutI() {
  if (getLang() === "zh") return null;
  return ABOUT_I18N[getLang()];
}
export function marketIntroI() {
  if (getLang() === "zh") return SITE_CONFIG.marketIntro;
  var x = ABOUT_I18N[getLang()];
  return x ? x.intro : SITE_CONFIG.marketIntro;
}
export function addressI() {
  var x = ABOUT_I18N[getLang()];
  return x ? x.address : SITE_CONFIG.address;
}
export function trafficI() {
  if (getLang() === "zh") return SITE_CONFIG.traffic;
  var x = ABOUT_I18N[getLang()];
  return x ? x.traffic : SITE_CONFIG.traffic;
}

/* ---------- 数值/单位格式化（万 ↔ k/тыс.；口径与预览包逐字一致） ---------- */
export function fmtMileage(v) {           /* v 单位：万公里 */
  var L = getLang();
  if (L === "zh") return v + "万公里";
  var k = v * 10;
  var s = (k % 1 === 0) ? k : k.toFixed(1);
  return L === "en" ? s + "k km" : s + " тыс. км";
}
/* #AI:design —— 俄文千卢布格式化（YAN 2026-09-28 确认：全站卢布统一「тыс. ₽」，废除「млн ₽」写法）
   v 单位：万元人民币 → 千卢布 = v × 10000 × 11.59 ÷ 1000；保留 1 位小数（整数省略）、逗号小数点（俄式）、整数部分空格千分位。例：7万 → 811,3 тыс. ₽；32.6万 → 3 778,3 тыс. ₽ */
export function fmtRubThs(v) {
  var ths = Math.round(v * 10000 * 11.59 / 100) / 10;  /* 千卢布，四舍五入到 1 位小数 */
  var s = (ths % 1 === 0) ? String(ths) : ths.toFixed(1);
  var p = s.split(".");
  p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (p.length > 1 ? p[0] + "," + p[1] : p[0]) + " тыс. ₽";
}
/* v 单位：万元人民币；中文=万，英文=美元，俄文=千卢布（тыс. ₽）
   换算汇率与 data/rates.js 保持一致（演示固定值，接实时汇率接口后同步替换） */
export function fmtPrice(v) {
  var L = getLang();
  if (L === "zh") return v + "万";
  var usdPerCny = 6.876;
  if (L === "en") {
    var usd = Math.round(v * 10000 / usdPerCny);
    return "$" + usd.toLocaleString("en-US");
  }
  return fmtRubThs(v);
}
/* 美元辅助价（v 单位：万元人民币）：与 fmtPrice en 分支同汇率同格式（$千分位），供俄文双币展示复用 */
export function fmtUsd(v) {
  var usd = Math.round(v * 10000 / 6.876);
  return "$" + usd.toLocaleString("en-US");
}
/* #AI:design —— 售价双币（YAN 2026-09-28 确认）：俄文=卢布为主+美元并排为辅；en/zh 与 fmtPrice 输出口径一致（返回 HTML 安全串）。
   仅用于「车辆售价」；新车指导价(diOldPrice)/价格区间(priceLabel)仍用 fmtPrice 单币种，勿在此函数上扩散。 */
export function fmtPriceDualHTML(v) {
  if (getLang() !== "ru") return esc(fmtPrice(v));
  return '<span class="pc-rub">' + esc(fmtPrice(v)) + '</span><span class="pc-usd">' + esc(fmtUsd(v)) + '</span>';
}
/* 双币纯文本版（分享笔记等复制场景，俄文用 / 分隔） */
export function fmtPriceDualText(v) {
  if (getLang() !== "ru") return fmtPrice(v);
  return fmtPrice(v) + " / " + fmtUsd(v);
}
/* 价格区间标签（min/max 单位：万元人民币）：随语言翻译并按同汇率换算 */
export function priceLabel(min, max) {
  var L = getLang();
  if (L === "zh") {
    if (min === 0) return max + "万以下";
    if (max >= 999) return min + "万以上";
    return min + "-" + max + "万";
  }
  if (L === "en") {
    var k = function (w) { return Math.round(w * 10000 / 6.876 / 1000); };
    if (min === 0) return "Under $" + k(max) + "k";
    if (max >= 999) return "Over $" + k(min) + "k";
    return "$" + k(min) + "–" + k(max) + "k";
  }
  /* 俄文区间标签统一 тыс. ₽（YAN 2026-09-28，废除 млн 分支）；数值四舍五入到百位、无小数，
     允许与中文档位不逐一对应（YAN 2026-09-28 确认）；车辆售价 fmtPrice 仍 1 位小数，勿混淆 */
  var rk = function (w) {
    var h = Math.round(w * 10000 * 11.59 / 1000 / 100) * 100;   /* 千卢布取整到百位 */
    return String(h).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " тыс. ₽";
  };
  if (min === 0) return "до " + rk(max);
  if (max >= 999) return "от " + rk(min);
  return rk(min) + " – " + rk(max);
}
export function fmtReg(s) {               /* "2021-06" */
  var L = getLang();
  if (L === "zh") return s + "上牌";
  if (L === "en") return "Reg. " + s;
  var p = s.split("-"); return "Рег. " + (p.length > 1 ? p[1] + "." + p[0] : s);
}
export function fmtGear(g) {              /* "自动(CVT)" / "自动" / "手动" */
  var L = getLang();
  var base = g.split("(")[0];
  if (L === "zh") return g.indexOf("(") > -1 ? g.replace("自动(", "").replace(")", "") : base;
  if (g.indexOf("E-CVT") > -1) return "E-CVT";
  if (g.indexOf("CVT") > -1) return "CVT";
  if (base.indexOf("自动") > -1) return L === "en" ? "AT" : "АКПП";
  if (base.indexOf("手动") > -1) return L === "en" ? "MT" : "МКПП";
  return base;
}
export function bodyLabel(b) {
  var key = "body." + b;
  var d = I18N[getLang()] || I18N.zh;
  return d[key] != null ? d[key] : b;
}
