/* #AI:dev 应用入口：Vue2.7 + vue-router3 + element-ui 2.15.14
   样式加载顺序：Element 官方 theme-chalk（含本地字体，零外网）→ element-icons.css（项目本地图标字体）→ style.css（项目样式，主色 #004199 覆盖） */
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/element-icons.css";
import "@/styles/style.css";

import App from "./App.vue";
import router from "./router";
import { langMixin } from "@/store/lang";

Vue.use(ElementUI, { size: "default" });
Vue.mixin(langMixin);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
