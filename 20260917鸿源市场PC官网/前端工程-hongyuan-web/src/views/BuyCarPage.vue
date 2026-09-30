<template>
  <div>
    <!-- 面包屑：市场名 > 全国二手车 -->
    <div class="breadcrumb">
      <div class="wrap">
        <router-link to="/">{{ marketName() }}</router-link>
        <span class="bc-sep el-icon-arrow-right"></span>
        <span>{{ t("crumb.national") }}</span>
      </div>
    </div>

    <CarFilter v-model="state" @clear-all="clearAll" @remove-kw="removeKw" />

    <div class="wrap">
      <!-- 结果计数 + 排序栏 -->
      <div class="result-bar">
        <div class="result-count" v-html="resultCountHtml"></div>
        <div class="sort-bar">
          <span v-for="s in sortDefs" :key="s.key" class="sort-item" :class="{ active: state.sort === s.key }" @click="setSort(s)">
            <template v-if="s.arrows">
              <span>{{ s.label }}</span>
              <span class="s-arrows">
                <i class="el-icon-caret-top" :class="{ on: state.sort === s.key && state.dir === 'asc' }" @click.stop="setSortDir(s.key, 'asc')"></i>
                <i class="el-icon-caret-bottom" :class="{ on: state.sort === s.key && state.dir === 'desc' }" @click.stop="setSortDir(s.key, 'desc')"></i>
              </span>
            </template>
            <template v-else>{{ s.label }}</template>
          </span>
        </div>
      </div>

      <!-- 车源卡片网格（每行 4 张，前端切片分页） -->
      <div class="car-list">
        <CarCard v-for="c in pageCars" :key="c.id" :car="c" />
      </div>
      <div class="empty" :class="{ hidden: pageCars.length }">{{ t("list.empty") }}</div>

      <!-- 分页 -->
      <div class="pager" v-if="pages > 1">
        <button :disabled="state.page === 1" @click="goPage(state.page - 1)"><i class="el-icon-arrow-left"></i></button>
        <button v-for="i in pages" :key="i" :class="{ cur: i === state.page }" @click="goPage(i)">{{ i }}</button>
        <button :disabled="state.page === pages" @click="goPage(state.page + 1)"><i class="el-icon-arrow-right"></i></button>
      </div>
    </div>
  </div>
</template>

<script>
/* #AI:dev 我要买车列表页（迁移 buycar.html：筛选/排序/分页/已选回显均为前端对本地数据的演示态过滤）
   URL 查询参数约定沿用预览包：?kw= / ?brand= / ?body= / ?pmin=&pmax= —— 进入本页自动回显进筛选条件；
   移除条件时同步 router.replace 清掉对应参数 */
import { t, marketName, marketShort, tf, escHtml } from "@/i18n/pagehelpers";
import { CARS_DATA, HOME_PRICE_RANGES } from "@/data/cars";
import CarCard from "@/components/CarCard.vue";
import CarFilter from "@/components/CarFilter.vue";

const PAGE_SIZE = 8;
const uniq = arr => arr.filter((v, i) => arr.indexOf(v) === i);

const AGE_TESTS = [
  c => c.carAge <= 3, c => c.carAge > 3 && c.carAge <= 5,
  c => c.carAge > 5 && c.carAge <= 8, c => c.carAge > 8
];
const MIL_TESTS = [
  c => c.mileage < 1, c => c.mileage >= 1 && c.mileage < 3,
  c => c.mileage >= 3 && c.mileage < 5, c => c.mileage >= 5 && c.mileage < 10,
  c => c.mileage >= 10
];
function displaceMatch(c, label) {
  const d = parseFloat(c.displacement);
  if (isNaN(d)) return label === "1.0L及以下" && c.fuel === "纯电";
  if (label === "1.0L及以下") return d <= 1.0;
  if (label === "1.0-1.6L") return d > 1.0 && d <= 1.6;
  if (label === "1.6-2.0L") return d > 1.6 && d <= 2.0;
  return d > 2.0;
}

