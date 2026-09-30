<template>
  <div>
    <!-- 头部大图区：左「三大优势」+ 右「发布卖车信息」表单卡（REPLACE: 背景图 /img/sell-bg.png 正式上线替换市场实拍图） -->
    <div class="sell-hero">
      <div class="sh-adv">
        <h2>{{ advTitle }}</h2>
        <ul><li v-for="(s, i) in sellAdvantages" :key="i">{{ s }}</li></ul>
      </div>
      <div class="sell-form-card">
        <div class="sf-head">
          <h3>{{ t("sl.formHead1") }}</h3>
          <p>{{ t("sl.formHead2") }}</p>
        </div>
        <div class="sf-body">
          <form @submit.prevent="submit" novalidate>
            <div class="sf-row">
              <div class="sf-field" :class="{ err: errs.model }">
                <label class="sf-label">{{ t("sl.fModel") }}</label>
                <ElSelect v-model="form.model" :options="modelOptions" :placeholder="t('sl.fModel')" @input="clear('model')" />
              </div>
            </div>
            <div class="sf-err" :class="{ on: errs.model }">{{ t("sl.eModel") }}</div>
            <div class="sf-row">
              <div class="sf-field" :class="{ err: errs.city }">
                <label class="sf-label">{{ t("sl.fCity") }}</label>
                <ElSelect v-model="form.city" :options="cityOptions" :placeholder="t('sl.fCity')" @input="clear('city')" />
              </div>
              <div class="sf-field" :class="{ err: errs.reg }">
                <label class="sf-label">{{ t("sl.fReg") }}</label>
                <ElSelect v-model="form.reg" :options="regOptions" :placeholder="t('sl.fReg')" @input="clear('reg')" />
              </div>
            </div>
            <div class="sf-err" :class="{ on: errs.city }">{{ t("sl.eCity") }}</div>
            <div class="sf-err" :class="{ on: errs.reg }">{{ t("sl.eReg") }}</div>
            <div class="sf-row">
              <div class="sf-field" :class="{ err: errs.mile }">
                <label class="sf-label">{{ t("sl.fMile") }}</label>
                <span class="sf-unitwrap"><input type="number" v-model="form.mile" class="has-unit" min="0" step="0.1" @input="clear('mile')"><span class="sf-unit">{{ t("sl.unitWanKm") }}</span></span>
              </div>
              <div class="sf-field">
                <label class="sf-label">{{ t("sl.fPrice") }}</label>
                <span class="sf-unitwrap"><input type="number" v-model="form.price" class="has-unit" min="0" step="0.1"><span class="sf-unit">{{ t("sl.unitWan") }}</span></span>
              </div>
            </div>
            <div class="sf-err" :class="{ on: errs.mile }">{{ t("sl.eMile") }}</div>
            <div class="sf-row">
              <div class="sf-field">
                <label class="sf-label">{{ t("sl.fName") }}</label>
                <input type="text" v-model="form.name">
              </div>
            </div>
            <div class="sf-row">
              <div class="sf-field" :class="{ err: errs.phone }">
                <label class="sf-label">{{ t("sl.fPhone") }}</label>
                <input type="tel" v-model.trim="form.phone" :maxlength="isZh ? 11 : 20" :placeholder="isZh ? '' : '+86 138 0000 0000'" @input="clear('phone')">
              </div>
            </div>
            <div class="sf-err" :class="{ on: errs.phone }">{{ t("sl.ePhone") }}</div>
            <!-- 邮箱：仅英/俄显示（海外用户无国内短信通道，改为邮箱联系） -->
            <div class="sf-row" v-if="!isZh">
              <div class="sf-field" :class="{ err: errs.mail }">
                <label class="sf-label">{{ t("sl.fMail") }}</label>
                <input type="email" v-model.trim="form.mail" placeholder="name@example.com" @input="clear('mail')">
              </div>
            </div>
            <div class="sf-err" :class="{ on: errs.mail }" v-if="!isZh">{{ t("sl.eMail") }}</div>
            <!-- 验证码：仅中文显示（演示态：占位 60s 倒计时，不真实发送） -->
            <div class="sf-row sf-code" v-if="isZh">
              <div class="sf-field" :class="{ err: errs.code }">
                <label class="sf-label">{{ t("sl.fCode") }}</label>
                <input type="text" v-model.trim="form.code" maxlength="6" @input="clear('code')">
              </div>
              <button type="button" class="sf-code-btn" :disabled="codeLeft > 0" @click="getCode">{{ codeBtnText }}</button>
            </div>
            <div class="sf-err" :class="{ on: errs.code }" v-if="isZh">{{ t("sl.eCode") }}</div>
            <button type="submit" class="sf-submit">{{ t("sl.submit") }}</button>
          </form>
        </div>
      </div>
    </div>

    <!-- 三大优势卡片（下方灰底分区） -->
    <div class="sell-adv-low">
      <div class="wrap">
        <h2 class="sec-title" style="text-align:center">{{ advTitle }}</h2>
        <div class="adv-cards">
          <div v-for="a in advCards" :key="a.t" class="adv-card">
            <div class="ac-icon" :class="a.icon"></div>
            <h4>{{ a.t }}</h4>
            <p>{{ a.d }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* #AI:dev 我要卖车页（迁移 sellcars.html：表单为前端演示态，必填校验通过后跳 /success，不落库不请求）
   语言差异：zh=手机号(11位)+验证码(4-6位)；en/ru=手机号+邮箱 */
import { SITE } from "@/mixins/site";
import { t, tf, marketName, marketShort, tArr, brandName, seriesName } from "@/i18n";
import { CARS_DATA } from "@/data/cars";
import ElSelect from "@/components/ElSelect.vue";

export default {
  name: "SellCarsPage",
  components: { ElSelect },
  mixins: [SITE],
  data() {
    return {
      form: { model: "", city: "", reg: "", mile: "", price: "", name: "", phone: "", code: "", mail: "" },
      errs: { model: false, city: false, reg: false, mile: false, phone: false, code: false, mail: false },
      codeLeft: 0, codeTimer: null
    };
  },
  computed: {
    isZh() { return this.$lang() === "zh"; },
    lang() { return this.$lang(); },
    advTitle() { this.$lang(); return tf("sl.advTitle", { m: marketShort() }); },
    sellAdvantages() { this.$lang(); return tArr("home.sellAdvantages", this.SITE.sellAdvantages); },
    advCards() {
      this.$lang();
      return [
        { icon: "el-icon-lightning", t: t("sl.adv1t"), d: t("sl.adv1d") },
        { icon: "el-icon-money", t: t("sl.adv2t"), d: t("sl.adv2d") },
        { icon: "el-icon-s-check", t: t("sl.adv3t"), d: t("sl.adv3d") }
      ];
    },
    modelOptions() {
      this.$lang();
      return [{ value: "", label: t("sl.fModel") }].concat(CARS_DATA.map(c => ({
        value: c.brand + " " + c.series,
        label: this.$lang() === "zh" ? c.brand + " " + c.series : brandName(c.brand) + " " + seriesName(c.series)
      })));
    },
    cityOptions() {
      this.$lang();
      const v = [t("sl.city1"), t("sl.city2")];
      return [{ value: "", label: t("sl.fCity") }].concat(v.map(x => ({ value: x, label: x })));
    },
    /* 首次上牌：当前月往前 180 个月（同预览包） */
    regOptions() {
      this.$lang();
      const nowY = new Date().getFullYear(), nowM = new Date().getMonth() + 1;
      const out = [{ value: "", label: t("sl.fReg") }];
      for (let back = 0; back <= 180; back++) {
        const yy = nowY - Math.floor((back + (12 - nowM)) / 12);
        const mm = ((nowM - 1 - back) % 12 + 12) % 12 + 1;
        const v = yy + "-" + (mm < 10 ? "0" + mm : mm);
        out.push({ value: v, label: v });
      }
      return out;
    },
    codeBtnText() {
      this.$lang();
      return this.codeLeft > 0 ? tf("sl.resend", { s: this.codeLeft }) : t("sl.getCode");
    }
  },
  watch: {
    /* 语言切换：按原型重置表单（PRD §6 详情页咨询规则同样适用卖车表单语言差异切换） */
    lang() {
      this.form.code = ""; this.form.mail = "";
      this.errs = { model: false, city: false, reg: false, mile: false, phone: false, code: false, mail: false };
      document.title = t("pt.sell") + " - " + marketName();
    }
  },
  mounted() { document.title = t("pt.sell") + " - " + marketName(); },
  beforeDestroy() { clearInterval(this.codeTimer); },
  methods: {
    t, marketName,
    clear(k) { this.$set(this.errs, k, false); },
    /* 验证码占位：60s 重发倒计时（演示，不真实发送） */
    getCode() {
      if (this.codeLeft > 0) return;
      this.codeLeft = 60;
      this.codeTimer = setInterval(() => {
        this.codeLeft--;
        if (this.codeLeft <= 0) clearInterval(this.codeTimer);
      }, 1000);
    },
    submit() {
      let bad = false;
      const f = this.form;
      bad = (this.errs.model = !f.model) || bad;
      bad = (this.errs.city = !f.city) || bad;
      bad = (this.errs.reg = !f.reg) || bad;
      const mile = parseFloat(f.mile);
      bad = (this.errs.mile = !(mile >= 0 && f.mile !== "")) || bad;
      const phoneOk = this.isZh ? /^1[3-9]\d{9}$/.test(f.phone) : /^[+\d][\d\s-]{6,19}$/.test(f.phone);
      bad = (this.errs.phone = !phoneOk) || bad;
      if (this.isZh) {
        bad = (this.errs.code = !/^\d{4,6}$/.test(f.code)) || bad;
      } else {
        bad = (this.errs.mail = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.mail)) || bad;
      }
      if (bad) {
        const first = this.$el.querySelector(".sf-field.err");
        if (first) first.scrollIntoView({ block: "center", behavior: "smooth" });
        return;
      }
      /* 演示态：不落库不请求，跳成功页并带表单摘要参数供回显 */
      this.$router.push({
        path: "/success",
        query: {
          model: f.model, city: f.city, reg: f.reg, mile: f.mile,
          price: f.price, phone: f.phone, name: f.name
        }
      });
    }
  }
};
</script>
