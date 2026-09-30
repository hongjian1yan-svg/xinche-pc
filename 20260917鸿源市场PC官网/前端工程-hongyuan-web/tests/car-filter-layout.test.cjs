// #AI:dev:file
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const source = fs.readFileSync(path.join(__dirname, "../src/components/CarFilter.vue"), "utf8");
const template = source.slice(0, source.indexOf("</template>"));

test("燃料类型在车系后独立展示为胶囊行，并从其它下拉组移除", () => {
  const series = template.indexOf('t("f.series")');
  const fuel = template.indexOf('t("f.fuel")');
  const price = template.indexOf('t("f.price")');

  assert.ok(series >= 0 && series < fuel && fuel < price, "筛选行顺序应为车系、燃料类型、价格");
  assert.match(template, /v-for="f in fuelOptions"[\s\S]*?pick\('fuel', f\.label\)/);
  assert.doesNotMatch(source, /key: "fuel", label: t\("f\.fuel"\)/);
});
