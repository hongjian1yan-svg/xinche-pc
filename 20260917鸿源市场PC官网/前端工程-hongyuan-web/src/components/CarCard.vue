<template>
  <!-- 车源卡片（首页今日推荐/买车列表共用；迁移 js/common.js carCardHTML）
       售价双币：zh=「万」小字号；ru=卢布为主+美元并排（.pc-rub/.pc-usd）；en=仅美元（2026-09-28 YAN 确认） -->
  <router-link class="car-card" :to="{ path: '/cardetail', query: { id: car.id } }">
    <div class="car-img" :style="{ background: car.imgColor }">
      <span v-if="car.tags.indexOf('cert') > -1" class="ci-tag">{{ t("card.certTag") }}</span>
      <img v-if="car.imgs && car.imgs[0]" class="ci-img" :src="car.imgs[0]" :alt="car.imgText" loading="lazy">
      <span v-else class="ci-text">{{ car.imgText }}</span>
    </div>
    <div class="car-info">
      <div class="car-name">{{ carName(car) }} <span v-if="car.tradeType" class="el-tag tt-tag">{{ car.tradeType }}</span></div>
      <div class="car-meta"><b>{{ fmtMileage(car.mileage) }}</b> | <b>{{ fmtReg(car.reg) }}</b></div>
      <div class="car-price" v-html="priceHtml"></div>
    </div>
  </router-link>
</template>

<script>
/* #AI:dev 车源卡片组件 */
import { t, carName, fmtMileage, fmtReg, fmtPriceDualHTML } from "@/i18n";
export default {
  name: "CarCard",
  props: { car: { type: Object, required: true } },
  computed: {
    priceHtml() {
      this.$lang();
      return this.$lang() === "zh"
        ? this.escHtml(String(this.car.price)) + "<small>万</small>"
        : fmtPriceDualHTML(this.car.price);
    }
  },
  methods: {
    t, carName, fmtMileage, fmtReg,
    escHtml(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  }
};
</script>
