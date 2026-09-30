<template>
  <div>
    <!-- 遮罩（el-dialog 规格 rgba(0,0,0,.5)，锁滚动） -->
    <div class="mask" :class="{ on: open }" @click="close"></div>
    <!-- 咨询车况弹层（迁移 cardetail.html #inqPop：留资表单演示态，校验通过弹层内切成功态，不真实提交） -->
    <div class="inquiry-pop" :class="{ on: open }" role="dialog" aria-modal="true" v-if="open">
      <button class="ip-close" :aria-label="t('inq.close')" @click="close"><i class="el-icon-close"></i></button>
      <!-- 咨询车辆信息卡（双币价格辅价 12px 上下文适配由 CSS .inquiry-car 控制） -->
      <div class="inquiry-car">
        <img v-if="car.imgs && car.imgs[0]" :src="car.imgs[0]" alt="">
        <div>
          <div class="ic-name">{{ carName(car) }}</div>
          <div class="ic-meta" v-html="carMetaHtml"></div>
        </div>
      </div>
      <h4>{{ t("inq.title") }}</h4>

      <form v-if="!done" @submit.prevent="submit" novalidate>
        <div class="iq-row iq-two">
          <div class="iq-field" :class="{ err: errs.name }"><label>{{ t("inq.fName") }}</label><input type="text" v-model.trim="form.name" autocomplete="name" @input="clear('name')"></div>
          <div class="iq-field" :class="{ err: errs.mail }"><label>{{ t("inq.fMail") }}</label><input type="email" v-model.trim="form.mail" placeholder="name@example.com" autocomplete="email" @input="clear('mail')"></div>
        </div>
        <div class="iq-err" :class="{ on: errs.name }">{{ t("inq.eName") }}</div>
        <div class="iq-err" :class="{ on: errs.mail }">{{ t("inq.eMail") }}</div>
        <div class="iq-row iq-two">
          <div class="iq-field" :class="{ err: errs.phone }"><label>{{ t("inq.fPhone") }}</label><input type="tel" v-model.trim="form.phone" placeholder="+7 900 000-00-00" @input="clear('phone')"></div>
          <div class="iq-field" :class="{ err: errs.country }">
            <label>{{ t("inq.fCountry") }}</label>
            <ElSelect v-model="form.country" :options="countryOptions" :placeholder="t('inq.opt0')" @input="onCountry" />
          </div>
        </div>
        <div class="iq-err" :class="{ on: errs.phone }">{{ t("inq.ePhone") }}</div>
        <div class="iq-err" :class="{ on: errs.country }">{{ t("inq.eCountry") }}</div>
        <!-- 中国：省市联动且必填；其他国家隐藏且不校验（PRD §6） -->
        <div class="iq-row iq-two" v-if="isChina">
          <div class="iq-field" :class="{ err: errs.province }">
            <label>{{ t("inq.fProvince") }}</label>
            <ElSelect v-model="form.province" :options="provinceList" :placeholder="t('inq.opt0')" @input="onProvince" />
          </div>
          <div class="iq-field" :class="{ err: errs.city }">
            <label>{{ t("inq.fCity") }}</label>
            <ElSelect v-model="form.city" :options="cityList" :placeholder="t('inq.opt0')" @input="clear('city')" />
          </div>
        </div>
        <div class="iq-err" :class="{ on: errs.province }">{{ t("inq.eProvince") }}</div>
        <div class="iq-err" :class="{ on: errs.city }">{{ t("inq.eCity") }}</div>
        <div class="iq-row">
          <div class="iq-field" :class="{ err: errs.type }">
            <label>{{ t("inq.fType") }}</label>
            <ElSelect v-model="form.type" :options="typeOptions" :placeholder="t('inq.opt0')" @input="clear('type')" />
          </div>
        </div>
        <div class="iq-err" :class="{ on: errs.type }">{{ t("inq.eType") }}</div>
        <div class="iq-row">
          <div class="iq-field"><label>{{ t("inq.fMsg") }}</label><textarea v-model="form.msg" rows="3"></textarea></div>
        </div>
        <div class="iq-row iq-agree" :class="{ err: errs.agree }">
          <label class="iq-check"><input type="checkbox" v-model="form.agree" @change="clear('agree')"><i class="el-icon-check"></i></label>
          <span v-html="agreeHtml"></span>
        </div>
        <div class="iq-err" :class="{ on: errs.agree }">{{ t("inq.eAgree") }}</div>
        <button type="submit" class="btn btn-primary iq-submit">{{ t("inq.submit") }}</button>
      </form>

      <!-- 成功态（演示：不落库不请求） -->
      <div class="inq-done" v-else :style="{ display: 'block' }">
        <div class="el-icon-success"></div>
        <h5>{{ t("inq.doneT") }}</h5>
        <p>{{ t("inq.doneD") }}</p>
        <button class="iq-done-btn" type="button" @click="close">{{ t("inq.close") }}</button>
      </div>
    </div>
  </div>
