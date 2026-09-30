/* #AI:design —— 全站公共脚本：渲染顶导航/页脚/悬浮栏（三件套全站一致）、通用工具函数
   依赖：config.js → i18n.js 必须先于本文件加载（多语言：默认俄文 ru，可切中文/英文；hy_lang 记忆用户选择） */

/* ---------- 工具 ---------- */
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

/* 读取 URL 查询参数（file:// 下 location.search 同样可用） */
function getQuery(key) {
  var m = new RegExp("[?&]" + key + "=([^&]*)").exec(location.search);
  return m ? decodeURIComponent(m[1]) : "";
}

/* 车源卡片 HTML（首页/列表页共用；有真图用真图，无图回退渐变占位；单位文案随语言） */
function carCardHTML(car) {
  var img = (car.imgs && car.imgs[0])
    ? '<img class="ci-img" src="' + car.imgs[0] + '" alt="' + esc(car.imgText) + '" loading="lazy">'
    : '<span class="ci-text">' + esc(car.imgText) + '</span>';
  /* 售价双币（2026-09-28 YAN 确认）：zh 维持「万」小字号现状；ru=卢布+美元并排；en=仅美元（与改前一致） */
  var priceHtml = window.__lang === "zh"
    ? esc(String(car.price)) + '<small>万</small>'
    : fmtPriceDualHTML(car.price);
  return '<a class="car-card" href="cardetail.html?id=' + car.id + '">' +
    '<div class="car-img" style="background:' + car.imgColor + '">' +
      (car.tags.indexOf("cert") > -1 ? '<span class="ci-tag">' + esc(t("card.certTag")) + '</span>' : "") +
      img +
    '</div>' +
    '<div class="car-info">' +
      '<div class="car-name">' + esc(carName(car)) +
        (car.tradeType ? ' <span class="el-tag tt-tag">' + esc(car.tradeType) + '</span>' : '') + '</div>' +
      '<div class="car-meta"><b>' + esc(fmtMileage(car.mileage)) + '</b> | <b>' + esc(fmtReg(car.reg)) + '</b></div>' +
      '<div class="car-price">' + priceHtml + '</div>' +
    '</div></a>';
}

/* ---------- 顶部导航 ---------- */
var NAV_ITEMS = [
  { key: "home",  ikey: "nav.home",  href: "shouye.html" },
  { key: "buy",   ikey: "nav.buy",   href: "buycar.html" },
  { key: "sell",  ikey: "nav.sell",  href: "sellcars.html" },
  { key: "news",  ikey: "nav.news",  href: "news-list.html" },
  { key: "about", ikey: "nav.about", href: "about.html" }
];
// #AI:design:start
var LANG_OPTIONS = [
  { key: "zh", label: "中文", icon: "img/lang/中文.svg" },
  { key: "ru", label: "Русский", icon: "img/lang/俄文.svg" },
  { key: "en", label: "English", icon: "img/lang/英文.svg" }
];
// #AI:design:end

function renderHeader(activeKey) {
  window.__activePage = activeKey || window.__activePage || "";
  var cfg = SITE_CONFIG;
  var links = NAV_ITEMS.map(function (n) {
    return '<a href="' + n.href + '"' + (n.key === window.__activePage ? ' class="active"' : "") + '>' + esc(t(n.ikey)) + '</a>';
  }).join("");
  var cur = LANG_OPTIONS.filter(function (l) { return l.key === window.__lang; })[0] || LANG_OPTIONS[0];
  var langMenu =
    '<div class="lang-switch" id="langSwitch">' +
      // #AI:design:start
      '<button type="button" class="lang-cur" id="langCur" aria-label="切换语言 Language Язык"><img src="' + cur.icon + '" alt="" aria-hidden="true"><span>' + esc(cur.label) + '</span><i class="el-icon-arrow-down"></i></button>' +
      // #AI:design:end
      '<div class="lang-menu" id="langMenu">' +
        LANG_OPTIONS.map(function (l) {
          return '<a href="javascript:;" data-lang="' + l.key + '"' + (l.key === window.__lang ? ' class="on"' : "") + '>' + esc(l.label) + '</a>';
        }).join("") +
      '</div>' +
    '</div>';
  var html =
    '<div class="wrap header-inner">' +
      /* REPLACE: Logo —— 正式使用时将文字标替换为 <img src="img/logo.png" alt="市场Logo"> */
      '<a class="logo" href="shouye.html" aria-label="返回首页">' +
        '<span class="logo-mark">' + esc(cfg.logoMark) + '</span>' +
        // #AI:design:start
        '<span class="logo-text">' + esc(marketName()) + '</span>' +
        // #AI:design:end
      '</a>' +
      '<nav class="main-nav">' + links + '</nav>' +
      langMenu +
    '</div>';
  var el = document.getElementById("site-header");
  el.className = "site-header";
  el.innerHTML = html;

  /* 语言下拉交互 */
  var sw = document.getElementById("langSwitch");
  document.getElementById("langCur").addEventListener("click", function (e) {
    e.stopPropagation(); sw.classList.toggle("open");
  });
  sw.addEventListener("click", function (e) {
    var a = e.target.closest("[data-lang]");
    if (a) { sw.classList.remove("open"); setLang(a.dataset.lang); }
  });
  document.addEventListener("click", function () { sw.classList.remove("open"); });

}