export default {
  name: "BuyCarPage",
  components: { CarCard, CarFilter },
  data() {
    return {
      PAGE_SIZE,
      state: this.initStateFromQuery()
    };
  },
  computed: {
    lang() { return this.$lang(); },
    sortDefs() {
      this.$lang();
      return [
        { key: "default", label: t("sort.default") },
        { key: "new", label: t("sort.new") },
        { key: "price", label: t("sort.price"), arrows: true },
        { key: "age", label: t("sort.age"), arrows: true },
        { key: "mileage", label: t("sort.mileage"), arrows: true }
      ];
    },
    filteredCars() {
      const v = this.state;
      return CARS_DATA.filter(c => {
        if (v.kw) {
          const kw = v.kw.toLowerCase();
          if ((c.name + c.brand + c.series).toLowerCase().indexOf(kw) === -1) return false;
        }
        if (v.brand && c.brand !== v.brand) return false;
        if (v.series && c.series !== v.series) return false;
        if (v.pmin != null && c.price < v.pmin) return false;
        if (v.pmax != null && c.price > v.pmax) return false;
        if (v.body && c.bodyType !== v.body) return false;
        if (v.gearbox && c.gearbox.split("(")[0] !== v.gearbox) return false;
        if (v.fuel && c.fuel !== v.fuel) return false;
        if (v.emission && c.emission !== v.emission) return false;
        if (v.carAge) {
          const i = ["3年以下", "3-5年", "5-8年", "8年以上"].indexOf(v.carAge);
          if (i > -1 && !AGE_TESTS[i](c)) return false;
        }
        if (v.mileage) {
          const i = ["1万公里以下", "1-3万公里", "3-5万公里", "5-10万公里", "10万公里以上"].indexOf(v.mileage);
          if (i > -1 && !MIL_TESTS[i](c)) return false;
        }
        if (v.displacement && !displaceMatch(c, v.displacement)) return false;
        return true;
      });
    },
    sortedCars() {
      const v = this.state;
      const l = this.filteredCars.slice();
      if (v.sort === "new") l.sort((a, b) => b.reg.localeCompare(a.reg));
      else if (v.sort === "price") l.sort((a, b) => v.dir === "asc" ? a.price - b.price : b.price - a.price);
      else if (v.sort === "age") l.sort((a, b) => v.dir === "asc" ? a.carAge - b.carAge : b.carAge - a.carAge);
      else if (v.sort === "mileage") l.sort((a, b) => v.dir === "asc" ? a.mileage - b.mileage : b.mileage - a.mileage);
      return l;
    },
    pages() { return Math.max(1, Math.ceil(this.sortedCars.length / PAGE_SIZE)); },
    pageCars() {
      /* 预览包 render() 中 page 越界自动收敛为末页 */
      let p = this.state.page;
      if (p > this.pages) p = this.pages;
      return this.sortedCars.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);
    },
    resultCountHtml() {
      this.$lang();
      return escHtml(tf("rc.text", { n: "@N@", m: marketShort() })).replace("@N@", '<b id="rcCount">' + this.sortedCars.length + "</b>");
    }
  },
  watch: {
    /* 路由参数变化（首页搜索/品牌入口再次进入）→ 回显 */
    "$route.query": {
      handler(q) {
        this.state = Object.assign({}, this.state, this.queryPatch(q));
      }
    },
    "state.page"(v) {
      if (v > this.pages) this.state.page = this.pages;
    },
    /* 语言切换同步 title（同预览包 __rerenderPage） */
    lang() { this.setTitle(); }
  },
  mounted() { this.setTitle(); },
  methods: {
    t, marketName,
    setTitle() { document.title = t("pt.buy") + " - " + marketName(); },
    initStateFromQuery() {
      const q = this.$route.query;
      return Object.assign({
        kw: "", brand: "", series: "",
        priceKey: "", pmin: null, pmax: null,
        body: "", carAge: "", gearbox: "", mileage: "", emission: "", displacement: "", fuel: "",
        sort: "default", dir: "asc", page: 1
      }, this.queryPatch(q));
    },
    queryPatch(q) {
      const patch = {};
      if (q.kw) patch.kw = String(q.kw);
      if (q.brand) patch.brand = String(q.brand);
      if (q.body) patch.body = String(q.body);
      const hasP = q.pmin != null || q.pmax != null;
      if (hasP) {
        patch.pmin = q.pmin === "" || q.pmin == null ? null : parseFloat(q.pmin);
        patch.pmax = q.pmax === "" || q.pmax == null ? null : parseFloat(q.pmax);
        const hit = HOME_PRICE_RANGES.filter(p => p.min === patch.pmin && p.max === patch.pmax)[0];
        patch.priceKey = hit ? hit.label : "";
      }
      return patch;
    },
    setSort(s) {
      this.state.sort = s.key;
      this.state.dir = "asc";
    },
    setSortDir(key, dir) {
      this.state.sort = key;
      this.state.dir = dir;
    },
    goPage(p) {
      if (p < 1 || p > this.pages) return;
      this.state.page = p;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    clearAll() {
      this.state = {
        kw: "", brand: "", series: "", priceKey: "", pmin: null, pmax: null,
        body: "", carAge: "", gearbox: "", mileage: "", emission: "", displacement: "", fuel: "",
        sort: this.state.sort, dir: this.state.dir, page: 1
      };
      this.syncUrl({ kw: 1, brand: 1, body: 1, pmin: 1, pmax: 1 });
    },
    removeKw() {
      this.state.kw = "";
      this.syncUrl({ kw: 1 });
    },
    /* 预览包 safeClearUrl 对应实现：移除条件后同步清理地址栏查询参数 */
    syncUrl(dropKeys) {
      const q = Object.assign({}, this.$route.query);
      Object.keys(dropKeys).forEach(k => { delete q[k]; });
      this.$router.replace({ path: "/buycar", query: q }).catch(function () {});
    }
  }
};
</script>
