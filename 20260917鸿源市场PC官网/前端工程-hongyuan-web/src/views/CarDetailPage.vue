<template>
  <div>
    <!-- 面包屑：市场名 > 我要买车 > 车型名 -->
    <div class="breadcrumb">
      <div class="wrap">
        <router-link to="/">{{ marketName() }}</router-link>
        <span class="bc-sep el-icon-arrow-right"></span>
        <router-link to="/buycar">{{ t("nav.buy") }}</router-link>
        <span class="bc-sep el-icon-arrow-right"></span>
        <span>{{ carName(car) }}</span>
      </div>
    </div>

    <div class="wrap">

    <!-- 上半：图集 + 信息（区块顺序按 PRD 验收 7：图集与信息 → 检测报告 → 车辆档案 → 车辆图片 → 联系方式与分享） -->
    <div class="detail-main">
      <div class="detail-gallery" @mouseenter="galPaused = true" @mouseleave="galPaused = false">
        <div class="dg-main" :style="mainBg" title="点击查看大图" @click="openModal">
          <img v-if="hasImg" class="dg-img" :src="car.imgs[curShot]" :alt="car.imgText">
          <span v-else class="ci-text">{{ car.imgText }} · {{ t(shots[curShot]) }}</span>
          <span class="dg-zoom-tip">{{ t("dt.zoom") }}</span>
        </div>
        <div class="dg-thumbs">
          <div v-for="(s, i) in shots" :key="i" class="dg-thumb" :class="{ on: i === curShot }"
            :style="thumbStyle(i)" @click="curShot = i">
            <img v-if="car.imgs && car.imgs[i]" :src="car.imgs[i]" alt="">
            <template v-else>{{ shotLabel(i) }}</template>
          </div>
        </div>
      </div>
      <div class="detail-info">
        <h1 class="di-title">{{ carName(car) }}</h1>
        <div class="di-tags">
          <span v-if="car.tags.indexOf('cert') > -1">{{ t("card.certTag") }}</span>
          <span>{{ V(car.emission) }}</span>
          <span>{{ bodyLabel(car.bodyType) }}</span>
          <span>{{ colorText }}</span>
          <span v-if="car.tradeType">{{ car.tradeType }}</span>
        </div>
        <div class="di-price-box">
          <!-- 现价：双币（zh=万/en=美元/ru=卢布+美元）；新车指导价单币种走 fmtPrice -->
          <span class="di-price" v-html="priceHtml"></span>
          <span class="di-price-old">{{ tf("dt.oldPrice", { p: fmtPrice(oldPrice) }) }}</span>
        </div>
        <table class="di-params">
          <tr v-for="(row, ri) in paramRows" :key="ri">
            <td class="pf">{{ row[0] }}</td><td class="pv">{{ row[1] }}</td>
            <td class="pf">{{ row[2] }}</td><td class="pv">{{ row[3] }}</td>
          </tr>
        </table>
        <div class="di-btns">
          <button class="btn btn-primary" @click="inqOpen = true"><i class="el-icon-s-comment"></i><span>{{ t("inq.btn") }}</span></button>
          <button ref="btnCall" class="btn btn-ghost" :aria-expanded="ctOpen ? 'true' : 'false'" @click="ctOpen = !ctOpen"><i class="el-icon-phone-outline"></i><span>{{ t("dt.callBtn") }}</span></button>
          <button type="button" class="btn btn-light" @click="copyLink"><i class="el-icon-document-copy"></i><span>{{ t("dt.copyLink") }}</span></button>
          <button type="button" class="btn btn-light" @click="makeNote"><i class="el-icon-document"></i><span>{{ t("dt.makeNote") }}</span></button>
        </div>
      </div>
    </div>

    <!-- 检测报告（REPLACE: 认证图 /img/report-268v.png；报告链接见 methods.viewReport，换车源/市场时替换 orderNo） -->
    <section class="detail-report ds-block">
      <h3 class="ds-title">{{ t("dt.report") }}</h3>
      <div class="report-box">
        <img class="report-img" src="/img/report-268v.png" alt="268V买车无忧检认证">
        <div class="report-side">
          <p v-html="reportTxtHtml"></p>
          <button type="button" class="btn btn-primary rp-btn" @click="viewReport">{{ t("dt.viewReport") }}</button>
        </div>
      </div>
    </section>

    <!-- 车辆档案（data/carProfiles.js 按车型独立配置；标题/表注按预览包保留中文演示文案） -->
    <section class="detail-archive ds-block">
      <h3 class="ds-title">车辆档案</h3>
      <div class="archive-grid">
        <div v-for="g in profileGroups" :key="g.title" class="archive-card">
          <h4>{{ g.title }}</h4>
          <table><tbody>
            <tr v-for="(row, ri) in g.rows" :key="ri"><th>{{ row[0] }}</th><td>{{ row[1] == null || row[1] === "" ? "—" : row[1] }}</td></tr>
          </tbody></table>
        </div>
      </div>
      <p class="archive-note">以上参配信息仅供参考，实际参数配置以售卖车辆为准（详细配置状况备注：• 标配 • 选配 • 无）</p>
    </section>

    <!-- 车辆图片：复用当前车源完整图片数组 -->
    <section class="detail-images ds-block">
      <h3 class="ds-title">车辆图片</h3>
      <div class="vehicle-images-grid" v-if="carImages.length">
        <figure v-for="(src, i) in carImages" :key="i" class="vehicle-image">
          <img :src="src" :alt="carName(car) + ' 车辆图片 ' + (i + 1)" loading="lazy">
        </figure>
      </div>
      <div v-else class="vehicle-images-empty">暂无车辆图片</div>
    </section>

    <!-- 下半：联系方式 / 分享 -->
    <div class="detail-sub">
      <div class="ds-block">
        <h3 class="ds-title">{{ t("dt.contact") }}</h3>
        <!-- REPLACE: 市场名称/介绍取 config.js（intro 的 {address} 由 i18n addressI() 三语注入） -->
        <div class="merchant-bar">
          <span class="mb-logo">{{ SITE.logoMark }}</span>
          <div>
            <div class="mb-name">{{ marketName() }}</div>
            <div class="mb-desc">{{ introText }}</div>
          </div>
          <span class="mb-tel">{{ t("ui.hotline") }} {{ SITE.hotline }}</span>
        </div>
      </div>
      <div class="ds-block">
        <h3 class="ds-title">{{ t("dt.share") }}</h3>
        <div class="share-box">
          <!-- REPLACE: 分享二维码占位，正式使用时替换为真实链接二维码 -->
          <div class="qr-ph" :data-label="t('dt.scanWechat')"></div>
          <div class="sb-tip" v-html="shareTipHtml"></div>
        </div>
      </div>
    </div>

    <!-- 大图弹层（点击空白/×关闭；图集自动轮播在放大时暂停） -->
    <div class="img-modal" :class="{ on: modalOpen }" @click.self="modalOpen = false">
      <div class="im-stage" :class="{ 'has-img': hasImg }" :style="modalBg">
        <button class="im-close" aria-label="关闭" @click="modalOpen = false"><i class="el-icon-close"></i></button>
        <img v-if="hasImg" class="dg-img" :src="car.imgs[curShot]" alt="">
        <span>{{ car.imgText + " · " + shotLabel(curShot) }}</span>
      </div>
    </div>

    <ContactPop :open="ctOpen" :anchor="$refs.btnCall" @close="ctOpen = false" />
    <InquiryPop :open="inqOpen" :car="car" @close="inqOpen = false" />
    </div>
  </div>