// #AI:design:start
/* 首页搜索：点击按钮或回车后跳转买车列表并携带关键词。 */
function bindSiteSearch(formId, inputId) {
  var form = document.getElementById(formId);
  var input = document.getElementById(inputId);
  if (!form || !input) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var kw = input.value.trim();
    location.href = "buycar.html" + (kw ? "?kw=" + encodeURIComponent(kw) : "");
  });
}
// #AI:design:end

/* ---------- 页脚 ---------- */
// #AI:design:start
var FOOTER_LINK_IKEYS = ["nav.buy", "nav.sell", "nav.news", "nav.about"];
// #AI:design:end
function renderFooter() {
  var cfg = SITE_CONFIG;
  var links = cfg.footerLinks.map(function (l, i) {
    return '<a href="' + esc(l.href) + '">' + esc(t(FOOTER_LINK_IKEYS[i] || "")) + '</a>';
  }).join("");
  var html =
    '<div class="wrap footer-top">' +
      '<div class="footer-links">' +
        /* REPLACE: 页脚链接组（在 config.js footerLinks 中维护） */
        links +
      '</div>' +
      '<div class="footer-qrs">' +
        /* REPLACE: 微信服务号二维码 img/qr-service.png（当前统一为占位图 img/qr-placeholder.png） */
        '<div class="footer-qr"><div class="qr-ph" data-label="' + esc(t("ui.qrService")) + '"></div><div class="fq-title">' + esc(marketName()) + '</div><div class="fq-sub">' + esc(t("ui.qrService")) + '</div></div>' +
        /* REPLACE: 微信订阅号二维码 img/qr-subscribe.png */
        '<div class="footer-qr"><div class="qr-ph" data-label="' + esc(t("ui.qrSubscribe")) + '"></div><div class="fq-title">' + esc(t("ui.qrSubName")) + '</div><div class="fq-sub">' + esc(t("ui.qrSubscribe")) + '</div></div>' +
      '</div>' +
    '</div>' +
    '<div class="footer-bottom"><div class="wrap">' +
      '<span>COPYRIGHT &copy;' + esc(cfg.copyrightYear) + ' ' + esc(marketName()) + '</span>' + /* REPLACE: 版权年份/主体 */
      '<span class="fb-sep">|</span><span>' + esc(cfg.icp) + '</span>' +                          /* REPLACE: ICP备案号 */
      '<span class="fb-sep">|</span><span>' + esc(cfg.poweredBy) + '</span>' +
    '</div></div>';
  var el = document.getElementById("site-footer");
  el.className = "site-footer";
  el.innerHTML = html;
}