</template>

<script>
/* #AI:dev 咨询车况弹层 */
import { t, carName, fmtMileage, fmtPriceDualHTML, COUNTRIES } from "@/i18n";
import { CHINA_REGIONS } from "@/data/chinaRegions";
import ElSelect from "@/components/ElSelect.vue";

export default {
  name: "InquiryPop",
  components: { ElSelect },
  props: {
    open: { type: Boolean, default: false },
    car: { type: Object, required: true }
  },
  data() {
    return {
      COUNTRIES,
      done: false,
      form: { name: "", mail: "", phone: "", country: "", province: "", city: "", type: "", msg: "", agree: false },
      errs: { name: false, mail: false, phone: false, country: false, province: false, city: false, type: false, agree: false }
    };
  },
  computed: {
    lang() { return this.$lang(); },
    countryIdx() { const L = this.$lang(); return L === "zh" ? 0 : (L === "en" ? 1 : 2); },
    isChina() { return this.form.country === "中国"; },
    countryOptions() {
      this.$lang();
      const idx = this.countryIdx;
      return [{ value: "", label: t("inq.opt0") }].concat(COUNTRIES.map(c => ({ value: c[0], label: c[idx] })));
    },
    typeOptions() {
      this.$lang();
      return [{ value: "", label: t("inq.opt0") }].concat(["q1", "q2", "q3", "q4", "q5", "q6"].map(k => ({ value: t("inq." + k), label: t("inq." + k) })));
    },
    provinceList() { return Object.keys(CHINA_REGIONS).map(p => ({ value: p, label: p })); },
    cityList() { return (CHINA_REGIONS[this.form.province] || []).map(c => ({ value: c, label: c })); },
    agreeHtml() { this.$lang(); return t("inq.agree") + ' <b class="req">*</b>'; },
    carMetaHtml() {
      this.$lang();
      return this.car.reg + " · " + this.esc(fmtMileage(this.car.mileage)) + " · <b>" + fmtPriceDualHTML(this.car.price) + "</b>";
    }
  },
  watch: {
    open(v) {
      /* 打开时重置（预览包 openInq 逻辑：上次已提交成功则回到表单态；切换语言重开同样重置表单，PRD §6） */
      if (v) {
        this.done = false;
        this.form = { name: "", mail: "", phone: "", country: "", province: "", city: "", type: "", msg: "", agree: false };
        this.errs = { name: false, mail: false, phone: false, country: false, province: false, city: false, type: false, agree: false };
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", this.onKey);
      } else {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", this.onKey);
      }
    }
  },
  beforeDestroy() {
    document.body.style.overflow = "";
    document.removeEventListener("keydown", this.onKey);
  },
  methods: {
    t, carName, fmtMileage,
    esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); },
    close() { this.$emit("close"); },
    onKey(e) { if (e.key === "Escape") this.close(); },
    onCountry() {
      /* 国家变化：清空省市与对应错误（同预览包 syncChinaRegion） */
      this.form.province = ""; this.form.city = "";
      this.errs.country = false; this.errs.province = false; this.errs.city = false;
    },
    onProvince() {
      this.form.city = "";
      this.errs.province = false; this.errs.city = false;
    },
    clear(k) { this.$set(this.errs, k, false); },
    submit() {
      let bad = false;
      const f = this.form;
      bad = (this.errs.name = !f.name) || bad;
      bad = (this.errs.mail = !/^[^@\s]+@[^@\s.]+(\.[^@\s.]+)+$/.test(f.mail)) || bad;
      bad = (this.errs.phone = !f.phone) || bad;
      bad = (this.errs.country = !f.country) || bad;
      if (f.country === "中国") {
        bad = (this.errs.province = !f.province) || bad;
        bad = (this.errs.city = !f.city) || bad;
      }
      bad = (this.errs.type = !f.type) || bad;
      bad = (this.errs.agree = !f.agree) || bad;
      if (bad) {
        const first = this.$el.querySelector(".iq-field.err");
        if (first) first.scrollIntoView({ block: "center", behavior: "smooth" });
        return;
      }
      /* 演示态：弹层内切换成功态，不真实提交 */
      this.done = true;
    }
  }
};
</script>
