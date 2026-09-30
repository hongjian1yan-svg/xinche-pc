<template>
  <header class="site-header">
    <div class="wrap header-inner">
      <!-- REPLACE: Logo —— 正式使用时将文字标替换为 <img src="/img/logo.png" alt="市场Logo"> -->
      <router-link class="logo" to="/" aria-label="返回首页">
        <span class="logo-mark">{{ SITE.logoMark }}</span>
        <span class="logo-text">{{ marketName() }}</span>
      </router-link>
      <nav class="main-nav">
        <router-link v-for="n in navItems" :key="n.key" :to="n.to"
          :class="{ active: activeKey === n.key }">{{ t(n.ikey) }}</router-link>
      </nav>
      <!-- 语言切换下拉（中文/English/Русский；切换即全站重渲染，栏位定宽 128px 布局不动） -->
      <div class="lang-switch" :class="{ open: langOpen }" @click="onLangClick">
        <button type="button" class="lang-cur" aria-label="切换语言 Language Язык" @click.stop="langOpen = !langOpen">
          <img :src="currentLang.icon" alt="" aria-hidden="true"><span>{{ currentLang.label }}</span><i class="el-icon-arrow-down"></i>
        </button>
        <div class="lang-menu">
          <a v-for="l in langOptions" :key="l.key" href="javascript:;" :data-lang="l.key"
            :class="{ on: l.key === langCur }">{{ l.label }}</a>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
/* #AI:dev 顶部导航（迁移 js/common.js renderHeader：导航项 i18n + 语言下拉；原文件跳页改 router-link） */
import { SITE } from "@/mixins/site";
import { t, marketName } from "@/i18n";
import { langBus, setLang } from "@/store/lang";

const NAV_ITEMS = [
  { key: "home", ikey: "nav.home", to: "/" },
  { key: "buy", ikey: "nav.buy", to: "/buycar" },
  { key: "sell", ikey: "nav.sell", to: "/sellcars" },
  { key: "news", ikey: "nav.news", to: "/news" },
  { key: "about", ikey: "nav.about", to: "/about" }
];
/* REPLACE: 语言选项图标（/img/lang/*.svg） */
const LANG_OPTIONS = [
  { key: "zh", label: "中文", icon: "/img/lang/中文.svg" },
  { key: "ru", label: "Русский", icon: "/img/lang/俄文.svg" },
  { key: "en", label: "English", icon: "/img/lang/英文.svg" }
];

export default {
  name: "SiteHeader",
  mixins: [SITE],
  data() {
    return { navItems: NAV_ITEMS, langOptions: LANG_OPTIONS, langOpen: false };
  },
  computed: {
    langCur() { return langBus.lang; },
    currentLang() { return LANG_OPTIONS.filter(l => l.key === this.langCur)[0] || LANG_OPTIONS[0]; },
    activeKey() {
      /* 高亮逻辑同预览包（cardetail 归属 buy） */
      const r = this.$route;
      if (!r) return "";
      if (r.name === "cardetail") return "buy";
      if (r.name === "newsDetail") return "news";
      if (r.name === "success") return "sell";
      return (r.meta && r.meta.active) || "";
    }
  },
  mounted() {
    /* 外点收起语言菜单（同预览包 document click） */
    document.addEventListener("click", this.closeLang);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.closeLang);
  },
  methods: {
    t, marketName,
    closeLang() { this.langOpen = false; },
    onLangClick(e) {
      const a = e.target.closest("[data-lang]");
      if (a) { this.langOpen = false; setLang(a.dataset.lang); }
    }
  }
};
</script>
