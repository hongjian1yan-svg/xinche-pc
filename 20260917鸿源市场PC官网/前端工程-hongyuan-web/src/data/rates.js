/* #AI:dev 首页汇率演示数据（迁移自 js/rates.js；正式接入时替换为实时汇率接口，同步 i18n 换算汇率） */
export const RATES_DATA = [
  { from: "usd", to: "cny", rate: 6.876,  updated: "09-22 14:31" },
  { from: "cny", to: "rub", rate: 11.590, updated: "09-22 14:31" },
  { from: "eur", to: "cny", rate: 7.840,  updated: "09-22 14:31" }
];
export const FLAG_CODE = { usd: "us", cny: "cn", rub: "ru", eur: "eu" };

/* 圆形国旗 SVG（迁移自 js/rates.js，返回 SVG 字符串，页面以 v-html 渲染） */
export function flagSVG(cur) {
  var code = FLAG_CODE[cur] || cur;
  var star = '<path d="M0 -4.6 L1.1 -1.5 L4.4 -1.5 L1.7 0.5 L2.7 3.6 L0 1.7 L-2.7 3.6 L-1.7 0.5 L-4.4 -1.5 L-1.1 -1.5 Z" fill="#FFDE00"/>';
  var body = "";
  if (code === "cn") {
    body = '<circle cx="20" cy="20" r="20" fill="#DE2910"/>' +
      '<g transform="translate(14,13) scale(1.5)">' + star + '</g>' +
      '<g fill="#FFDE00"><circle cx="26" cy="7" r="1.6"/><circle cx="30" cy="11" r="1.6"/><circle cx="30" cy="17" r="1.6"/><circle cx="26" cy="21" r="1.4"/></g>';
  } else if (code === "us") {
    body = '<clipPath id="fc-us"><circle cx="20" cy="20" r="20"/></clipPath>' +
      '<g clip-path="url(#fc-us)">' +
      '<rect width="40" height="40" fill="#fff"/>' +
      [0,1,2,3,4,5,6].map(function(i){ return '<rect y="' + (i*6.15) + '" width="40" height="3.1" fill="#B31942"/>'; }).join("") +
      '<rect width="18" height="16" fill="#0A3161"/>' +
      '<g fill="#fff"><circle cx="4" cy="4" r="1"/><circle cx="9" cy="4" r="1"/><circle cx="14" cy="4" r="1"/><circle cx="6.5" cy="8" r="1"/><circle cx="11.5" cy="8" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="14" cy="12" r="1"/></g>' +
      '</g>';
  } else if (code === "ru") {
    body = '<clipPath id="fc-ru"><circle cx="20" cy="20" r="20"/></clipPath>' +
      '<g clip-path="url(#fc-ru)">' +
      '<rect width="40" height="40" fill="#fff"/><rect y="13.4" width="40" height="13.3" fill="#0039A6"/><rect y="26.7" width="40" height="13.3" fill="#D52B1E"/>' +
      '</g>';
  } else if (code === "eu") {
    var dots = "";
    for (var i = 0; i < 12; i++) {
      var a = i * Math.PI / 6;
      dots += '<circle cx="' + (20 + 12 * Math.sin(a)).toFixed(1) + '" cy="' + (20 - 12 * Math.cos(a)).toFixed(1) + '" r="1.3" fill="#FFCC00"/>';
    }
    body = '<circle cx="20" cy="20" r="20" fill="#003399"/>' + dots;
  }
  return '<svg class="fl-svg" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">' + body + "</svg>";
}
