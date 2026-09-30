<template>
  <div class="wrap">
    <div class="news-layout">
      <!-- 主栏：新闻列表 + 分页（每页 4 条，前端切片） -->
      <div class="news-main">
        <div>
          <div v-for="n in pageNews" :key="n.id" class="news-item">
            <div class="ni-img" :style="{ backgroundImage: 'url(' + n.img + ')' }" @click="go(n.id)"></div>
            <div class="ni-body">
              <a class="ni-title" :href="'/news-detail?id=' + n.id" @click.prevent="go(n.id)">{{ newsI(n).title }}</a>
              <p class="ni-desc">{{ newsI(n).summary }}</p>
              <div class="ni-date">{{ n.date }}</div>
            </div>
          </div>
        </div>
        <div class="pager" v-if="pages > 1">
          <button :disabled="page === 1" @click="goPage(page - 1)"><i class="el-icon-arrow-left"></i></button>
          <button v-for="i in pages" :key="i" :class="{ cur: i === page }" @click="goPage(i)">{{ i }}</button>
          <button :disabled="page === pages" @click="goPage(page + 1)"><i class="el-icon-arrow-right"></i></button>
        </div>
      </div>
      <!-- 侧栏：热门文章榜（views Top5） + 市场宣传块 -->
      <div class="news-side">
        <div class="ns-box">
          <h4>{{ t("nl.hot") }}</h4>
          <ul class="hot-list">
            <li v-for="(n, i) in hotNews" :key="n.id">
              <span class="rk">{{ i + 1 }}</span>
              <a :href="'/news-detail?id=' + n.id" @click.prevent="go(n.id)">{{ newsI(n).title }}</a>
            </li>
          </ul>
        </div>
        <div class="ns-box" style="padding:0;border:0">
          <!-- REPLACE: 侧栏宣传块（正式使用时替换为实拍图/活动图） -->
          <div class="ns-banner">
            <b>{{ marketName() }}</b>
            <span>{{ t("nl.slogan") }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* #AI:dev 公司动态列表页（迁移 news-list.html） */
import { t, marketName, newsI } from "@/i18n";
import { NEWS_DATA } from "@/data/news";

const PAGE_SIZE = 4;

export default {
  name: "NewsListPage",
  data() {
    return { page: 1, PAGE_SIZE };
  },
  computed: {
    lang() { return this.$lang(); },
    pages() { return Math.max(1, Math.ceil(NEWS_DATA.length / PAGE_SIZE)); },
    pageNews() {
      this.$lang();
      return NEWS_DATA.slice((this.page - 1) * PAGE_SIZE, this.page * PAGE_SIZE);
    },
    hotNews() {
      this.$lang();
      return NEWS_DATA.slice().sort((a, b) => b.views - a.views).slice(0, 5);
    }
  },
  watch: { lang() { document.title = t("pt.news") + " - " + marketName(); } },
  mounted() { document.title = t("pt.news") + " - " + marketName(); },
  methods: {
    t, marketName, newsI,
    go(id) { this.$router.push({ path: "/news-detail", query: { id } }); },
    goPage(p) {
      if (p < 1 || p > this.pages) return;
      this.page = p;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
};
</script>
