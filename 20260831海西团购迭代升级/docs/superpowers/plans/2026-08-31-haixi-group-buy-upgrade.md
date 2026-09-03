# 海西团购迭代升级 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 交付可在浏览器直接打开的小程序与 PC 后台预览，完整演示海西优惠券领取、选券、购买与配置流程。

**Architecture:** 使用两个独立的原生 HTML 预览页和本地静态资源。小程序预览页以一个内存状态对象统一管理优惠券、领取状态、订单选券与页面路由；PC 预览页以同一套模拟配置数据演示团购产品与独立优惠券配置，避免将优惠券字段写入团购配置。

**Tech Stack:** 原生 HTML、CSS、JavaScript；本地图片与 SVG；无需框架、依赖、构建产物或 `package.json`。

**Spec:** `海西团购迭代升级_PRD.md`

## Global Constraints

- 仅制作浏览器可直接打开的静态预览页，文件名按页面用途命名。
- 小程序预览保持设计画布尺寸；浏览器承载层等比缩放，窗口变化后仍一屏完整展示且页面无浏览器滚动。
- 仅使用 Figma 文件 `ronNfUe7t4c7f0tCUJj50O` 的“20260804海西需求”分组（节点 `1167:978`）作为视觉参考。
- 不新增未确认的业务字段、选项、校验、统计口径或文案。
- 团购配置承载产品；优惠券单独配置。车况查询产品来源于车况初始化，停车券适用于当前市场全部线上停车缴费订单。
- 每张已领取优惠券只能使用一次；同一订单默认选中实付最低的可用券；金额抵扣和折扣是本期仅有的券类型。
- 原价产品可用券；真实团购优惠产品默认不可叠券，只有券明确启用叠加时才按“团购优惠价 → 优惠券”计算。
- 每次 UI 与交互修改后都必须实际在浏览器打开核验；移动端还需验证一屏展示和浏览器无滚动。

---

## File Structure

- `小程序迭代.html`：小程序首页、会员福利、领取成功、车况查询、停车缴费、下单选券、下单成功二维码与 Toast 状态。
- `PC端优惠券配置.html`：PC 团购产品列表/配置与独立优惠券列表/配置页面。
- `assets/haixi/mini-state.mjs`：可由浏览器页面与 Node 内置测试共用的小程序优惠券状态和价格计算函数。
- `assets/haixi/`：从限定 Figma 分组导出的商品与页面展示资源；不放入远程 URL。

## Task 1: 建立小程序预览壳与共享优惠券状态

**Files:**
- Create: `小程序迭代.html`
- Create: `assets/haixi/mini-state.mjs`
- Create: `assets/haixi/`

**Interfaces:**
- Produces: `state`, `claimCoupon(couponId)`, `getEligibleCoupons(targetType, targetId, order)`, `getBestCoupon(coupons, order)`, `calculatePayable(order, coupon)`。
- Consumes: Figma 限定分组中用于首页、团购卡和车况/洗美商品的本地导出资源。

- [ ] **Step 1: 先建立失败的状态断言脚本**

在 HTML 尾部先写入以下断言，再故意保持 `calculatePayable` 未定义：

```js
console.assert(
  calculatePayable({ price: 50, groupBuyPrice: null }, { type: 'amount', value: 25 }) === 25,
  '金额抵扣券应降低实付金额'
);
```

- [ ] **Step 2: 在浏览器控制台确认断言失败**

打开 HTML，预期看到 `ReferenceError: calculatePayable is not defined`。

- [ ] **Step 3: 实现共享模拟数据与最小价格计算函数**

```js
const state = {
  claimedCouponIds: [],
  selectedCouponId: null,
  currentView: 'home',
  coupons: [],
  products: []
};

function calculatePayable(order, coupon) {
  const basePrice = order.groupBuyPrice ?? order.price;
  if (!coupon) return basePrice;
  const discounted = coupon.type === 'amount'
    ? basePrice - coupon.value
    : basePrice * coupon.value;
  return Math.max(0, Number(discounted.toFixed(2)));
}
```