</template>

<script>
/* #AI:dev 车源详情页（迁移 cardetail.html：?id= 演示态默认第 1 条；图集切换/放大/自动轮播暂停；
   双币售价；咨询表单（省市联动）；立即联系下拉浮层；复制链接/生成笔记 fmtPriceDualText 三语多行文本） */
import { SITE } from "@/mixins/site";
import {
  t, tf, marketName, carName, fmtMileage, fmtReg, fmtGear, fmtPrice, fmtPriceDualHTML, fmtPriceDualText,
  V, bodyLabel, marketIntroI, addressI
} from "@/i18n";
import { CARS_DATA } from "@/data/cars";
import { CAR_PROFILES } from "@/data/carProfiles";
import { copyText, showToast } from "@/utils/clipboard";
import ContactPop from "@/components/ContactPop.vue";
import InquiryPop from "@/components/InquiryPop.vue";

const REDUCE_MOTION = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* REPLACE: 查看检测报告链接（当前为 268V 真实报告示例，换车源/换市场时替换 orderNo；PRD 替换点 #16） */
const REPORT_URL = "https://assets.souche.com/projects/cheyipai_wireless/cheyipai_f2e/web-app-report-analyse/#/analysis?orderNo=102023050615060857676957528&type=1";

export default {
  name: "CarDetailPage",
  components: { ContactPop, InquiryPop },
  mixins: [SITE],
  data() {
    return {
      shots: ["dt.shot1", "dt.shot2", "dt.shot3", "dt.shot4"],
      curShot: 0, galTimer: null, galPaused: false, modalOpen: false,
      ctOpen: false, inqOpen: false
    };
  },
  computed: {
    lang() { return this.$lang(); },
    car() {
      const id = parseInt(this.$route.query.id, 10) || 1;
      return CARS_DATA.filter(c => c.id === id)[0] || CARS_DATA[0];
    },
    hasImg() { return !!(this.car.imgs && this.car.imgs[this.curShot]); },
    mainBg() { return this.hasImg ? { background: "#fff" } : { background: this.galleryColor(this.curShot) }; },
    modalBg() { return this.hasImg ? { background: "#fff" } : { background: this.galleryColor(this.curShot) }; },
    priceHtml() {
      this.$lang();
      return this.$lang() === "zh" ? this.car.price + "<small>万</small>" : fmtPriceDualHTML(this.car.price);
    },
    oldPrice() { return (this.car.price * 1.35).toFixed(1); },
    colorText() {
      this.$lang();
      return V(this.car.color) + (this.$lang() === "zh" ? "色" : "");
    },
    paramRows() {
      this.$lang();
      const car = this.car;
      const rows = [
        [t("dt.p.reg"), car.reg], [t("dt.p.mileage"), fmtMileage(car.mileage)],
        [t("dt.p.gearbox"), fmtGear(car.gearbox)], [t("dt.p.displacement"), car.displacement],
        [t("dt.p.fuel"), V(car.fuel)], [t("dt.p.emission"), V(car.emission)],
        [t("dt.p.color"), V(car.color)], [t("dt.p.location"), this.provinceCityLabel()]
      ];
      const out = [];
      for (let i = 0; i < rows.length; i += 2) out.push([rows[i][0], rows[i][1], rows[i + 1][0], rows[i + 1][1]]);
      return out;
    },
    profileGroups() { return CAR_PROFILES[this.car.id] || []; },
    carImages() { return (this.car.imgs || []).filter(Boolean); },
    introText() {
      this.$lang();
      return marketIntroI().replace("{address}", addressI());
    },
    reportTxtHtml() { this.$lang(); return t("dt.reportTxt"); },
    shareTipHtml() { this.$lang(); return t("dt.shareTip"); }
  },
  watch: {
    lang() { /* 语言切换：Vue 响应式自动重渲染；同步 title（同预览包 __rerenderPage） */ this.setTitle(); },
    "car.id"() { this.curShot = 0; },
    modalOpen(v) { /* 大图打开时暂停图集轮播（同预览包 modalOpen() 判断） */ if (!v) this.galTickReset(); }
  },
  mounted() {
    this.setTitle();
    this.galAuto();
    document.addEventListener("keydown", this.onKey);
  },
  beforeDestroy() {
    clearInterval(this.galTimer);
    document.removeEventListener("keydown", this.onKey);
    document.body.style.overflow = "";
  },
  methods: {
    t, tf, marketName, carName, fmtMileage, fmtReg, fmtGear, fmtPrice, V, bodyLabel,
    setTitle() { document.title = carName(this.car) + " - " + marketName(); },
    /* REPLACE: 所在地显示取 config.address 的「省+市」前缀（预览包 provinceCityLabel） */
    provinceCityLabel() {
      const address = this.SITE.address || "";
      const match = address.match(/^(.+?省.+?市)/);
      return match ? match[1] : address;
    },
    shotLabel(i) {
      this.$lang();
      return (this.car.imgs && this.car.imgs[i]) ? t("dt.view") + " " + (i + 1) : t(this.shots[i]);
    },
    /* 占位图色块（无真图时）：预览包 shade() 色相偏移逻辑逐行迁移 */
    galleryColor(i) {
      if (i === 0) return this.car.imgColor;
      return "linear-gradient(135deg," + this.shade(this.car.imgColor, i) + ")";
    },
    shade(grad, i) {
      const m = grad.match(/#[0-9a-f]{6}/gi) || ["#5a7ea6", "#2f4d70"];
      const rot = hex => {
        const n = parseInt(hex.slice(1), 16);
        let r = (n >> 16) + i * 22, g = (n >> 8 & 255) + i * 14, b = (n & 255) + i * 8;
        r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      };
      return rot(m[0]) + "," + rot(m[1]);
    },
    thumbStyle(i) {
      if (this.car.imgs && this.car.imgs[i]) return {};
      return { background: this.galleryColor(i) };
    },
    galAuto() {
      clearInterval(this.galTimer);
      if (REDUCE_MOTION || !this.car.imgs) return;
      this.galTimer = setInterval(() => {
        if (this.galPaused || this.modalOpen || this.inqOpen) return;
        let has = false;
        for (let q = 0; q < 4; q++) if (this.car.imgs[q]) { has = true; break; }
        if (!has) return;
        let nxt = this.curShot;
        for (let k = 1; k <= 4; k++) {
          const cand = (this.curShot + k) % 4;
          if (this.car.imgs[cand]) { nxt = cand; break; }
        }
        if (nxt !== this.curShot) this.curShot = nxt;
      }, 4000);
    },
    galTickReset() { this.galAuto(); },
    openModal() { this.modalOpen = true; },
    viewReport() { window.open(REPORT_URL, "_blank"); },
    onKey(e) { if (e.key === "Escape") { this.modalOpen = false; this.ctOpen = false; } },
    /* 复制链接/生成笔记（carUrl 同预览包：当前页 URL ?id=；SPA 下取 location.origin + /cardetail?id=） */
    carUrl() {
      return location.origin + "/cardetail?id=" + this.car.id;
    },
    copyLink() { copyText(this.carUrl(), t("dt.copiedLink")); },
    makeNote() { copyText(this.buildNote(), t("dt.copiedNote")); },
    /* 生成笔记：三语多行文本（迁移 buildNote；售价 ru 双币 / 分隔走 fmtPriceDualText） */
    buildNote() {
      const L = this.$lang();
      const car = this.car;
      const lines = [];
      const priceTxt = L === "zh" ? car.price + "万" : fmtPriceDualText(car.price);
      if (L === "ru") {
        lines.push("🚗 " + carName(car));
        lines.push("Цена: " + priceTxt + " | Пробег: " + fmtMileage(car.mileage) + " | Рег.: " + car.reg);
        lines.push("КПП: " + fmtGear(car.gearbox) + " | Двигатель: " + car.displacement + " | Топливо: " + V(car.fuel));
        lines.push("Экокласс: " + V(car.emission) + " | Кузов: " + bodyLabel(car.bodyType) + " | Цвет: " + V(car.color));
        lines.push("Рынок: " + marketName() + " | Тел.: " + this.SITE.hotline);
        lines.push(this.carUrl());
      } else if (L === "en") {
        lines.push("🚗 " + carName(car));
        lines.push("Price: " + priceTxt + " | Mileage: " + fmtMileage(car.mileage) + " | Reg.: " + car.reg);
        lines.push("Gearbox: " + fmtGear(car.gearbox) + " | Engine: " + car.displacement + " | Fuel: " + V(car.fuel));
        lines.push("Emission: " + V(car.emission) + " | Body: " + bodyLabel(car.bodyType) + " | Color: " + V(car.color));
        lines.push("Market: " + marketName() + " | Tel: " + this.SITE.hotline);
        lines.push(this.carUrl());
      } else {
        lines.push("🚗 " + car.name);
        lines.push("价格：" + car.price + "万 | 里程：" + car.mileage + "万公里 | 上牌：" + car.reg);
        lines.push("变速箱：" + car.gearbox + " | 排量：" + car.displacement + " | 燃料：" + car.fuel);
        lines.push("排放：" + car.emission + " | 车型：" + car.bodyType + " | 颜色：" + car.color);
        lines.push("市场：" + this.SITE.marketName + " | 热线：" + this.SITE.hotline);
        lines.push(this.carUrl());
      }
      return lines.join("\n");
    }
  }
};
</script>
