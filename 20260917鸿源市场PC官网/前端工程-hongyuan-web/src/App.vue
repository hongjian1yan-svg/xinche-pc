<template>
  <div id="hy-app">
    <SiteHeader />
    <router-view />
    <SiteFooter />
    <FloatBar />
  </div>
</template>

<script>
/* #AI:dev 根组件：公共骨架（顶导航/页脚/悬浮栏）+ 路由出口；html lang/title 由语言状态驱动 */
import SiteHeader from "@/components/SiteHeader.vue";
import SiteFooter from "@/components/SiteFooter.vue";
import FloatBar from "@/components/FloatBar.vue";
import { langBus } from "@/store/lang";

export default {
  name: "App",
  components: { SiteHeader, SiteFooter, FloatBar },
  computed: {
    langCur() { return langBus.lang; }
  },
  watch: {
    langCur: "syncHtmlLang"
  },
  mounted() {
    this.syncHtmlLang();
  },
  methods: {
    syncHtmlLang() {
      const L = this.langCur;
      document.documentElement.lang = L === "zh" ? "zh-CN" : L;
      document.documentElement.setAttribute("data-lang", L);
    }
  }
};
</script>
