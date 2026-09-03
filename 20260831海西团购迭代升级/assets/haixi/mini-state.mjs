export function calculatePayable(order, coupon) {
  const basePrice = order.groupBuyPrice ?? order.price;
  if (!coupon) return basePrice;

  const discounted = coupon.type === 'amount'
    ? basePrice - coupon.value
    : basePrice * coupon.value;

  return Math.max(0, Number(discounted.toFixed(2)));
}

export const createState = () => ({
  claimedCouponIds: [],
  selectedCouponId: null,
  coupons: [
    { id: 'parking-25', title: '停车缴费优惠券', targetType: 'parking_payment', targetId: 'haixi-parking', type: 'amount', value: 25, totalLimit: null, perUserLimit: null, claimedTotal: 0, claimedByCurrentUser: 0, used: false },
    { id: 'vehicle-5', title: '车况查询抵扣券', targetType: 'vehicle_query', targetId: 'vehicle-package-a', type: 'amount', value: 5, totalLimit: null, perUserLimit: null, claimedTotal: 0, claimedByCurrentUser: 0, used: false },
    { id: 'wash-30', title: '汽车精洗优惠券', targetType: 'group_buy', targetId: 'wash-basic', type: 'amount', value: 30, totalLimit: 100, perUserLimit: 1, claimedTotal: 0, claimedByCurrentUser: 0, used: false, allowStacking: false }
  ],
  products: [
    { id: 'wash-basic', title: '精洗+打蜡', category: '汽车洗美', price: 128, isPromotion: false, offline: true },
    { id: 'ac-clean', title: '汽车空调清洗', category: '汽车养护', price: 168, isPromotion: false, offline: true },
    { id: 'promo-wash', title: '夏日精洗团购', category: '汽车洗美', price: 138, groupBuyPrice: 88, isPromotion: true, offline: true }
  ]
});

export function claimCoupon(state, couponId) {
  const coupon = state.coupons.find((item) => item.id === couponId);
  if (coupon.totalLimit !== null && coupon.claimedTotal >= coupon.totalLimit) return { reason: 'total_limit' };
  if (coupon.perUserLimit !== null && coupon.claimedByCurrentUser >= coupon.perUserLimit) return { reason: 'per_user_limit' };
  coupon.claimedTotal += 1;
  coupon.claimedByCurrentUser += 1;
  state.claimedCouponIds.push(couponId);
  return { coupon };
}

export function getEligibleCoupons(state, targetType, targetId, order = null) {
  return state.coupons.filter((coupon) => (
    state.claimedCouponIds.includes(coupon.id) && !coupon.used &&
    coupon.targetType === targetType && coupon.targetId === targetId &&
    (!order || !order.isPromotion || coupon.allowStacking === true)
  ));
}

export function getBestCoupon(coupons, order) {
  return coupons.reduce((best, current) => (
    calculatePayable(order, current) < calculatePayable(order, best) ? current : best
  ), coupons[0] ?? null);
}
