<template>
  <footer class="site-footer">
    <div class="wrap footer-top">
      <div class="footer-links">
        <!-- REPLACE: 页脚链接组（config.js footerLinks 维护；href 映射为站内路由，预览包 xxx.html 对应 /*） -->
        <router-link v-for="(l, i) in SITE.footerLinks" :key="i" :to="htmlToRoute(l.href)">{{ t(FOOTER_LINK_IKEYS[i] || "") }}</router-link>
      </div>
      <div class="footer-qrs">
        <div class="footer-qr">
          <!-- REPLACE: 微信服务号二维码 /img/qr-service.png（当前统一为占位图 /img/qr-placeholder.png，样式 .qr-ph 背景引用） -->
          <div class="qr-ph" :data-label="t('ui.qrService')"></div>
          <div class="fq-title">{{ marketName() }}</div>
          <div class="fq-sub">{{ t("ui.qrService") }}</div>
        </div>
        <div class="footer-qr">
          <!-- REPLACE: 微信订阅号二维码 /img/qr-subscribe.png -->
          <div class="qr-ph" :data-label="t('ui.qrSubscribe')"></div>
          <div class="fq-title">{{ t("ui.qrSubName") }}</div>
          <div class="fq-sub">{{ t("ui.qrSubscribe") }}</div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="wrap">
        <!-- REPLACE: 版权年份/主体、ICP备案号（config.js 字段） -->
        <span>COPYRIGHT &copy;{{ SITE.copyrightYear }} {{ marketName() }}</span>
        <span class="fb-sep">|</span><span>{{ SITE.icp }}</span>
        <span class="fb-sep">|</span><span>{{ SITE.poweredBy }}</span>
      </div>
    </div>
  </footer>
</template>

<script>
/* #AI:dev 页脚（迁移 js/common.js renderFooter；文案三语、二维码为占位图） */
import { SITE } from "@/mixins/site";
import { t, marketName } from "@/i18n";

/* REPLACE: 页脚链接 i18n key（与 config footerLinks 顺序对应；换市场增减链接时同步） */
const FOOTER_LINK_IKEYS = ["nav.buy", "nav.sell", "nav.news", "nav.about"];
const HTML_TO_ROUTE = {
  "shouye.html": "/", "buycar.html": "/buycar", "sellcars.html": "/sellcars",
  "news-list.html": "/news", "news-detail.html": "/news-detail", "about.html": "/about",
  "cardetail.html": "/cardetail", "success.html": "/success"
};

export default {
  name: "SiteFooter",
  mixins: [SITE],
  data() {
    return { FOOTER_LINK_IKEYS };
  },
  methods: {
    t, marketName,
    htmlToRoute(href) { return HTML_TO_ROUTE[href] || "/"; }
  }
};
</script>
