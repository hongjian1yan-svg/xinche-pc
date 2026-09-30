/* #AI:dev config 注入混入：组件内 this.SITE 读取 src/config/siteConfig.js */
import { SITE_CONFIG } from "@/config/siteConfig";
export const SITE = {
  computed: {
    SITE() { return SITE_CONFIG; }
  }
};
