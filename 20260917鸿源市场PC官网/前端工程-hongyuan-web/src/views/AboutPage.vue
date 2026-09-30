<template>
  <div>
    <div class="wrap">
      <h1 class="about-title">{{ t("nav.about") }}</h1>

      <!-- 市场简介长文（REPLACE: 全部为占位文案，按市场真实情况改写；zh 分支为页面内静态长文，en/ru 走 i18n ABOUT_I18N） -->
      <div class="about-text" v-html="aboutHtml"></div>

      <!-- 场地照片墙（REPLACE: 正式使用时将生成图替换为市场实拍图 /img/about/*；图注三语） -->
      <div class="about-photos">
        <div v-for="(p, i) in photos" :key="i" class="ap-item" :style="{ backgroundImage: 'url(' + p.img + ')' }">
          <span class="ap-cap">{{ t("ab.cap" + (i + 1)) }}</span>
        </div>
      </div>
    </div>

    <!-- 联系方式条（config.js 注入：地址/热线/交通；三语地址走 addressI()） -->
    <div class="contact-bar">
      <div class="wrap">
        <div class="cb-item">
          <span class="cb-icon el-icon-location"></span>
          <div><h5>{{ t("ab.addrLabel") }}</h5><p>{{ addressI() }}</p></div>
        </div>
        <div class="cb-item">
          <span class="cb-icon el-icon-phone-outline"></span>
          <div><h5>{{ t("ab.telLabel") }}</h5><p><b>{{ SITE.hotline }}</b></p></div>
        </div>
        <div class="cb-item">
          <span class="cb-icon el-icon-guide"></span>
          <div><h5>{{ t("ab.trafficLabel") }}</h5><p>{{ trafficI() }}</p></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* #AI:dev 关于我们页（迁移 about.html；中文简介长文为原页内 HTML 原样保留） */
import { SITE } from "@/mixins/site";
import { t, marketName, aboutI, addressI, trafficI, escHtml as esc } from "@/i18n/pagehelpers";

export default {
  name: "AboutPage",
  mixins: [SITE],
  data() {
    return {
      /* REPLACE: 照片墙图片（/img/about/about1~6.png） */
      photos: [1, 2, 3, 4, 5, 6].map(i => ({ img: "/img/about/about" + i + ".png" }))
    };
  },
  computed: {
    lang() { return this.$lang(); },
    aboutHtml() {
      this.$lang();
      const x = aboutI();
      const mn = esc(marketName());
      if (x) {
        return "<p>" + x.p1.replace("{m}", mn).replace("{address}", addressI()) + "</p><p>" + x.p2 + "</p><p class='slogan'>" + x.p3 + "</p>";
      }
      return "<p><b>" + mn + "</b>成立于 2011 年，地址：" + addressI() + "，是中山市物资集团（中物集团）旧车板块旗下主力市场，深耕二手车行业多年，为中山市旧机动车流通核心交易平台之一。</p>" +
        "<p>中物集团旧车板块首创全国旧车交易集市及一站式服务模式，打造“选车-评估-过户-售后”全链路智慧服务平台，配备金融、维修、保险等全方位服务，并拥有二手车出口资质，集出口、物流、报关、国际金融结算全链路服务，连续获评广东省二手车市场十强。市场依托集团资源，与多家大型二手车交易市场长期战略合作、共享车源。<span style='color:#999'>（以上根据工商登记及中物集团官网公开资料整理，2026-09-18；正式对外发布前请市场方校核确认）</span></p>" +
        "<p class='slogan'>————我们以诚信、创新、服务为核心，倾力打造消费者放心、舒心的购车环境！</p>";
    }
  },
  watch: { lang() { document.title = t("pt.about") + " - " + marketName(); } },
  mounted() { document.title = t("pt.about") + " - " + marketName(); },
  methods: { t, marketName, addressI, trafficI }
};
</script>