`coupons` 覆盖停车缴费、车况查询、线下核验产品三类；`products` 覆盖原价产品与真实团购优惠产品。用 `targetType` 与 `targetId` 表示券绑定对象，禁止把券规则写入产品对象。

- [ ] **Step 4: 实现领取、可用券筛选与默认选券函数**

```js
function getEligibleCoupons(targetType, targetId) {
  return state.coupons.filter((coupon) => (
    state.claimedCouponIds.includes(coupon.id) &&
    !coupon.used &&
    coupon.targetType === targetType &&
    coupon.targetId === targetId
  ));
}

function getBestCoupon(coupons, order) {
  return coupons.reduce((best, current) => (
    calculatePayable(order, current) < calculatePayable(order, best) ? current : best
  ), coupons[0] ?? null);
}
```

- [ ] **Step 5: 重跑浏览器断言并验证脚本可执行**

在浏览器实际打开页面并运行 Step 1 断言。预期：金额抵扣券断言通过，且浏览器控制台无 JavaScript 语法错误。

## Task 2: 制作会员福利与领取成功页

**Files:**
- Modify: `小程序迭代.html`

**Interfaces:**
- Consumes: Task 1 的 `state.coupons`、`claimCoupon(couponId)`。
- Produces: `renderMemberBenefits()`, `renderClaimSuccess(coupon)` 与 `showToast(message)`。

- [ ] **Step 1: 写入领取限制的失败断言**

```js
console.assert(
  claimCoupon('limited-car-wash').reason === 'per_user_limit',
  '达到个人领取上限时应返回 per_user_limit'
);
```

- [ ] **Step 2: 在浏览器中确认断言失败**

预期：`claimCoupon` 尚未定义或未返回限制原因。

- [ ] **Step 3: 实现免费领券、超值团购两个 Tab 和领取状态**

`renderMemberBenefits()` 必须让免费领券 Tab 同时展示停车券、车况券和线下核验券；超值团购 Tab 展示原价产品与真实团购优惠产品。券卡在返回列表后始终显示“免费领取”。

```js
function claimCoupon(couponId) {
  const coupon = state.coupons.find((item) => item.id === couponId);
  if (coupon.totalLimit !== null && coupon.claimedTotal >= coupon.totalLimit) return { reason: 'total_limit' };
  if (coupon.perUserLimit !== null && coupon.claimedByCurrentUser >= coupon.perUserLimit) return { reason: 'per_user_limit' };
  coupon.claimedTotal += 1;
  coupon.claimedByCurrentUser += 1;
  state.claimedCouponIds.push(couponId);
  return { coupon };
}
```

总量限制 Toast 固定为“该优惠券已领完”，个人次数限制 Toast 固定为“您已达到该优惠券的领取上限”。领取成功页底部按钮按业务类型显示“立即缴费”“查询车况”“再来一单”；线下券每人限领 1 次时隐藏“再来一单”。

- [ ] **Step 4: 通过浏览器验证领取成功与限制分支**

依次点击停车券、车况券、线下核验券的“免费领取”，核对成功页按钮；对已达到两类限制的券再次点击，核对两条 Toast 文案与列表按钮仍为“免费领取”。

- [ ] **Step 5: 进行本任务范围的视觉核验**

在移动预览壳中核对两个 Tab、券卡、成功页和底部按钮；窗口改变尺寸后整机保持一屏，无浏览器滚动。

## Task 3: 制作首页停车缴费与车况查询入口

**Files:**
- Modify: `小程序迭代.html`
- Modify: `assets/haixi/`

**Interfaces:**
- Consumes: Task 1 的券与产品状态、Task 2 的领取结果。
- Produces: `renderHome()`, `renderParkingPayment()`, `renderVehicleQueryProducts()`。

- [ ] **Step 1: 为车况产品标签写失败断言**

```js
console.assert(
  getEligibleCoupons('vehicle_query', 'vehicle-package-a').length > 0,
  '拥有对应车况券时，车况套餐应可使用优惠券'
);
```

