/* #AI:dev 路由表：8 页（history 模式；dev/build 均由 vite preview 或任意支持 fallback 的静态服务器承载，详见 README）
   路由参数沿用预览包查询参数约定：?kw/pmin/pmax/brand/body/id 等 */
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  { path: "/", name: "home", component: () => import("@/views/HomePage.vue"), meta: { active: "home" } },
  { path: "/buycar", name: "buycar", component: () => import("@/views/BuyCarPage.vue"), meta: { active: "buy" } },
  { path: "/cardetail", name: "cardetail", component: () => import("@/views/CarDetailPage.vue"), meta: { active: "buy" } },
  { path: "/sellcars", name: "sellcars", component: () => import("@/views/SellCarsPage.vue"), meta: { active: "sell" } },
  { path: "/success", name: "success", component: () => import("@/views/SuccessPage.vue"), meta: { active: "sell" } },
  { path: "/news", name: "news", component: () => import("@/views/NewsListPage.vue"), meta: { active: "news" } },
  { path: "/news-detail", name: "newsDetail", component: () => import("@/views/NewsDetailPage.vue"), meta: { active: "news" } },
  { path: "/about", name: "about", component: () => import("@/views/AboutPage.vue"), meta: { active: "about" } },
  { path: "*", redirect: "/" }
];

const router = new VueRouter({
  mode: "history",
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved;
    /* 预览包列表跳详情/首页跳列表为整页加载（回到顶部）；SPA 内保持同等体验 */
    return { x: 0, y: 0 };
  }
});

/* title：路由级默认值；页面内按语言/内容动态覆盖（与预览包各页 document.title 逻辑一致） */
const TITLE_KEYS = { home: "pt.home", buycar: "pt.buy", cardetail: null, sellcars: "pt.sell", success: "pt.success", news: "pt.news", newsDetail: "pt.news", about: "pt.about" };
router.afterEach((to) => {
  const key = TITLE_KEYS[to.name];
  /* 首页/详情页在组件内设置 title（含车源名），此处仅设公共格式 */
  if (to.name === "cardetail" || to.name === "newsDetail" || to.name === "home") return;
  if (key) {
    import("@/i18n").then((m) => {
      document.title = m.t(key) + " - " + m.marketName();
    });
  }
});

export default router;
