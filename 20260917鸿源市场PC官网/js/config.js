/* #AI:design —— 全站公共配置（模板替换核心文件）
   ⚙ 模板替换配置：换市场时优先只改本文件 + img/ 下图片，不需要动页面结构。
   本文件不含任何外网资源，双击 file:// 直接可用。
   多语言：中文/英文/俄文文案在 js/i18n.js；本文件中市场专有文案（市场名/地址/备案号等）不随语言翻译；
   banners/serviceTags/footerLinks 等条数如变更，需同步 js/i18n.js 对应数组；子页内容区多语言为二期范围。 */

var SITE_CONFIG = {
  /* REPLACE: 市场名称（导航、Banner、title、面包屑、卖车页标题、页脚版权、悬浮栏） */
  // #AI:design:start
  marketName: "中山市鸿源二手车经销有限公司",
  /* REPLACE: 市场简称（Logo 文字、页脚二维码标题等短场景） */
  marketShort: "中山市鸿源二手车经销有限公司",
  /* REPLACE: Logo 字母标（如无图片 Logo 时用文字标占位） */
  logoMark: "鸿",

  /* REPLACE: 市场介绍（详情页「联系方式」模块展示）
     已根据公开资料整理（百度百科/爱企查/中物集团官网，2026-09-18），正式使用前请市场方确认 */
  marketIntro: "市场介绍：中山市鸿源二手车经销有限公司成立于 2011 年，地址：{address}。是中山市物资集团（中物集团）旧车板块旗下主力市场，提供二手车买卖、过户、评估、年检等一站式服务。",
  // #AI:design:end

  /* REPLACE: 服务热线（Banner、悬浮栏、详情页咨询、关于页；来源：中物集团官网公示的鸿源市场电话，启用前请市场方确认） */
  // #AI:design:start
  hotline: "+86 760-88888331",
  // #AI:design:end
  hotlineTip: "",
  /* 联系邮箱待市场方确认；未确认前不写入页面展示。（注：详情页「立即联系」浮层邮箱已确认，见下方 contact） */
  contactEmail: "contact@hongyuan-auto.example",

  /* REPLACE: 详情页「立即联系」下拉浮层联系方式（2026-09-28 YAN 确认；服务热线沿用上方 hotline 字段）
     ⚙ 邮箱/WhatsApp/Facebook 为市场个性化内容，换市场时只改本对象；四行均仅展示展示值+点击复制，不产生 tel:/mailto:/wa.me 跳转 */
  // #AI:design:start
  contact: {
    email: "lix4@wzgroup.cn",          /* REPLACE: 联系邮箱（点击复制展示值） */
    whatsapp: "+86 15825468365",       /* REPLACE: WhatsApp 号码（展示值，点击复制） */
    facebook: "張晓偉Leo Zhang"        /* REPLACE: Facebook 联系人（展示值，点击复制到剪贴板） */
  },
  // #AI:design:end

  /* REPLACE: 首页 Banner 服务标签条（数组，任意增减项） */
  serviceTags: ["免费导购", "分期贷款", "车辆鉴定", "保险办理", "代办服务", "汽修维保"],

  /* #AI:design:start */
  /* REPLACE: 首页 Banner 轮播（每张：主标题/副标题/背景图；三张图分别对应市场主视觉、一站式服务、认证车源与检测上新） */
  /* #AI:design:end */
  banners: [
    // #AI:design:start
    { title: "中山市鸿源二手车经销有限公司", sub: "诚信 · 规范 · 市场化二手车交易大厅", img: "img/banner/banner-1.jpg", bg: "linear-gradient(115deg,#002a5e 0%,#004199 55%,#4d7dc0 100%)" },
    // #AI:design:end
    { title: "买车卖车 一站式服务", sub: "免费导购 / 分期贷款 / 车辆鉴定 / 过户代办", img: "img/banner/banner-2.jpg", bg: "linear-gradient(115deg,#00224d 0%,#003a80 55%,#3d6cb0 100%)" },
    { title: "3000+ 认证车源 天天上新", sub: "到场看车 · 检测透明 · 售后有保障", img: "img/banner/banner-3.jpg", bg: "linear-gradient(115deg,#002f6a 0%,#0047a3 55%,#5c88c4 100%)" }
  ],

  /* #AI:design:start */
  /* REPLACE: 页脚站内导航链接 */
  footerLinks: [
    { text: "我要买车", href: "buycar.html" },
    { text: "我要卖车", href: "sellcars.html" },
    { text: "公司动态", href: "news-list.html" },
    { text: "关于我们", href: "about.html" }
  ],
  /* #AI:design:end */

  /* REPLACE: ICP 备案号 */
  icp: "ICP备2026000001号",
  /* REPLACE: 版权年份/主体（年份自动取当前年，可写死） */
  copyrightYear: "2018-" + new Date().getFullYear(),
  poweredBy: "Powered by 二手车市场官网复用模板",

  /* REPLACE: 页脚/悬浮栏二维码说明（图片替换 img/qr-service.png、img/qr-subscribe.png）；公众号名称文案在 js/i18n.js 的 ui.qrSubName 维护（三语） */
  qrMiniappTip: "小程序码，扫码进入市场小程序", /* REPLACE: 小程序二维码说明，图片替换 img/qr-miniapp.png */

  /* REPLACE: 关于我们页联系方式 */
  /* #AI:design:start */
  /* REPLACE: 车辆所在地省市提取源；联系方式显示地址由 js/i18n.js 的 addressI() 三语维护 */
  address: "广东省中山市火炬开发区大岭工业区22号之九",
  /* #AI:design:end */
  traffic: "自驾导航搜索「中山鸿源机动车交易市场」；公交/路线信息待市场方提供",

  /* 快速卖车三大卖点（首页右侧卡片 & 卖车页标题区，两处共用） */
  sellAdvantages: ["直达车商,卖得快;", "全国车商报价,卖的好;", "各大二手车市场合作,有保障;"]
};

/* REPLACE: 顶部导航高亮当前页由 common.js 按文件名自动匹配，无需手改 */
