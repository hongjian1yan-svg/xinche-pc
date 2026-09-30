<template>
  <div class="wrap">
    <div class="success-box">
      <div class="success-icon el-icon-success"></div>
      <h2>{{ t("sc.title") }}</h2>
      <p v-html="tipHtml"></p>
      <!-- REPLACE: 服务热线（config.hotline，唯一配置来源） -->
      <p><span>{{ t("ui.hotline") }}</span>：<b>{{ SITE.hotline }}</b></p>
      <!-- 演示回显：卖车页跳转时携带的表单摘要参数（预览包为独立静态页无此逻辑；开发接入真实提交后删除本块） -->
      <div class="success-echo" v-if="hasEcho">
        <div v-for="row in echoRows" :key="row[0]">{{ row[0] }}：{{ row[1] }}</div>
      </div>
      <div class="success-btns">
        <router-link class="btn btn-primary" to="/">{{ t("sc.btn1") }}</router-link>
        <router-link class="btn btn-ghost" to="/buycar">{{ t("sc.btn2") }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
/* #AI:dev 提交成功页（迁移 success.html + 任务要求「成功页参数回显」：URL query 摘要展示） */
import { SITE } from "@/mixins/site";
import { t, tf, marketName, escHtml } from "@/i18n/pagehelpers";

export default {
  name: "SuccessPage",
  mixins: [SITE],
  computed: {
    tipHtml() {
      this.$lang();
      return tf("sc.tip", { m: escHtml(marketName()) });
    },
    hasEcho() {
      const q = this.$route.query;
      return !!(q.model || q.phone);
    },
    echoRows() {
      this.$lang();
      const q = this.$route.query;
      const rows = [];
      if (q.model) rows.push([t("sl.fModel"), q.model]);
      if (q.city) rows.push([t("sl.fCity"), q.city]);
      if (q.reg) rows.push([t("sl.fReg"), q.reg]);
      if (q.mile) rows.push([t("sl.fMile"), q.mile + " " + t("sl.unitWanKm")]);
      if (q.price) rows.push([t("sl.fPrice"), q.price + " " + t("sl.unitWan")]);
      if (q.name) rows.push([t("sl.fName"), q.name]);
      if (q.phone) rows.push([t("sl.fPhone"), q.phone]);
      return rows;
    }
  },
  mounted() { document.title = t("pt.success") + " - " + marketName(); },
  watch: { lang() { document.title = t("pt.success") + " - " + marketName(); } },
  methods: { t, marketName }
};
</script>

<style scoped>
.success-echo { max-width: 460px; margin: 22px auto 0; text-align: left; background: var(--bg-gray); border-radius: 12px; padding: 14px 22px; font-size: 13px; color: #666; line-height: 2; }
</style>