- [ ] **Step 2: 在浏览器控制台确认断言失败**

预期：尚未领取车况券时断言失败。

- [ ] **Step 3: 实现首页业务入口与车况列表**

首页“停车缴费”只渲染停车券；首页“车况查询”只渲染车况券。车况券领取后的券卡“查询车况”进入对应录入页，页面底部“查询车况”进入含“车况套餐”“我的订单”两 Tab 的产品列表。可用券产品显示红色“可使用优惠券”标签，点击进入录入页。

- [ ] **Step 4: 实现停车缴费演示链路**

在停车缴费页提供车牌输入、缴费按钮、已领停车券的默认选中结果和支付成功后的“道闸已抬杆”状态。停车券只从 `targetType: 'parking_payment'` 筛选，不显示其他券。

- [ ] **Step 5: 领取车况券后重跑断言并手动走通两个入口**

领取车况券后重跑 Step 1 断言，预期通过；分别验证车况券卡跳录入页、底部按钮跳列表页，以及停车缴费输入车牌后的默认券选择。

## Task 4: 制作商品购买、选券与线下核销链路

**Files:**
- Modify: `小程序迭代.html`

**Interfaces:**
- Consumes: Task 1 的 `calculatePayable`、`getEligibleCoupons`、`getBestCoupon`。
- Produces: `renderProductDetail(product)`, `renderCouponPicker(order)`, `submitOrder(order)`。

- [ ] **Step 1: 写入双重优惠控制的失败断言**

```js
const promoOrder = { price: 100, groupBuyPrice: 80, isPromotion: true };
console.assert(
  getEligibleCoupons('group_buy', 'promo-wash', promoOrder).length === 0,
  '未开启叠加时，真实团购优惠产品不可使用优惠券'
);
```

- [ ] **Step 2: 在浏览器控制台确认断言失败**

预期：未写入叠加校验前，优惠券仍会错误出现在真实团购优惠产品中。

- [ ] **Step 3: 实现购买页与券选择弹窗**

购买页必须默认选择使实付最低的可用券。点击“已选优惠券”打开弹窗，用户可切换任一可用券或取消选择。对真实团购优惠产品，只有券的 `allowStacking` 为 `true` 时才允许入选；计算顺序固定为团购优惠价后再计算券优惠。

```js
function canUseCouponForOrder(coupon, order) {
  return !order.isPromotion || coupon.allowStacking === true;
}

function getEligibleCoupons(targetType, targetId, order = null) {
  return state.coupons.filter((coupon) => (
    state.claimedCouponIds.includes(coupon.id) &&
    !coupon.used &&
    coupon.targetType === targetType &&
    coupon.targetId === targetId &&
    (!order || canUseCouponForOrder(coupon, order))
  ));
}
```

- [ ] **Step 4: 实现线下核验订单成功页**

购买汽车洗美、汽车空调清洗等线下核验产品成功后，显示团购二维码和“线下核销使用产品”状态。订单提交后将已选券标记为已使用，后续订单不可再次筛选到该券。

- [ ] **Step 5: 验证三条购买分支**

验证：原价产品默认选最低实付券；真实团购优惠产品默认无券；开启叠加的券按团购价后再计算。再验证线下产品支付成功后有二维码，已使用券不再出现。

## Task 5: 制作 PC 团购产品配置预览

**Files:**
- Create: `PC端优惠券配置.html`

**Interfaces:**
- Produces: `pcState.products`, `renderGroupBuyProducts()`, `openProductForm(productId)`。
- Consumes: 与小程序预览相同的原价产品、团购优惠产品和履约类型示例，但不共享运行时状态。

- [ ] **Step 1: 写入产品与优惠券配置隔离的失败断言**

```js
console.assert(
  !Object.prototype.hasOwnProperty.call(pcState.products[0], 'couponRules'),
  '团购产品配置不得保存优惠券规则'
);
```

- [ ] **Step 2: 在浏览器控制台确认断言失败**

