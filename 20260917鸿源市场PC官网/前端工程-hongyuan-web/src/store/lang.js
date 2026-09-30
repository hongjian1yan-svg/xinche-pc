/* #AI:dev 语言 + 汇率换算全局状态（响应式，迁移并等价替换预览包 window.__lang 机制）
   - 默认语言 ru（YAN 2026-09-28 确认）；localStorage hy_lang 记忆用户手动选择并优先
   - lang 变化即全站重渲染（Vue computed 驱动），并同步 <html lang> / data-lang / title（见 App.vue） */
import Vue from "vue";

/* 初始语言：localStorage hy_lang 记忆优先，无记录默认 ru（与预览包 i18n.js 首帧逻辑一致） */
function initialLang() {
  var stored = "ru";
  try { stored = localStorage.getItem("hy_lang") || "ru"; } catch (e) {}
  return (stored === "zh" || stored === "en") ? stored : "ru";
}

export const langBus = new Vue({
  data: { lang: initialLang() }
});

export function getLang() { return langBus.lang; }

/* 切换语言：写入 i18n 引擎（同步 localStorage 与 html 属性）并广播响应式更新。
   动态 import 避免模块级循环依赖；html 属性/持久化统一在 i18n.langState.set 中处理 */
export function setLang(lang) {
  if (lang !== "zh" && lang !== "en" && lang !== "ru") return;
  langBus.lang = lang;
  import("@/i18n").then(function (m) { m.langState.set(lang); });
}

/* 混入：任何组件用 this.$lang() 读取当前语言，切换时依赖 computed 自动更新 */
export const langMixin = {
  methods: {
    $lang() { return langBus.lang; }
  }
};
