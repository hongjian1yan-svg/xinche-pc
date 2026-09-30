<template>
  <div>
    <!-- ① Banner 轮播：自动 4s 播放 + 左右箭头 + 圆点；悬停暂停；prefers-reduced-motion 时停自动（迁移 shouye.html） -->
    <div class="banner" @mouseenter="pauseBanner" @mouseleave="resumeBanner">
      <div class="banner-track">
        <div v-for="(b, i) in banners" :key="i" class="banner-slide" :class="{ on: i === bannerCur }" :style="bannerStyle(b)">
          <div class="bs-inner">
            <div class="bs-name">{{ bannerTitle(b, i) }}</div>
            <div class="bs-sub">{{ bannerSub(b, i) }}</div>
            <div class="bs-tags"><span v-for="(x, xi) in serviceTags" :key="xi">{{ x }}</span></div>
            <!-- REPLACE: 服务热线（config.hotline） -->
            <div class="bs-phone"><small>{{ t("ui.hotline") }}</small>{{ SITE.hotline }}</div>
          </div>
        </div>
      </div>
      <button class="banner-arrow ba-prev" aria-label="上一张" @click="goBanner(bannerCur - 1)"><i class="el-icon-arrow-left"></i></button>
      <button class="banner-arrow ba-next" aria-label="下一张" @click="goBanner(bannerCur + 1)"><i class="el-icon-arrow-right"></i></button>
      <div class="banner-dots">
        <i v-for="(b, i) in banners" :key="i" :class="{ on: i === bannerCur }" @click="goBanner(i)"></i>
      </div>
    </div>

    <!-- ② 我要买车区 + 快速卖车卡片（灰底分区）；搜索仅首页，回车/点按钮跳列表页带 ?kw= -->
    <div class="home-buy">
      <form class="home-search wrap" role="search" @submit.prevent="doSearch">
        <button type="submit" aria-label="搜索"><i class="el-icon-search"></i></button>
        <div class="home-search-field">
          <input type="search" v-model="kw" placeholder=" " autocomplete="off" aria-labelledby="homeSearchLabel">
          <label id="homeSearchLabel" for="siteSearchInput">{{ t("ui.searchPh") }}</label>
        </div>
      </form>
      <div class="wrap home-buy-panels">
        <div class="buy-panel">
          <h2 class="sec-title"><span>{{ t("home.buyTitle") }}</span><router-link class="st-arrow" to="/buycar" aria-label="进入买车列表"><i class="el-icon-arrow-right"></i></router-link></h2>
          <!-- 品牌行：两排翻页（8 + 7+更多），第二排末尾「更多」→列表页；品牌点击带 ?brand= -->
          <div class="buy-row">
            <span class="br-label">{{ t("f.brand") }}</span>
            <button class="br-arrow" type="button" aria-label="上一页" :disabled="brandPage === 0" @click="brandPage > 0 && brandPage--"><i class="el-icon-arrow-left"></i></button>
            <div class="br-viewport">
              <div class="br-track">
                <router-link v-for="item in brandItems" :key="item.key" class="buy-brand" :class="{ 'br-more': item.more }" :to="item.to">
                  <span v-if="item.logo" class="bb-logo bb-img" :style="item.logoFailed ? 'display:none' : ''">
                    <img :src="item.logo" alt="" loading="lazy" @error="item.onFail">
                  </span>
                  <span v-if="!item.logo || item.logoFailed" class="bb-logo" :class="{ 'bb-fallback': !!item.logo }" :style="item.logoStyle"><i v-if="item.more" class="el-icon-more"></i><template v-else>{{ item.mark }}</template></span>
                  <span class="bb-name">{{ item.name }}</span>
                </router-link>
              </div>
            </div>
            <button class="br-arrow" type="button" aria-label="下一页" :disabled="brandPage >= 1" @click="brandPage < 1 && brandPage++"><i class="el-icon-arrow-right"></i></button>
          </div>
          <!-- 价格区间行（标签走 priceLabel 三语换算；点击带 ?pmin=&pmax=） -->
          <div class="buy-row">
            <span class="br-label">{{ t("f.price") }}</span>
            <div class="br-chips">
              <router-link class="buy-chip is-on" to="/buycar">{{ t("f.any") }}</router-link>
              <router-link v-for="p in HOME_PRICE_RANGES" :key="p.label" class="buy-chip"
                :to="{ path: '/buycar', query: { pmin: p.min, pmax: p.max } }">{{ priceLabel(p.min, p.max) }}</router-link>
            </div>
          </div>
          <!-- 级别行 -->
          <div class="buy-row">
            <span class="br-label">{{ t("f.level") }}</span>
            <div class="br-chips">
              <router-link class="buy-chip is-on" to="/buycar">{{ t("f.any") }}</router-link>
              <router-link v-for="x in HOME_BODY_TYPES" :key="x" class="buy-chip"
                :to="{ path: '/buycar', query: { body: x } }">{{ bodyLabel(x) }}</router-link>
            </div>
          </div>
        </div>
        <!-- 快速卖车卡片（三大卖点 config.sellAdvantages） -->
        <div class="sell-card">
          <h2 class="sec-title"><span>{{ t("home.sellTitle") }}</span><router-link class="st-arrow" to="/sellcars" aria-label="进入卖车页"><i class="el-icon-arrow-right"></i></router-link></h2>
          <ul><li v-for="(s, i) in sellAdvantages" :key="i">{{ s }}</li></ul>
          <div class="sc-btns">
            <router-link class="btn btn-primary" to="/sellcars">{{ t("home.btnSell") }}</router-link>
            <router-link class="btn btn-light" to="/sellcars">{{ t("home.btnVal") }}</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- ③ 今日推荐：Tab 前端切换本地数据（每 Tab 前 8 台） -->
    <div class="home-reco">
      <div class="reco-tabs">
        <span v-for="x in RECO_TABS" :key="x.key" class="reco-tab" :class="{ active: x.key === recoKey }" @click="recoKey = x.key">{{ t("tabs." + x.key) }}</span>
      </div>
      <div class="reco-grid">
        <CarCard v-for="c in recoCars" :key="c.id" :car="c" />
        <div v-if="!recoCars.length" class="empty">{{ t("home.empty") }}</div>
      </div>
      <div class="reco-more"><router-link class="btn btn-ghost" to="/buycar">{{ t("home.viewMore") }} <i class="el-icon-arrow-right"></i></router-link></div>
    </div>

    <!-- ④ 汇率展示（data/rates.js 演示数据；REPLACE: 正式接入实时汇率接口时替换数据源并同步 i18n 换算汇率） -->
    <div class="home-rates">
      <h2 class="sec-title-mid">{{ t("home.ratesTitle") }}</h2>
      <div class="rates-list">
        <div v-for="r in RATES_DATA" :key="r.from + r.to" class="rate-card">
          <div class="rc-updated">{{ r.updated }} {{ t("rates.updated") }}</div>
          <div class="rc-left">
            <div class="rc-flags" v-html="flagPair(r)"></div>
            <div class="rc-title">{{ t("rate." + r.from) }} — {{ t("rate." + r.to) }}</div>
          </div>
          <div class="rc-right">
            <div class="rc-value">{{ r.rate.toFixed(2) }}</div>
            <div class="rc-sub">{{ t("rates.rateLabel") }} 1{{ r.from.toUpperCase() }} = {{ r.to === "cny" ? r.rate.toFixed(3) : r.rate.toFixed(2) }}{{ r.to.toUpperCase() }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* #AI:dev 首页（迁移 shouye.html：Banner/搜索/买车区/今日推荐/汇率 四区 + 语言即时重渲染） */
import { SITE } from "@/mixins/site";
import { t, tf, tArr, tOr, marketName, priceLabel, bodyLabel, brandName } from "@/i18n";
import { CARS_DATA, HOME_BRANDS, BRAND_LOGOS, HOME_PRICE_RANGES, HOME_BODY_TYPES, RECO_TABS } from "@/data/cars";
import { RATES_DATA, flagSVG } from "@/data/rates";
import CarCard from "@/components/CarCard.vue";

const REDUCE_MOTION = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const BRAND_COLORS = ["#333", "#5a7ea6", "#8a4f2a", "#274b77", "#37624a", "#6b3434", "#4c5f73", "#1d3557"];

export default {
  name: "HomePage",
  components: { CarCard },
  mixins: [SITE],
  data() {
    return {
      HOME_PRICE_RANGES, HOME_BODY_TYPES, RECO_TABS, RATES_DATA,
      bannerCur: 0, bannerTimer: null,
      kw: "", brandPage: 0, logoFailed: {},
      recoKey: RECO_TABS[0].key
    };
  },
  computed: {
    lang() { return this.$lang(); },
    banners() { this.$lang(); return this.SITE.banners; },
    serviceTags() { this.$lang(); return tArr("home.serviceTags", this.SITE.serviceTags); },
    sellAdvantages() { this.$lang(); return tArr("home.sellAdvantages", this.SITE.sellAdvantages); },
    recoCars() {
      this.$lang();
      return CARS_DATA.filter(c => c.tags.indexOf(this.recoKey) > -1).slice(0, 8);
    },
    brandItems() {
      this.$lang();
      const slice = this.brandPage === 0 ? HOME_BRANDS.slice(0, 8) : HOME_BRANDS.slice(8, 15);
      const items = slice.map((b, i) => {
        const gi = this.brandPage * 8 + i;
        const self = this;
        return {
          key: b,
          to: { path: "/buycar", query: { brand: b } },
          name: brandName(b),
          logo: BRAND_LOGOS[b] || "",
          logoFailed: !!this.logoFailed[b],
          onFail() { self.$set(self.logoFailed, b, true); },
          logoStyle: { background: BRAND_COLORS[gi % BRAND_COLORS.length] },
          mark: this.$lang() === "zh" ? b.slice(0, 1) : brandName(b).slice(0, 1).toUpperCase(),
          more: false
        };
      });
      if (this.brandPage === 1) {
        items.push({
          key: "__more", to: "/buycar", name: t("f.more"), logo: "", logoFailed: true,
          logoStyle: {}, mark: "", more: true, onFail() {}
        });
      }
      return items;
    }
  },
  mounted() {
    document.title = marketName() + " - " + t("pt.home");
    this.autoBanner();
  },
  /* 语言切换同步 title（同预览包 __rerenderPage 首行） */
  watch: {
    lang() { document.title = marketName() + " - " + t("pt.home"); }
  },
  beforeDestroy() { clearInterval(this.bannerTimer); },
  methods: {
    t, tf, marketName, priceLabel, bodyLabel, flagSVG,
    bannerTitle(b, i) { this.$lang(); return tOr("home.banner" + (i + 1) + ".title", b.title); },
    bannerSub(b, i) { this.$lang(); return tOr("home.banner" + (i + 1) + ".sub", b.sub); },
    bannerStyle(b) {
      /* 同预览包：有图=深色渐变遮罩+右置 cover 图；无图=配置底色渐变 */
      if (b.img) {
        return {
          backgroundImage: "linear-gradient(90deg,rgba(0,22,58,.82) 0%,rgba(0,22,58,.55) 38%,rgba(0,22,58,.12) 62%,rgba(0,22,58,0) 78%),url(" + b.img + ")",
          backgroundSize: "cover", backgroundPosition: "right center"
        };
      }
      return { background: b.bg };
    },
    goBanner(i) {
      const n = this.SITE.banners.length;
      this.bannerCur = (i + n) % n;
      this.resetBanner();
    },
    autoBanner() {
      if (REDUCE_MOTION) return;
      clearInterval(this.bannerTimer);
      this.bannerTimer = setInterval(() => {
        this.bannerCur = (this.bannerCur + 1) % this.SITE.banners.length;
      }, 4000);
    },
    pauseBanner() { clearInterval(this.bannerTimer); },
    resumeBanner() { this.autoBanner(); },
    resetBanner() { this.pauseBanner(); this.autoBanner(); },
    doSearch() {
      const kw = this.kw.trim();
      this.$router.push({ path: "/buycar", query: kw ? { kw } : {} });
    },
    flagPair(r) { return flagSVG(r.from) + flagSVG(r.to); }
  }
};
</script>