预期：初始模拟对象仍错误带有 `couponRules` 字段。

- [ ] **Step 3: 实现团购产品列表与产品表单**

列表与表单需区分“原价产品”和“团购优惠产品”，并展示产品类型、价格表现与履约方式。团购产品可继续作为真实团购使用；页面不出现优惠券配置字段或入口。

- [ ] **Step 4: 移除产品对象中的券规则并重跑断言**

将优惠券配置移至 `pcState.coupons`，重跑 Step 1 断言，预期通过。

- [ ] **Step 5: 浏览器视觉核验**

核对 PC 页面沿用限定 Figma 分组的后台布局、表单层级和组件尺寸；确认团购配置与优惠券配置入口分离。

## Task 6: 制作 PC 独立优惠券配置预览

**Files:**
- Modify: `PC端优惠券配置.html`

**Interfaces:**
- Consumes: Task 5 的 `pcState.products`。
- Produces: `pcState.coupons`, `getBindingOptions(businessType)`, `renderCouponForm()`。

- [ ] **Step 1: 写入业务绑定选项的失败断言**

```js
console.assert(
  getBindingOptions('parking_payment').length === 0,
  '停车缴费券不应要求选择团购产品'
);
console.assert(
  getBindingOptions('vehicle_query').every((item) => item.source === 'vehicle_initialization'),
  '车况券必须从车况初始化来源选择绑定对象'
);
```

- [ ] **Step 2: 在浏览器控制台确认断言失败**

预期：未按业务类型切换绑定来源时，停车缴费仍错误展示产品选择器，或车况来源不正确。

- [ ] **Step 3: 实现优惠券列表与配置表单**

表单选择“适用业务”后动态呈现绑定内容：团购产品选择团购产品；车况查询选择车况初始化的产品/套餐；停车缴费不展示产品选择并说明适用于当前市场全部线上停车订单。支持金额抵扣、折扣、领取时间、使用有效期、总发放数量限制/不限制、每人领取次数限制/不限制和与团购优惠叠加开关。

- [ ] **Step 4: 实现限制开关的显隐逻辑**

总发放数量选择“限制”才显示数量输入；每人领取次数选择“限制”才显示次数输入。用户范围限制不在本期页面展示。

- [ ] **Step 5: 重跑断言并实际操作三种业务类型**

依次切换团购产品、车况查询、停车缴费，验证绑定选择器和说明正确；切换两个限制开关，验证对应数字输入显隐正确。

## Task 7: 端到端浏览器验收与交付核对

**Files:**
- Modify: `小程序迭代.html`
- Modify: `PC端优惠券配置.html`

**Interfaces:**
- Consumes: Task 1 至 Task 6 的全部预览功能。
- Produces: 可直接打开且交互可演示的两份最终预览页。

- [ ] **Step 1: 打开小程序预览并完成业务回归**

验证会员福利两个 Tab、三类券领取成功页按钮、两条限制 Toast、车况入口分流、停车缴费、最低实付选券、换券/取消、线下二维码和双重优惠开关。

- [ ] **Step 2: 打开 PC 预览并完成配置回归**

验证团购产品和优惠券配置分离、三类适用业务、两种优惠类型、时间与限制开关、叠加开关，以及停车券不绑定产品、车况券来自车况初始化。

- [ ] **Step 3: 核对移动承载层**

缩放浏览器窗口，验证整台小程序设备始终一屏显示、无浏览器纵向滚动，内部画布尺寸与布局不变。

- [ ] **Step 4: 核对静态交付结构**

运行：`find . -maxdepth 3 \( -name 'package.json' -o -name 'vite.config.*' -o -name 'src' \) -print`。

预期：本项目目录下无新增前端工程、依赖锁文件或构建产物；仅保留两份语义化 HTML、所需本地静态资源和业务文档。

- [ ] **Step 5: Git 交付处理**

当前项目目录未初始化 Git；不执行提交或推送。若后续提供项目仓库，先展示变更摘要并征得用户同意后再处理远程同步。
