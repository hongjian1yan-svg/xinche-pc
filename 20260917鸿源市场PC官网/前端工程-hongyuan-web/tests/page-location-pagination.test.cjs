/* #AI:dev 回归检查：页面组件位置与买车/新闻分页契约。 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const pageNames = ["HomePage", "BuyCarPage", "CarDetailPage", "SellCarsPage", "SuccessPage", "NewsListPage", "NewsDetailPage", "AboutPage"];

test("8 个路由页面统一存放于 src/views", () => {
  const router = read("src/router/index.js");
  for (const name of pageNames) {
    assert.ok(fs.existsSync(path.join(root, "src/views", `${name}.vue`)), `${name}.vue 应位于 src/views`);
    assert.ok(router.includes(`@/views/${name}.vue`), `路由应引用 views/${name}.vue`);
  }
  assert.doesNotMatch(router, /@\/pages\//);
});

test("买车和新闻分页沿用预览页原生按钮、数据边界和样式", () => {
  for (const [file, pageSize, currentPage, total] of [
    ["src/views/BuyCarPage.vue", "PAGE_SIZE", "state.page", "sortedCars.length"],
    ["src/views/NewsListPage.vue", "PAGE_SIZE", "page", "NEWS_DATA.length"]
  ]) {
    const source = read(file);
    assert.doesNotMatch(source, /<el-pagination\b/);
    const pager = source.match(/<div class="pager"[\s\S]*?<\/div>/)?.[0] || "";
    assert.match(pager, new RegExp(`<button :disabled="${currentPage} === 1" @click="goPage\\(${currentPage} - 1\\)">`));
    assert.match(pager, new RegExp(`<button v-for="i in pages"[^>]*:class="\\{ cur: i === ${currentPage} \\}" @click="goPage\\(i\\)">`));
    assert.match(pager, new RegExp(`<button :disabled="${currentPage} === pages" @click="goPage\\(${currentPage} \\+ 1\\)">`));
    assert.match(pager, /el-icon-arrow-left/);
    assert.match(pager, /el-icon-arrow-right/);
    assert.ok(source.includes(`const ${pageSize} = ${file.includes("BuyCar") ? 8 : 4};`), `${file} 应保留原每页数量`);
    assert.ok(source.includes(total), `${file} 应以原列表总量计算页数`);
  }
  const styles = read("src/styles/style.css");
  assert.match(styles, /\.pager button\s*\{/);
  assert.match(styles, /\.pager button\.cur\s*\{/);
  assert.match(styles, /\.pager button:disabled\s*\{/);
  assert.doesNotMatch(styles, /\.pager \.el-pagination/);
});
