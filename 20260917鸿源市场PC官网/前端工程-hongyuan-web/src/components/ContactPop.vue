<template>
  <!-- 立即联系下拉浮层（2026-09-28 YAN 确认：按钮正下方 8px、380px、无遮罩、不锁滚动；
       四行点击复制展示值 + toast「已复制」；外点/ESC 收起；空间不足上翻/钳制视口；数值取 config，不随语言翻译） -->
  <div class="contact-pop" :class="{ on: open }" ref="pop" :style="posStyle" role="dialog" :aria-label="t('dt.contactTitle')">
    <h4>{{ t("dt.contactTitle") }}</h4>
    <div class="cp-list">
      <button v-for="row in rows" :key="row.ikey" type="button" class="cp-item" @click="copy(row.value)">
        <img :src="'/img/contact/' + row.icon" alt=""><span class="cp-text">
          <span class="cp-name">{{ t(row.ikey) }}</span>
          <span class="cp-value">{{ row.value }}</span>
        </span>
      </button>
    </div>
  </div>
</template>

<script>
/* #AI:dev 立即联系浮层（迁移 cardetail.html renderContactPop/positionCt） */
import { SITE } from "@/mixins/site";
import { t } from "@/i18n";
import { copyText, showToast } from "@/utils/clipboard";

export default {
  name: "ContactPop",
  mixins: [SITE],
  props: {
    open: { type: Boolean, default: false },
    anchor: { default: null } /* 锚点按钮 DOM 节点（不声明 type，避免 Element 实例/HTML 节点类型告警） */
  },
  data() {
    return { pos: null };
  },
  computed: {
    rows() {
      this.$lang();
      const c = this.SITE.contact || {};
      const rows = [];
      if (this.SITE.hotline) rows.push({ icon: "phone.svg", ikey: "dt.ctHotline", value: this.SITE.hotline });
      if (c.email) rows.push({ icon: "mail.svg", ikey: "dt.ctEmail", value: c.email });
      if (c.whatsapp) rows.push({ icon: "whatsapp.svg", ikey: "dt.ctWhats", value: c.whatsapp });
      if (c.facebook) rows.push({ icon: "facebook.svg", ikey: "dt.ctFb", value: c.facebook });
      return rows;
    },
    posStyle() {
      if (!this.pos) return {};
      return { left: this.pos.left + "px", top: this.pos.top + "px" };
    }
  },
  watch: {
    open(v) {
      if (v) {
        this.$nextTick(this.position);
        document.addEventListener("click", this.onDocClick);
        document.addEventListener("keydown", this.onKey);
        window.addEventListener("scroll", this.position, true);
        window.addEventListener("resize", this.position);
      } else {
        document.removeEventListener("click", this.onDocClick);
        document.removeEventListener("keydown", this.onKey);
        window.removeEventListener("scroll", this.position, true);
        window.removeEventListener("resize", this.position);
      }
    }
  },
  beforeDestroy() {
    if (this.open) {
      document.removeEventListener("click", this.onDocClick);
      document.removeEventListener("keydown", this.onKey);
      window.removeEventListener("scroll", this.position, true);
      window.removeEventListener("resize", this.position);
    }
  },
  methods: {
    t,
    /* 定位：优先按钮正下方 GAP=8；下方放不下上翻；上下均不足钳制视口（M=16）；按钮滚出视口则收起（同预览包 positionCt） */
    position() {
      const btn = this.anchor && (this.anchor.$el || this.anchor);
      if (!btn || !btn.getBoundingClientRect) return;
      const r = btn.getBoundingClientRect();
      const pop = this.$refs.pop;
      if (!pop) return;
      const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
      const M = 16, GAP = 8;
      if (r.bottom < M || r.top > vh - M) { this.$emit("close"); return; }
      const pw = pop.offsetWidth, ph = pop.offsetHeight;
      let top = r.bottom + GAP;
      if (vh - M - top < ph) {
        if (r.top - GAP - ph >= M) top = r.top - GAP - ph;
        else top = Math.max(M, vh - M - ph);
      }
      let left = r.left;
      if (left + pw > vw - M) left = Math.max(M, vw - M - pw);
      this.pos = { left, top };
    },
    onDocClick(e) {
      const pop = this.$refs.pop;
      const btn = this.anchor && (this.anchor.$el || this.anchor);
      if (pop && (pop.contains(e.target) || (btn && btn.contains(e.target)))) return;
      this.$emit("close");
    },
    onKey(e) { if (e.key === "Escape") this.$emit("close"); },
    copy(value) { copyText(value, t("dt.copied")); }
  }
};
</script>
