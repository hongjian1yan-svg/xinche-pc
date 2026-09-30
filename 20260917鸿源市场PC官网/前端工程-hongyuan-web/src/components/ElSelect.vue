<template>
  <!-- ElementUI 2.15.14 规格下拉（预览包 js/el-select.js 复刻件的 Vue 组件化实现，视觉类名与样式完全共用 style.css 的 .el-select* 规格段：
       触发器 40px/#dcdfe6/圆角8(工程统一档)、面板 #e4e7ed 描边+0 2px 12px 阴影、选项 34px/hover #f5f7fa/选中主色加粗带对勾、caret #C0C4CC 展开旋转 180°、占位 #a8abb2） -->
  <div class="el-select" :class="{ 'is-open': open }">
    <div class="el-select-trigger" tabindex="0" @click.stop="toggle" @keydown.enter.prevent="toggle" @keydown.space.prevent="toggle">
      <span class="el-select-display" :class="{ 'is-placeholder': !hasValue }">{{ displayText }}</span>
      <i class="el-icon-caret-bottom el-select-caret"></i>
    </div>
    <div class="el-select-dropdown">
      <div class="el-select-scroll" ref="scroll">
        <ul class="el-select-menu">
          <li v-for="o in normalized" :key="o.value" class="el-select-opt"
            :class="{ selected: o.value === value && o.value !== '', 'is-empty': o.value === '' }"
            @click.stop="choose(o)">
            <i v-if="o.value === value && o.value !== ''" class="el-icon-check"></i><span>{{ o.label }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
/* #AI:dev ElSelect 表单下拉（v-model 字符串值；options: [{value,label}] 或字符串数组；value="" 视为占位不可选） */
export default {
  name: "ElSelect",
  props: {
    value: { type: String, default: "" },
    options: { type: Array, required: true },
    placeholder: { type: String, default: "" }
  },
  data() {
    return { open: false };
  },
  computed: {
    normalized() {
      return this.options.map(o => (typeof o === "string" ? { value: o, label: o } : o));
    },
    hasValue() { return this.value !== ""; },
    displayText() {
      const o = this.normalized.filter(x => x.value === this.value)[0];
      return o ? o.label : (this.placeholder || "");
    }
  },
  mounted() {
    document.addEventListener("click", this.close);
    document.addEventListener("keydown", this.onKey);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.close);
    document.removeEventListener("keydown", this.onKey);
  },
  methods: {
    toggle() {
      this.open = !this.open;
      if (this.open) {
        this.$nextTick(() => {
          /* 当前选中项滚动可见（同复刻件） */
          const box = this.$refs.scroll;
          if (!box) return;
          const cur = box.querySelector(".selected");
          if (cur) box.scrollTop = Math.max(0, cur.offsetTop - box.clientHeight / 2 + cur.clientHeight / 2);
        });
      }
    },
    close() { this.open = false; },
    onKey(e) { if (e.key === "Escape") this.close(); },
    choose(o) {
      if (o.value === "" || o.disabled) return;
      this.open = false;
      if (o.value !== this.value) this.$emit("input", o.value);
    }
  }
};
</script>
