<template>
  <div>
    <!-- 面包屑：市场名 > 公司动态 > 正文 -->
    <div class="breadcrumb">
      <div class="wrap">
        <router-link to="/">{{ marketName() }}</router-link>
        <span class="bc-sep el-icon-arrow-right"></span>
        <router-link to="/news">{{ t("nav.news") }}</router-link>
        <span class="bc-sep el-icon-arrow-right"></span>
        <span>{{ t("crumb.article") }}</span>
      </div>
    </div>

    <div class="wrap">
      <article class="news-detail">
        <h1 class="nd-title">{{ x.title }}</h1>
        <div class="nd-meta">
          <span>{{ t("nd.pub") + news.date }}</span>
          <span>{{ t("nd.src") + marketName() }}</span>
          <span>{{ tf("nd.views", { n: news.views }) }}</span>
        </div>
        <!-- 正文（REPLACE: 演示占位长文；市场方有真实新闻时整体替换 data/news.js，见 PRD 第 5 章后注） -->
        <div class="nd-body">
          <p>{{ x.summary }}</p>
          <div class="nd-img" :style="{ backgroundImage: 'url(' + news.img + ')' }"></div>
          <p>{{ t("nd.p1") }}</p>
          <p>{{ t("nd.p2") }}</p>
          <p>{{ t("nd.p3") }}</p>
        </div>
        <div class="nd-nav">
          <div>{{ t("nd.prev") }}<a v-if="prev" :href="'/news-detail?id=' + prev.id" @click.prevent="go(prev.id)">{{ newsI(prev).title }}</a><span v-else class="nd-none">{{ t("nd.none") }}</span></div>
          <div>{{ t("nd.next") }}<a v-if="next" :href="'/news-detail?id=' + next.id" @click.prevent="go(next.id)">{{ newsI(next).title }}</a><span v-else class="nd-none">{{ t("nd.none") }}</span></div>
        </div>
        <div class="nd-back">
          <router-link class="btn btn-ghost" to="/news"><i class="el-icon-back"></i> {{ t("nd.back") }}</router-link>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
/* #AI:dev 新闻详情页（迁移 news-detail.html：?id= 按序号定位，首尾无对应文章显示不可用文案） */
import { t, tf, marketName, newsI } from "@/i18n";
import { NEWS_DATA } from "@/data/news";

export default {
  name: "NewsDetailPage",
  computed: {
    idx() {
      const id = parseInt(this.$route.query.id, 10) || 1;
      let i = NEWS_DATA.findIndex(n => n.id === id);
      return i === -1 ? 0 : i;
    },
    news() { return NEWS_DATA[this.idx]; },
    prev() { return NEWS_DATA[this.idx - 1] || null; },
    next() { return NEWS_DATA[this.idx + 1] || null; },
    x() { this.$lang(); return newsI(this.news); }
  },
  watch: {
    x: { immediate: true, handler(v) { document.title = v.title + " - " + marketName(); } }
  },
  methods: {
    t, tf, marketName, newsI,
    go(id) { this.$router.push({ path: "/news-detail", query: { id } }); }
  }
};
</script>

<style scoped>
.nd-none { color: #999; }
</style>