/* ---------- 右侧悬浮栏 ---------- */
function renderFloatBar() {
  var cfg = SITE_CONFIG;
  var appItem = '<div class="float-item" aria-label="' + esc(t("ui.miniapp")) + '"><span class="fi-icon fi-svg"><svg viewBox="0 0 1024 1024" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M626.176 279.552c74.24 0 134.656 55.808 134.656 124.928 0 21.504-6.144 42.496-17.408 61.44-16.896 27.648-44.032 48.128-76.8 57.856-8.704 2.56-15.36 3.584-21.504 3.584-14.336 0-25.6-11.264-25.6-25.6s11.264-25.6 25.6-25.6c1.024 0 3.072 0 5.632-1.024 22.016-6.144 39.424-18.944 49.152-35.84 6.656-10.752 9.728-22.528 9.728-34.816 0-40.448-37.376-73.728-82.944-73.728-15.872 0-31.232 4.096-45.056 11.776-24.064 13.824-38.4 36.864-38.4 61.952v214.528c0 43.52-24.064 83.456-64 105.984-21.504 12.288-45.568 18.432-70.144 18.432-74.24 0-134.656-55.808-134.656-124.928 0-21.504 6.144-42.496 17.408-61.44 16.896-27.648 44.032-48.128 76.8-57.856 9.216-2.56 15.36-3.584 21.504-3.584 14.336 0 25.6 11.264 25.6 25.6s-11.264 25.6-25.6 25.6c-1.024 0-3.072 0-5.632 1.024-22.016 6.656-39.424 19.456-49.152 35.84-6.656 10.752-9.728 22.528-9.728 34.816 0 40.448 37.376 73.728 83.456 73.728 15.872 0 31.232-4.096 45.056-11.776 24.064-13.824 38.4-36.864 38.4-61.952V404.48c0-43.52 24.064-83.456 64-105.984 20.992-12.8 45.056-18.944 69.632-18.944z m-520.704 230.4c0 226.304 183.296 409.6 409.6 409.6s409.6-183.296 409.6-409.6-183.296-409.6-409.6-409.6-409.6 183.296-409.6 409.6z m-51.2 0c0-254.464 206.336-460.8 460.8-460.8s460.8 206.336 460.8 460.8-206.336 460.8-460.8 460.8-460.8-206.336-460.8-460.8z m0 0"/></svg></span><span class="fi-text">' + esc(t("ui.miniapp")) + '</span>' +
      '<div class="float-pop"><div class="qr-ph" data-label="' + esc(t("ui.miniapp")) + '"></div>' + esc(t("ui.miniappTip")) + '</div></div>';
  var html =
    '<div class="float-item" aria-label="' + esc(t("ui.phone")) + '"><span class="fi-icon el-icon-phone-outline"></span><span class="fi-text">' + esc(t("ui.phone")) + '</span>' +
      '<div class="float-pop"><div class="fp-phone"><i class="el-icon-phone-outline"></i>' + esc(cfg.hotline) + '</div>' +
        (cfg.contactEmail ? '<div class="fp-email"><i class="el-icon-message"></i>' + esc(cfg.contactEmail) + '</div>' : '') +
      '</div></div>' +
      appItem +
    '<div class="float-item" aria-label="' + esc(t("ui.wechat")) + '"><span class="fi-icon fi-svg"><img src="img/wechat-float.svg" alt="" aria-hidden="true"></span><span class="fi-text">' + esc(t("ui.wechat")) + '</span>' +
      '<div class="float-pop"><div class="qr-ph" data-label="WeChat"></div>' + esc(t("ui.scanTip")) + '</div></div>' +
    '<div class="float-item ft-top" id="floatTopBtn" aria-label="' + esc(t("ui.top")) + '" title="' + esc(t("ui.top")) + '"><span class="fi-icon el-icon-caret-top"></span></div>';
  var el = document.getElementById("float-bar");
  el.className = "float-bar";
  el.innerHTML = html;
  document.getElementById("floatTopBtn").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- 页面初始化 ---------- */
function initPage(activeKey) {
  renderHeader(activeKey);
  renderFooter();
  renderFloatBar();
  /* 初始加载时同步翻译页内静态标记（data-i18n / data-i18n-ph） */
  document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-ph]").forEach(function (el) { el.placeholder = t(el.dataset.i18nPh); });
  /* REPLACE: 页面 title 中的市场名（各页 HTML 静态 title 与 config.js marketName 已统一为「鸿源二手车市场」） */
}

/* Element select 占位灰态：未选择(value空)时文字 #a8abb2，change 后恢复 */
function refreshSelectPh() {
  var ss = document.querySelectorAll("select");
  for (var i = 0; i < ss.length; i++) ss[i].classList.toggle("is-empty", !ss[i].value);
}
document.addEventListener("change", function (e) {
  if (e.target && e.target.tagName === "SELECT") e.target.classList.toggle("is-empty", !e.target.value);
});
window.addEventListener("load", refreshSelectPh);
