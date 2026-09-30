import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import { fileURLToPath, URL } from "node:url";

/* #AI:dev —— Vite + Vue2 构建配置（选型说明见 README：node v18+ 兼容，webpack4/vue-cli 在 node17+ 有 md4 报错） */
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  server: {
    port: 5173
  },
  build: {
    outDir: "dist",
    assetsInlineLimit: 0
  }
});
