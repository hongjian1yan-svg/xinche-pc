<template>
  <div class="filter-wrap">
    <div class="wrap">
      <!-- 品牌行（预览包同构：不限 + 平铺选项 + 「更多」下拉；内部值始终存中文 label 保证过滤逻辑不变） -->
      <div class="filter-row">
        <span class="fr-label">{{ t("f.brand") }}</span>
        <div class="fr-opts">
          <span class="fr-opt" :class="{ on: !value.brand }" @click="pick('brand', '')">{{ t("f.any") }}</span>
          <span v-for="b in ALL_BRANDS" :key="b" class="fr-opt" :class="{ on: value.brand === b }" @click="pick('brand', b)">{{ brandName(b) }}</span>
          <div class="fr-drop" :class="{ open: drop === 'brandMore' }">
            <span class="fr-drop-btn" @click.stop="toggleDrop('brandMore')">{{ t("f.more") }}<i class="el-icon-caret-bottom"></i></span>
            <ul class="fr-drop-menu">
              <li :class="{ on: !value.brand }" @click.stop="pickDrop('brand', '')">{{ t("f.any") }}</li>
              <li v-for="b in ALL_BRANDS" :key="b" :class="{ on: value.brand === b }" @click.stop="pickDrop('brand', b)">{{ brandName(b) }}</li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 车系行（跟随品牌联动） -->
      <div class="filter-row">
        <span class="fr-label">{{ t("f.series") }}</span>
        <div class="fr-opts">
          <span class="fr-opt" :class="{ on: !value.series }" @click="pick('series', '')">{{ t("f.any") }}</span>
          <span v-for="s in seriesList" :key="s" class="fr-opt" :class="{ on: value.series === s }" @click="pick('series', s)">{{ seriesName(s) }}</span>
        </div>
      </div>
      <!-- #AI:dev:start -->
      <div class="filter-row">
        <span class="fr-label">{{ t("f.fuel") }}</span>
        <div class="fr-opts">
          <span class="fr-opt" :class="{ on: !value.fuel }" @click="pick('fuel', '')">{{ t("f.any") }}</span>
          <span v-for="f in fuelOptions" :key="f.label" class="fr-opt" :class="{ on: value.fuel === f.label }" @click="pick('fuel', f.label)">{{ f.loc }}</span>
        </div>
      </div>
      <!-- #AI:dev:end -->
      <!-- 价格行（预设区间 + 自定义输入；标题与胶囊顶对齐：.filter-row flex-start + .fr-label line-height:30px，v1.7 实测确认） -->
      <div class="filter-row">
        <span class="fr-label">{{ t("f.price") }}</span>
        <div class="fr-opts">
          <span class="fr-opt" :class="{ on: !value.priceKey }" @click="clearPrice">{{ t("f.any") }}</span>
          <span v-for="p in HOME_PRICE_RANGES" :key="p.label" class="fr-opt" :class="{ on: value.priceKey === p.label }" @click="pickPrice(p)">{{ priceLabel(p.min, p.max) }}</span>
          <span class="price-custom">
            <input type="number" v-model="customMin" min="0" placeholder="0"> -
            <input type="number" v-model="customMax" min="0" placeholder="0"> {{ t("pc.unit") }}
            <button class="pc-ok" @click="applyCustom">{{ t("pc.ok") }}</button>
          </span>
        </div>
      </div>
      <!-- 其它行（6 个下拉组） -->
      <div class="filter-row">
        <span class="fr-label">{{ t("f.other") }}</span>
        <div class="fr-opts">
          <div v-for="d in dropDefs" :key="d.key" class="fr-drop" :class="{ open: drop === d.key, 'open-self': !!value[d.key] }">
            <span class="fr-drop-btn" :class="{ on: !!value[d.key] }" @click.stop="toggleDrop(d.key)">
              {{ dropText(d) }}<i class="el-icon-caret-bottom"></i>
            </span>
            <ul class="fr-drop-menu">
              <li :class="{ on: !value[d.key] }" @click.stop="pickDrop(d.key, '')">{{ t("f.any") }}</li>
              <li v-for="o in d.options" :key="o.label" :class="{ on: value[d.key] === o.label }" @click.stop="pickDrop(d.key, o.label)">{{ o.loc }}</li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 已选条件标签（点 × 移除；「清空全部」重置并清 URL 参数） -->
      <div class="chosen-bar" v-if="chosenTags.length">
        <span>{{ t("chosen.label") }}</span>
        <span v-for="g in chosenTags" :key="g.k" class="chosen-tag">{{ g.t }}<b class="el-icon-close" @click="remove(g.k)"></b></span>
        <span class="chosen-tag clear-all" @click="remove('all')">{{ t("chosen.clear") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
/* #AI:dev 买车列表筛选区（迁移 buycar.html renderFilters/renderChosen + 事件委托逻辑）
   v-model 传整份筛选 state；选项枚举由 CARS_DATA 动态汇总（预览包口径；品牌/车系精简手造版=待确认#8） */
import { t, brandName, seriesName, priceLabel, V, fmtGear, bodyLabel } from "@/i18n";
import { CARS_DATA, HOME_PRICE_RANGES } from "@/data/cars";

const uniq = arr => arr.filter((v, i) => arr.indexOf(v) === i);

export default {
  name: "CarFilter",
  props: { value: { type: Object, required: true } },
  data() {
    return {
      HOME_PRICE_RANGES,
      drop: "",
      customMin: "", customMax: "",
      ALL_BRANDS: uniq(CARS_DATA.map(c => c.brand)),
      AGE_OPTS: [
        { label: "3年以下", ikey: "opt.age1" },
        { label: "3-5年", ikey: "opt.age2" },
        { label: "5-8年", ikey: "opt.age3" },
        { label: "8年以上", ikey: "opt.age4" }
      ],
      MILEAGE_OPTS: [
        { label: "1万公里以下", ikey: "opt.mil1" },
        { label: "1-3万公里", ikey: "opt.mil2" },
        { label: "3-5万公里", ikey: "opt.mil3" },
        { label: "5-10万公里", ikey: "opt.mil4" },
        { label: "10万公里以上", ikey: "opt.mil5" }
      ],
      DISPLACE_OPTS: [
        { label: "1.0L及以下", ikey: "opt.dis1" },
        { label: "1.0-1.6L", ikey: "opt.dis2" },
        { label: "1.6-2.0L", ikey: "opt.dis3" },
        { label: "2.0L以上", ikey: "opt.dis4" }
      ]
    };
  },
  computed: {
    /* 语言敏感的选项数组（computed 依赖 $lang，切语言即时刷新） */
    dropDefs() {
      this.$lang();
      const GEARBOXES = uniq(CARS_DATA.map(c => c.gearbox.split("(")[0]));
      const BODY_TYPES = uniq(CARS_DATA.map(c => c.bodyType));
      const EMISSION_OPTS = uniq(CARS_DATA.map(c => c.emission));
      const showIkey = o => ({ label: o.label, loc: t(o.ikey) });
      return [
        { key: "carAge", label: t("f.age"), options: this.AGE_OPTS.map(showIkey) },
        { key: "gearbox", label: t("f.gearbox"), options: GEARBOXES.map(g => ({ label: g, loc: fmtGear(g) })) },
        { key: "body", label: t("f.body"), options: BODY_TYPES.map(b => ({ label: b, loc: bodyLabel(b) })) },
        { key: "mileage", label: t("f.mileage"), options: this.MILEAGE_OPTS.map(showIkey) },
        { key: "emission", label: t("f.emission"), options: EMISSION_OPTS.map(e => ({ label: e, loc: V(e) })) },
        { key: "displacement", label: t("f.displacement"), options: this.DISPLACE_OPTS.map(showIkey) }
      ];
    },
    fuelOptions() {
      this.$lang();
      return uniq(CARS_DATA.map(c => c.fuel)).map(f => ({ label: f, loc: V(f) }));
    },
    seriesList() {
      this.$lang();
      const v = this.value;
      return v.brand
        ? uniq(CARS_DATA.filter(c => c.brand === v.brand).map(c => c.series))
        : uniq(CARS_DATA.map(c => c.series)).slice(0, 10);
    },
    chosenTags() {
      this.$lang();
      const v = this.value, tags = [];
      if (v.kw) tags.push({ k: "kw", t: t("cf.kw") + ": " + v.kw });
      if (v.brand) tags.push({ k: "brand", t: t("cf.brand") + ": " + brandName(v.brand) });
      if (v.series) tags.push({ k: "series", t: t("cf.series") + ": " + seriesName(v.series) });
      if (v.priceKey) {
        const pr = HOME_PRICE_RANGES.filter(x => x.label === v.priceKey)[0];
        tags.push({ k: "price", t: t("cf.price") + ": " + (pr ? priceLabel(pr.min, pr.max) : v.priceKey) });
      } else if (v.pmin != null || v.pmax != null) {
        tags.push({ k: "pcustom", t: t("cf.price") + ": " + (v.pmin == null ? 0 : v.pmin) + "-" + (v.pmax == null ? t("pc.unlimited") : v.pmax) + " " + t("pc.unit") });
      }
      if (v.body) tags.push({ k: "body", t: t("cf.body") + ": " + bodyLabel(v.body) });
      if (v.carAge) tags.push({ k: "carAge", t: t("cf.age") + ": " + this.optLabel(v.carAge, this.AGE_OPTS) });
      if (v.gearbox) tags.push({ k: "gearbox", t: t("cf.gearbox") + ": " + fmtGear(v.gearbox) });
      if (v.mileage) tags.push({ k: "mileage", t: t("cf.mileage") + ": " + this.optLabel(v.mileage, this.MILEAGE_OPTS) });
      if (v.emission) tags.push({ k: "emission", t: t("cf.emission") + ": " + V(v.emission) });
      if (v.displacement) tags.push({ k: "displacement", t: t("cf.displacement") + ": " + this.optLabel(v.displacement, this.DISPLACE_OPTS) });
      if (v.fuel) tags.push({ k: "fuel", t: t("cf.fuel") + ": " + V(v.fuel) });
      return tags;
    }
  },
  mounted() {
    document.addEventListener("click", this.closeDrop);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.closeDrop);
  },
  methods: {
    t, brandName, seriesName, priceLabel,
    optLabel(zhLabel, opts) {
      if (this.$lang() === "zh") return zhLabel;
      const o = opts.filter(x => x.label === zhLabel)[0];
      return o ? t(o.ikey) : zhLabel;
    },
    dropText(d) {
      const cur = this.value[d.key];
      if (!cur) return d.label;
      const o = d.options.filter(x => x.label === cur)[0];
      return o ? o.loc : cur;
    },
    toggleDrop(key) { this.drop = this.drop === key ? "" : key; },
    closeDrop() { this.drop = ""; },
    emit(patch) { this.$emit("input", Object.assign({}, this.value, patch, { page: 1 })); },
    pick(key, val) {
      const patch = {};
      patch[key] = val;
      if (key === "brand") patch.series = "";
      this.emit(patch);
    },
    pickDrop(key, val) {
      const patch = {};
      patch[key] = val;
      if (key === "brand") patch.series = "";
      this.drop = "";
      this.emit(patch);
    },
    pickPrice(p) {
      this.emit({ priceKey: p.label, pmin: p.min === 0 ? null : p.min, pmax: p.max === 999 ? null : p.max });
    },
    clearPrice() {
      this.emit({ priceKey: "", pmin: null, pmax: null });
    },
    applyCustom() {
      const a = parseFloat(this.customMin), b = parseFloat(this.customMax);
      this.emit({ pmin: isNaN(a) ? null : a, pmax: isNaN(b) ? null : b, priceKey: "" });
    },
    remove(k) {
      if (k === "all") {
        this.customMin = ""; this.customMax = "";
        this.$emit("clear-all");
        return;
      }
      if (k === "kw") { this.$emit("remove-kw"); return; }
      if (k === "price" || k === "pcustom") {
        this.customMin = ""; this.customMax = "";
        this.emit({ priceKey: "", pmin: null, pmax: null });
        return;
      }
      this.pick(k, "");
    }
  }
};
</script>

<style scoped>
/* 「清空全部」标签样式同预览包内联（白底虚线边框、手型） */
.chosen-tag.clear-all { background: #fff; border-style: dashed; cursor: pointer; }
</style>
