<!-- #AI:dev -->
# 鸿源市场 PC 官网 · 前端工程（hongyuan-web）

中山鸿源市场 PC 官网 Vue 前端工程，对照同目录 8 个原生 HTML 预览页面同步，当前验收基准为 PRD v1.9。演示态，无后端接口。

## 技术栈

- Vue 2.7.16 + vue-router 3.6.5（history 模式）
- ElementUI 2.15.14（在 `src/main.js` 全局注册并加载 theme-chalk；买车和新闻列表分页沿用预览页原生按钮与 `.pager` 样式；全站使用本地 Element 图标字体）
- Vite 5 + @vitejs/plugin-vue2（构建；node v18+。webpack4/vue-cli 在 node17+ 有 md4 报错，故弃用）
- 零外网依赖：Element 字体本地化（src/styles/fonts/），图片资源在 public/img/（与预览包 img/ 全量一致）

## 运行

```bash
npm install        # 已装可跳过
npm run dev        # 开发 http://localhost:5173
npm run build      # 产物 dist/
npx vite preview   # 预览构建产物（history 路由由 vite preview 自动 fallback）
```

回归检查：`npm test`（含筛选布局、8 页路由目录及买车/新闻原生分页结构/样式检查）。

部署到 nginx 等静态服务器时需配置 `try_files $uri $uri/ /index.html;`（history 路由回退）。

## 页面 ↔ 路由映射（与预览包逐页对应）

| 预览 HTML | 路由 | 页面组件 |
|---|---|---|
| shouye.html | `/` | src/views/HomePage.vue |
| buycar.html | `/buycar` | src/views/BuyCarPage.vue |
| cardetail.html | `/cardetail` | src/views/CarDetailPage.vue |
| sellcars.html | `/sellcars` | src/views/SellCarsPage.vue |
| success.html | `/success` | src/views/SuccessPage.vue |
| news-list.html | `/news` | src/views/NewsListPage.vue |
| news-detail.html | `/news-detail` | src/views/NewsDetailPage.vue |
| about.html | `/about` | src/views/AboutPage.vue |

URL 查询参数沿用预览包约定：`?kw=`（首页搜索→列表回显）、`?brand=`、`?body=`、`?pmin=&pmax=`、`?id=`（详情车源）。

## 公共组件

| 组件 | 说明 |
|---|---|
| components/SiteHeader.vue | 顶部导航 + 语言切换（img/lang 图标 20×20，PRD v1.8 默认俄文） |
| components/SiteFooter.vue | 页脚 4 站内入口 + 二维码占位 |
| components/FloatBar.vue | 右侧悬浮栏（电话/小程序/公众号 hover 弹层，overflow:visible 修复同步） |
| components/CarCard.vue | 车辆卡片（ru 双币 .pc-rub/.pc-usd；en 仅美元；zh 万） |
| components/CarFilter.vue | 列表筛选（燃料类型独立成行；ru 价格区间取整百位 rk()；标题顶对齐） |
| components/ElSelect.vue | 官网专用自绘筛选下拉（不是 ElementUI 的 `el-select`；省市联动数据源 data/chinaRegions.js） |
| components/InquiryPop.vue | 咨询车况弹窗（必填校验、中国显示省市、演示成功态不落库） |
| components/ContactPop.vue | 立即联系下拉浮层（380px、锚定按钮下方 8px、空间不足上翻、四行点击复制不跳转） |

## 数据与配置

- `src/config/siteConfig.js` — 全站唯一配置源（热线 +86 760-88888331、contact 邮箱/WhatsApp/Facebook、公司名地址三语、二维码/Logo 替换点，`REPLACE:` 注释标出）
- `src/data/` — cars.js（28 车型）、carProfiles.js（车辆档案三组配置）、news.js、rates.js（实时汇率卡）、merchants.js、chinaRegions.js（省市演示数据，正式数据源待后端确定，见 PRD）
- `src/i18n/` — 三语字典与格式化（fmtPrice/fmtUsd/fmtPriceDualHTML/fmtRubThs/priceLabel，口径=PRD v1.8 §8.6）；默认语言 ru，localStorage `hy_lang` 记忆优先

## 修改同步铁律（YAN 2026-09 确认）

预览 HTML（项目根目录 8 页）仍是验收基准：**页面有改动先改预览 HTML，经 YAN 验收同意后，才同步修改本工程**。咨询/卖车表单均为演示态，不真实提交；登录能力未开发（仅技术可行性说明）。
