/* #AI:design —— 多语言包：中文 zh / English en / Русский ru（YAN 2026-09-18 需求）
   依赖顺序：config.js → i18n.js → common.js（8 个页面统一引入）。
   覆盖范围（2026-09-18 起全站生效）：公共骨架 + 首页 + 买车列表/车源详情/卖车/成功页/新闻列表/新闻详情/关于我们 全部界面文案；
   演示数据（车源名称/新闻/商户/关于页正文）同步提供 en/ru 译文（NAME_I18N / NEWS_I18N / DEALER_I18N / ABOUT_I18N）。
   翻译规则见《PC官网设计规范.md》第 8 章：本国语法可读 + 网页常用短词；专有名词（电话/备案号）不译。
   维护约定（REPLACE 心智）：
   - 市场专有名词在 I18N_MARKET 内维护，换市场时同步改；
   - 数组类文案（home.serviceTags / home.sellAdvantages）条数须与 config 基础数组一致，不一致自动回退中文（防漏译）；价格区间标签由 priceLabel() 按语言实时换算，不再用静态数组；
   - 新增车源/新闻演示数据时，同步补 NAME_I18N / NEWS_I18N 对应 id，缺失自动回退中文。 */

(function () {
  /* 默认语言俄文（YAN 2026-09-28 确认）：无已保存选择时默认 ru；用户手动选过则按 hy_lang 记忆展示 */
  var stored = "ru";
  try { stored = localStorage.getItem("hy_lang") || "ru"; } catch (e) {}
  window.__lang = (stored === "zh" || stored === "en") ? stored : "ru";

  /* 市场名称（专有名词，换市场时替换） */
  window.I18N_MARKET = {
    // #AI:design:start
    zh: { name: "中山市鸿源二手车经销有限公司", short: "中山市鸿源二手车经销有限公司" },
    en: { name: "Zhongshan Hongyuan Used Car Dealership Co., Ltd.", short: "Zhongshan Hongyuan Used Car Dealership Co., Ltd." },
    ru: { name: "ООО «Чжуншань Хунъюань — продажа подержанных автомобилей»", short: "ООО «Чжуншань Хунъюань — продажа подержанных автомобилей»" }
    // #AI:design:end
  };

  var I18N = {
    zh: {
      /* ---- 公共骨架 ---- */
      "nav.home": "首页", "nav.buy": "我要买车", "nav.sell": "我要卖车", "nav.news": "公司动态", "nav.about": "关于我们",
      "ui.searchPh": "搜您喜欢的品牌或车系",
      "ui.hotline": "服务热线", "ui.hotlineTip": "服务热线（工作时间 8:30-17:30）",
      "ui.phone": "联系我们", "ui.wechat": "公众号", "ui.miniapp": "小程序", "ui.miniappTip": "扫码进入市场小程序", "ui.top": "回顶部", "ui.scanTip": "扫码关注市场公众号",
      "ui.qrService": "服务号", "ui.qrSubscribe": "订阅号", "ui.qrSubName": "鸿源优选二手车",
      "footer.join": "加入我们", "footer.help": "帮助中心", "footer.feedback": "用户反馈", "footer.sitemap": "网站地图", "footer.investors": "Investors",
      "ui.workHours": "工作时间 8:30 - 17:30", 
      /* ---- 页面标题 ---- */
      "pt.home": "首页", "pt.buy": "我要买车", "pt.sell": "我要卖车", "pt.news": "公司动态", "pt.about": "关于我们", "pt.success": "提交成功",
      /* ---- 首页 ---- */
      "home.buyTitle": "我要买车", "home.sellTitle": "快速卖车", "home.recoTitle": "今日推荐", "home.ratesTitle": "实时汇率",
      "rates.updated": "更新", "rates.rateLabel": "汇率", "rate.usd": "美元", "rate.cny": "人民币", "rate.rub": "卢布", "rate.eur": "欧元",
      "home.allCars": "全部车源", "home.viewMore": "查看更多", "home.empty": "该分类暂无车源",
      "home.btnSell": "快速卖车", "home.btnVal": "免费估价",
      "home.dealerPrefix": "车商介绍：",
      "tabs.newest": "最新上架", "tabs.new": "准新车", "tabs.lowSuv": "低价SUV", "tabs.practice": "练手车", "tabs.cert": "认证车",
      "card.certTag": "认证车源", "card.priceUnit": "万",
      "body.轿车": "轿车", "body.SUV": "SUV", "body.MPV": "MPV", "body.新能源": "新能源", "body.紧凑型": "紧凑型", "body.跑车": "跑车",
      /* ---- 买车列表页 ---- */
      "crumb.national": "全国二手车", "crumb.article": "正文",
      "f.brand": "品牌", "f.series": "车系", "f.price": "价格", "f.other": "其它", "f.level": "级别",
      "f.any": "不限", "f.more": "更多",
      "f.age": "车龄", "f.gearbox": "变速箱", "f.body": "车型", "f.mileage": "里程", "f.emission": "排放标准", "f.displacement": "排量", "f.fuel": "燃料类型",
      "opt.age1": "3年以下", "opt.age2": "3-5年", "opt.age3": "5-8年", "opt.age4": "8年以上",
      "opt.mil1": "1万公里以下", "opt.mil2": "1-3万公里", "opt.mil3": "3-5万公里", "opt.mil4": "5-10万公里", "opt.mil5": "10万公里以上",
      "opt.dis1": "1.0L及以下", "opt.dis2": "1.0-1.6L", "opt.dis3": "1.6-2.0L", "opt.dis4": "2.0L以上",
      "rc.text": "在「{m}」中为您找到 {n} 辆好车",
      "sort.default": "默认排序", "sort.new": "最新发布", "sort.price": "价格", "sort.age": "车龄", "sort.mileage": "里程",
      "chosen.label": "已选：", "chosen.clear": "清空全部",
      "cf.kw": "关键词", "cf.brand": "品牌", "cf.series": "车系", "cf.price": "价格", "cf.body": "车型", "cf.age": "车龄", "cf.gearbox": "变速箱", "cf.mileage": "里程", "cf.emission": "排放", "cf.displacement": "排量", "cf.fuel": "燃料",
      "pc.unit": "万", "pc.ok": "确定", "pc.unlimited": "不限",
      "list.empty": "暂无符合条件的车源，试试放宽筛选",
      /* ---- 车源详情页 ---- */
      "dt.view": "车身外观", "dt.shot1": "车身左前45°", "dt.shot2": "车身正侧", "dt.shot3": "内饰全景", "dt.shot4": "发动机舱",
      "dt.zoom": "点击放大",
      "dt.oldPrice": "新车指导价 {p}",
      "dt.p.reg": "上牌时间", "dt.p.mileage": "表显里程", "dt.p.gearbox": "变速箱", "dt.p.displacement": "排量",
      "dt.p.fuel": "燃料类型", "dt.p.emission": "排放标准", "dt.p.color": "车身颜色", "dt.p.location": "所在地",
      "dt.btn1": "咨询底价", "dt.btn2": "在线咨询",
      "dt.callBtn": "立即联系",
      /* 详情页「立即联系」下拉浮层（2026-09-28 YAN 确认：四行均点击复制，不跳转；联系数值取 config.js，不随语言翻译） */
      "dt.contactTitle": "立即联系",
      "dt.ctHotline": "服务热线", "dt.ctEmail": "邮箱", "dt.ctWhats": "WhatsApp", "dt.ctFb": "Facebook",
      "dt.copied": "已复制",
      "inq.btn": "咨询车况", "inq.title": "咨询车况", "inq.submit": "提交咨询", "inq.close": "关闭",
      "inq.fName": "姓名 <b>*</b>", "inq.fMail": "邮箱 <b>*</b>", "inq.fPhone": "电话（含国家区号） <b>*</b>", "inq.fCountry": "国家/地区 <b>*</b>", "inq.fProvince": "省份 <b>*</b>", "inq.fCity": "城市 <b>*</b>",
      "inq.fType": "咨询内容 <b>*</b>", "inq.fMsg": "留言", "inq.opt0": "请选择",
      "inq.q1": "车况细节", "inq.q2": "更多实拍图/视频", "inq.q3": "报价与砍价", "inq.q4": "出口运输与文件", "inq.q5": "预约看车", "inq.q6": "其他",
      "inq.agree": "我同意市场为回复本次咨询使用我提交的信息",
      "inq.eName": "请填写姓名", "inq.eMail": "请填写正确的邮箱地址", "inq.ePhone": "请填写电话", "inq.eCountry": "请选择国家/地区", "inq.eProvince": "请选择省份", "inq.eCity": "请选择城市", "inq.eType": "请选择咨询内容", "inq.eMsg": "请简单描述您想咨询的问题", "inq.eAgree": "请先勾选同意",
      "inq.doneT": "已提交，等待市场回复", "inq.doneD": "市场将在工作时间内尽快与您联系",
      "dt.report": "检测报告", "dt.contact": "联系方式", "dt.share": "分享该车源", "dt.viewReport": "查看检测报告",
      "dt.reportTxt": "本车已通过市场检测中心 128 项检测：外观漆面、骨架结构、水泡/火烧排查、发动机工况、变速箱换挡、底盘悬挂、电气系统、轮胎制动等。<br>检测结论：非事故、非水泡、非火烧；具体以随车纸质检测报告为准。",
      "dt.scanWechat": "微信扫一扫", "dt.shareTip": "扫码在手机上查看本车源<br>或转发给需要的朋友",
      "dt.copyLink": "复制链接", "dt.makeNote": "生成笔记",
      "dt.copiedLink": "链接已复制", "dt.copiedNote": "车辆笔记已复制，可直接粘贴发送",
      "dt.popTitle": "咨询底价 · 致电市场服务热线",
      /* ---- 卖车页 ---- */
      "sl.advTitle": "在{m}卖车有三大优势：",
      "sl.formHead1": "多渠道卖车，售出速度更快", "sl.formHead2": "发布卖车信息",
      "sl.fModel": "车型车系", "sl.fCity": "上牌城市", "sl.fReg": "首次上牌", "sl.fMile": "行驶里程", "sl.fPrice": "期望售价",
      "sl.fName": "姓名（选填）", "sl.fPhone": "手机号", "sl.fCode": "验证码",
      "sl.unitWanKm": "万公里", "sl.unitWan": "万",
      "sl.city1": "本地上牌", "sl.city2": "外地车牌（需提档过户）",
      "sl.getCode": "获取验证码", "sl.resend": "{s}s 后重发",
      "sl.fMail": "邮箱", "sl.eMail": "请填写正确的邮箱地址",
      "sl.submit": "立即提交",
      "sl.eModel": "请选择车型车系", "sl.eCity": "请选择上牌城市", "sl.eReg": "请选择首次上牌时间",
      "sl.eMile": "请填写行驶里程（万公里）", "sl.ePhone": "请填写正确的 11 位手机号", "sl.eCode": "请填写验证码",
      "sl.adv1t": "直达车商，卖的快", "sl.adv1d": "信息同步市场内 4 家入驻车商，平均 30 分钟内获得报价反馈。",
      "sl.adv2t": "全国车商报价，卖的好", "sl.adv2d": "对接全国车商竞价网络，多路买家出价，价格更透明。",
      "sl.adv3t": "各大二手车市场合作，有保障", "sl.adv3d": "市场服务大厅一站办理过户、结算，交易资金监管更安心。",
      /* ---- 成功页 ---- */
      "sc.title": "提交成功", "sc.tip": "您的卖车信息已提交至「{m}」。<br>稍后将有工作人员与您联系，请保持电话畅通。",
      "sc.btn1": "返回首页", "sc.btn2": "去逛逛车源",
      /* ---- 新闻页 ---- */
      "nl.hot": "热门文章", "nl.slogan": "——诚信、规范、市场化二手车市场",
      "nd.pub": "发布时间：", "nd.src": "来源：", "nd.views": "浏览：{n} 次",
      "nd.prev": "上一篇：", "nd.next": "下一篇：", "nd.none": "没有了", "nd.back": "返回公司动态列表",
      "nd.p1": "作为市场方，我们始终坚持以「诚信、规范、市场化」为经营理念，为进场消费者提供透明、放心的二手车交易环境。",
      "nd.p2": "近年来，二手车行业政策持续利好：交易登记跨省通办、限迁全面取消、反向开票等措施相继落地，行业流通效率显著提升。本市场紧跟政策导向，不断完善检测、金融、过户、售后等一站式配套服务。",
      "nd.p3": "下一步，市场将继续围绕商户经营需求与消费者购车体验，开展常态化诚信评级、车辆抽检与服务培训，推动区域二手车市场高质量发展。",
      /* ---- 关于页 ---- */
      "ab.cap1": "市场交易大厅外景", "ab.cap2": "室内展示场一区", "ab.cap3": "新能源展区",
      "ab.cap4": "综合服务中心·过户大厅", "ab.cap5": "检测中心", "ab.cap6": "夜间停车场",
      "ab.addrLabel": "市场地址", "ab.telLabel": "服务热线", "ab.trafficLabel": "交通信息",
      /* ---- 数据值映射 ---- */
      "v.汽油": "汽油", "v.插电混动": "插电混动", "v.纯电": "纯电",
      "v.国VI": "国VI", "v.国V": "国V",
      "v.白": "白", "v.黑": "黑", "v.银": "银", "v.灰": "灰", "v.红": "红", "v.蓝": "蓝", "v.金": "金",
      "v.本市场A区": "本市场A区", "v.本市场B区": "本市场B区", "v.本市场C区": "本市场C区",
      "v.新能源展区": "新能源展区", "v.豪华车馆": "豪华车馆", "v.商务车馆": "商务车馆",
      "v.色": "色"
    },
    en: {
      "nav.home": "Home", "nav.buy": "Buy", "nav.sell": "Sell", "nav.news": "News", "nav.about": "About",
      "ui.searchPh": "Search brand or model",
      "ui.hotline": "Hotline", "ui.hotlineTip": "Hotline (8:30-17:30 daily)",
      "ui.phone": "Contact Us", "ui.wechat": "WeChat", "ui.miniapp": "Mini App", "ui.miniappTip": "Scan to enter the market mini program", "ui.top": "Top", "ui.scanTip": "Scan to follow our WeChat",
      "ui.qrService": "Service Account", "ui.qrSubscribe": "Subscription", "ui.qrSubName": "Hongyuan Select Cars",
      "footer.join": "Careers", "footer.help": "Help Center", "footer.feedback": "Feedback", "footer.sitemap": "Sitemap", "footer.investors": "Investors",
      "ui.workHours": "Open 8:30 - 17:30", 
      "pt.home": "Home", "pt.buy": "Buy a Car", "pt.sell": "Sell Your Car", "pt.news": "News", "pt.about": "About Us", "pt.success": "Submitted",
      "home.buyTitle": "Buy a Car", "home.sellTitle": "Quick Sale", "home.recoTitle": "Today's Picks", "home.ratesTitle": "Exchange Rates",
      "rates.updated": "updated", "rates.rateLabel": "Rate", "rate.usd": "USD", "rate.cny": "CNY", "rate.rub": "RUB", "rate.eur": "EUR",
      "home.allCars": "All Cars", "home.viewMore": "View More", "home.empty": "No cars in this category yet",
      "home.btnSell": "Sell Now", "home.btnVal": "Free Valuation",
      "home.dealerPrefix": "Dealer: ",
      "tabs.newest": "New Arrivals", "tabs.new": "Nearly New", "tabs.lowSuv": "Budget SUVs", "tabs.practice": "First Cars", "tabs.cert": "Certified",
      "card.certTag": "Certified", "card.priceUnit": "",
      "body.轿车": "Sedan", "body.SUV": "SUV", "body.MPV": "MPV", "body.新能源": "New Energy", "body.紧凑型": "Compact", "body.跑车": "Sports",
      "crumb.national": "Nationwide Cars", "crumb.article": "Article",
      "f.brand": "Brand", "f.series": "Model", "f.price": "Price", "f.other": "More", "f.level": "Level",
      "f.any": "Any", "f.more": "More",
      "f.age": "Age", "f.gearbox": "Gearbox", "f.body": "Body", "f.mileage": "Mileage", "f.emission": "Emission", "f.displacement": "Engine", "f.fuel": "Fuel",
      "opt.age1": "Under 3 yrs", "opt.age2": "3-5 yrs", "opt.age3": "5-8 yrs", "opt.age4": "Over 8 yrs",
      "opt.mil1": "Under 10k km", "opt.mil2": "10k-30k km", "opt.mil3": "30k-50k km", "opt.mil4": "50k-100k km", "opt.mil5": "Over 100k km",
      "opt.dis1": "Up to 1.0L", "opt.dis2": "1.0-1.6L", "opt.dis3": "1.6-2.0L", "opt.dis4": "Over 2.0L",
      "rc.text": "{n} cars found at {m}",
      "sort.default": "Default", "sort.new": "Newest", "sort.price": "Price", "sort.age": "Age", "sort.mileage": "Mileage",
      "chosen.label": "Selected:", "chosen.clear": "Clear all",
      "cf.kw": "Keyword", "cf.brand": "Brand", "cf.series": "Model", "cf.price": "Price", "cf.body": "Body", "cf.age": "Age", "cf.gearbox": "Gearbox", "cf.mileage": "Mileage", "cf.emission": "Emission", "cf.displacement": "Engine", "cf.fuel": "Fuel",
      "pc.unit": "×¥10k", "pc.ok": "OK", "pc.unlimited": "Any",
      "list.empty": "No matching cars. Try wider filters",
      "dt.view": "View", "dt.shot1": "Front 45°", "dt.shot2": "Side", "dt.shot3": "Interior", "dt.shot4": "Engine",
      "dt.zoom": "Click to zoom",
      "dt.oldPrice": "New-car MSRP {p}",
      "dt.p.reg": "Registered", "dt.p.mileage": "Mileage", "dt.p.gearbox": "Gearbox", "dt.p.displacement": "Engine",
      "dt.p.fuel": "Fuel", "dt.p.emission": "Emission", "dt.p.color": "Color", "dt.p.location": "Location",
      "dt.btn1": "Get Best Price", "dt.btn2": "Chat Online",
      "dt.callBtn": "Contact Now",
      /* 详情页「立即联系」下拉浮层文案（点击复制，联系方式数值取 config.js，不翻译） */
      "dt.contactTitle": "Contact Now",
      "dt.ctHotline": "Service Hotline", "dt.ctEmail": "Email", "dt.ctWhats": "WhatsApp", "dt.ctFb": "Facebook",
      "dt.copied": "Copied",
      "inq.btn": "Car Inquiry", "inq.title": "Inquire About This Car", "inq.submit": "Submit Inquiry", "inq.close": "Close",
      "inq.fName": "Name <b>*</b>", "inq.fMail": "Email <b>*</b>", "inq.fPhone": "Phone (with country code) <b>*</b>", "inq.fCountry": "Country / Region <b>*</b>", "inq.fProvince": "Province <b>*</b>", "inq.fCity": "City <b>*</b>",
      "inq.fType": "Inquiry Topic <b>*</b>", "inq.fMsg": "Message", "inq.opt0": "Please select",
      "inq.q1": "Vehicle condition details", "inq.q2": "More photos / video", "inq.q3": "Price & negotiation", "inq.q4": "Export, shipping & documents", "inq.q5": "Book a viewing", "inq.q6": "Other",
      "inq.agree": "I agree that the market may use my information to answer this inquiry",
      "inq.eName": "Please enter your name", "inq.eMail": "Please enter a valid email address", "inq.ePhone": "Please enter your phone number", "inq.eCountry": "Please select a country / region", "inq.eProvince": "Please select a province", "inq.eCity": "Please select a city", "inq.eType": "Please select a topic", "inq.eMsg": "Please briefly describe your question", "inq.eAgree": "Please agree first",
      "inq.doneT": "Submitted. The market will reply soon", "inq.doneD": "The market will contact you within business hours",
      "dt.report": "Inspection Report", "dt.contact": "Contact", "dt.share": "Share This Car", "dt.viewReport": "View Inspection Report",
      "dt.reportTxt": "This car passed the market's 128-point inspection: body & paint, frame structure, flood/fire check, engine, gearbox, suspension, electrics, tires & brakes.<br>Conclusion: no accident, no flood, no fire damage; the paper report prevails.",
      "dt.scanWechat": "Scan with WeChat", "dt.shareTip": "Scan to view this car on mobile<br>or share with friends",
      "dt.copyLink": "Copy Link", "dt.makeNote": "Copy Note",
      "dt.copiedLink": "Link copied", "dt.copiedNote": "Car note copied, ready to paste",
      "dt.popTitle": "Get Best Price · Call the Market Hotline",
      "sl.advTitle": "3 reasons to sell at {m}:",
      "sl.formHead1": "Multi-channel selling — faster deals", "sl.formHead2": "Post Your Car",
      "sl.fModel": "Brand & Model", "sl.fCity": "Registration City", "sl.fReg": "First Registered", "sl.fMile": "Mileage", "sl.fPrice": "Asking Price",
      "sl.fName": "Name (optional)", "sl.fPhone": "Mobile Number", "sl.fCode": "Code",
      "sl.unitWanKm": "×10k km", "sl.unitWan": "×¥10k",
      "sl.city1": "Local plate", "sl.city2": "Out-of-town plate (transfer needed)",
      "sl.getCode": "Get Code", "sl.resend": "Retry {s}s",
      "sl.fMail": "Email", "sl.eMail": "Please enter a valid email address",
      "sl.submit": "Submit Now",
      "sl.eModel": "Please select brand & model", "sl.eCity": "Please select registration city", "sl.eReg": "Please select first registration date",
      "sl.eMile": "Please enter mileage", "sl.ePhone": "Please enter a valid mobile number", "sl.eCode": "Please enter the verification code",
      "sl.adv1t": "Direct to dealers — sell faster", "sl.adv1d": "Your listing reaches 4 in-market dealers; average quote feedback within 30 minutes.",
      "sl.adv2t": "Nationwide dealer bids — better price", "sl.adv2d": "Connected to a nationwide dealer bidding network; multiple buyers, transparent pricing.",
      "sl.adv3t": "Partnered markets — guaranteed deal", "sl.adv3d": "Title transfer and settlement handled in one service hall with fund supervision.",
      "sc.title": "Submitted Successfully", "sc.tip": "Your selling request has been sent to {m}.<br>Our staff will contact you shortly. Please keep your phone available.",
      "sc.btn1": "Back to Home", "sc.btn2": "Browse Cars",
      "nl.hot": "Popular Posts", "nl.slogan": "— Trustworthy, Regulated Used Car Market",
      "nd.pub": "Published: ", "nd.src": "Source: ", "nd.views": "Views: {n}",
      "nd.prev": "Previous: ", "nd.next": "Next: ", "nd.none": "None", "nd.back": "Back to News",
      "nd.p1": "As the market operator, we uphold trustworthy, regulated trading to offer consumers a transparent used-car environment.",
      "nd.p2": "Recent policy tailwinds — cross-province title transfer, lifted import restrictions and new invoicing rules — have greatly improved used-car circulation. Our market keeps upgrading inspection, finance, transfer and after-sale services.",
      "nd.p3": "Next, the market will continue dealer credit ratings, vehicle spot checks and staff training to grow the regional used-car market with quality.",
      "ab.cap1": "Trading Hall Exterior", "ab.cap2": "Indoor Showroom A", "ab.cap3": "New Energy Zone",
      "ab.cap4": "Service Hall · Title Transfer", "ab.cap5": "Inspection Center", "ab.cap6": "Night Parking",
      "ab.addrLabel": "Address", "ab.telLabel": "Hotline", "ab.trafficLabel": "Getting Here",
      "v.汽油": "Petrol", "v.插电混动": "PHEV", "v.纯电": "EV",
      "v.国VI": "China VI", "v.国V": "China V",
      "v.白": "White", "v.黑": "Black", "v.银": "Silver", "v.灰": "Grey", "v.红": "Red", "v.蓝": "Blue", "v.金": "Gold",
      "v.本市场A区": "Market Zone A", "v.本市场B区": "Market Zone B", "v.本市场C区": "Market Zone C",
      "v.新能源展区": "NEV Zone", "v.豪华车馆": "Luxury Hall", "v.商务车馆": "MPV Hall",
      "v.色": "",
      "home.serviceTags": ["Free Guidance", "Financing", "Inspection", "Insurance", "Paperwork", "Repair & Care"],
      "home.sellAdvantages": ["Direct to dealers — sell faster", "Nationwide dealer bids — better price", "Partnered markets — guaranteed deal"],
      // #AI:design:start
      "home.banner1.title": "Zhongshan Hongyuan Used Car Dealership Co., Ltd.",
      // #AI:design:end
      "home.banner1.sub": "Trustworthy · Regulated · One-Stop",
      "home.banner2.title": "Buy & Sell — One-Stop Service",
      "home.banner2.sub": "Guidance / Financing / Inspection / Paperwork",
      "home.banner3.title": "3000+ Certified Cars",
      "home.banner3.sub": "New Arrivals Daily · Warranty"
    },
    ru: {
      "nav.home": "Главная", "nav.buy": "Купить авто", "nav.sell": "Продать авто", "nav.news": "Новости", "nav.about": "О нас",
      "ui.searchPh": "Марка или модель",
      "ui.hotline": "Горячая линия", "ui.hotlineTip": "Горячая линия (8:30–17:30)",
      "ui.phone": "Звонок", "ui.wechat": "WeChat", "ui.miniapp": "Мини-прил.", "ui.miniappTip": "Сканируйте, чтобы открыть мини-приложение рынка", "ui.top": "Вверх", "ui.scanTip": "Отсканируйте, чтобы подписаться в WeChat",
      "ui.qrService": "Сервисный аккаунт", "ui.qrSubscribe": "Аккаунт подписки", "ui.qrSubName": "Отборные авто Хунъюань",
      "footer.join": "Вакансии", "footer.help": "Центр помощи", "footer.feedback": "Обратная связь", "footer.sitemap": "Карта сайта", "footer.investors": "Инвесторам",
      "ui.workHours": "Работаем 8:30 - 17:30", 
      "pt.home": "Главная", "pt.buy": "Купить авто", "pt.sell": "Продать авто", "pt.news": "Новости", "pt.about": "О нас", "pt.success": "Отправлено",
      "home.buyTitle": "Купить автомобиль", "home.sellTitle": "Быстрая продажа", "home.recoTitle": "Рекомендации дня", "home.ratesTitle": "Курсы валют",
      "rates.updated": "обновлено", "rates.rateLabel": "Курс", "rate.usd": "Доллар", "rate.cny": "Юань", "rate.rub": "Рубль", "rate.eur": "Евро",
      "home.allCars": "Все авто", "home.viewMore": "Ещё", "home.empty": "В этой категории пока нет автомобилей",
      "home.btnSell": "Продать сейчас", "home.btnVal": "Бесплатная оценка",
      "home.dealerPrefix": "Дилер: ",
      "tabs.newest": "Новинки", "tabs.new": "Почти новые", "tabs.lowSuv": "Бюджетные внедорожники", "tabs.practice": "Для новичков", "tabs.cert": "Сертифицированные",
      "card.certTag": "Сертифицирован", "card.priceUnit": "",
      "body.轿车": "Седан", "body.SUV": "Внедорожник", "body.MPV": "Минивэн", "body.新能源": "Электро/Гибрид", "body.紧凑型": "Компактный", "body.跑车": "Купе",
      "crumb.national": "Автомобили со всей страны", "crumb.article": "Статья",
      "f.brand": "Марка", "f.series": "Модель", "f.price": "Цена", "f.other": "Ещё", "f.level": "Класс",
      "f.any": "Любая", "f.more": "Ещё",
      "f.age": "Возраст", "f.gearbox": "КПП", "f.body": "Тип кузова", "f.mileage": "Пробег", "f.emission": "Экокласс", "f.displacement": "Двигатель", "f.fuel": "Топливо",
      "opt.age1": "До 3 лет", "opt.age2": "3-5 лет", "opt.age3": "5-8 лет", "opt.age4": "Старше 8 лет",
      "opt.mil1": "До 10 тыс. км", "opt.mil2": "10-30 тыс. км", "opt.mil3": "30-50 тыс. км", "opt.mil4": "50-100 тыс. км", "opt.mil5": "Свыше 100 тыс. км",
      "opt.dis1": "До 1.0L", "opt.dis2": "1.0-1.6L", "opt.dis3": "1.6-2.0L", "opt.dis4": "От 2.0L",
      "rc.text": "На рынке {m} найдено авто: {n}",
      "sort.default": "По умолчанию", "sort.new": "Новые", "sort.price": "Цена", "sort.age": "Возраст", "sort.mileage": "Пробег",
      "chosen.label": "Выбрано:", "chosen.clear": "Сбросить всё",
      "cf.kw": "Запрос", "cf.brand": "Марка", "cf.series": "Модель", "cf.price": "Цена", "cf.body": "Кузов", "cf.age": "Возраст", "cf.gearbox": "КПП", "cf.mileage": "Пробег", "cf.emission": "Экокласс", "cf.displacement": "Двигатель", "cf.fuel": "Топливо",
      "pc.unit": "×10 тыс.¥", "pc.ok": "ОК", "pc.unlimited": "нет",
      "list.empty": "Ничего не найдено. Расширьте фильтры",
      "dt.view": "Вид", "dt.shot1": "Перед 45°", "dt.shot2": "Бок", "dt.shot3": "Салон", "dt.shot4": "Двигатель",
      "dt.zoom": "Нажмите, чтобы увеличить",
      "dt.oldPrice": "Цена нового авто {p}",
      "dt.p.reg": "Регистрация", "dt.p.mileage": "Пробег", "dt.p.gearbox": "КПП", "dt.p.displacement": "Двигатель",
      "dt.p.fuel": "Топливо", "dt.p.emission": "Экокласс", "dt.p.color": "Цвет", "dt.p.location": "Расположение",
      "dt.btn1": "Узнать цену", "dt.btn2": "Онлайн-чат",
      "dt.callBtn": "Связаться сейчас",
      /* 详情页「立即联系」下拉浮层文案（点击复制，联系方式数值取 config.js，不翻译） */
      "dt.contactTitle": "Связаться сейчас",
      "dt.ctHotline": "Горячая линия", "dt.ctEmail": "Электронная почта", "dt.ctWhats": "WhatsApp", "dt.ctFb": "Facebook",
      "dt.copied": "Скопировано",
      "inq.btn": "Запрос об авто", "inq.title": "Запрос об этом автомобиле", "inq.submit": "Отправить", "inq.close": "Закрыть",
      "inq.fName": "Имя <b>*</b>", "inq.fMail": "Эл. почта <b>*</b>", "inq.fPhone": "Телефон (с кодом страны) <b>*</b>", "inq.fCountry": "Страна / регион <b>*</b>", "inq.fProvince": "Провинция <b>*</b>", "inq.fCity": "Город <b>*</b>",
      "inq.fType": "Тема запроса <b>*</b>", "inq.fMsg": "Сообщение", "inq.opt0": "Выберите",
      "inq.q1": "Состояние автомобиля", "inq.q2": "Больше фото / видео", "inq.q3": "Цена и торг", "inq.q4": "Экспорт, доставка, документы", "inq.q5": "Запись на просмотр", "inq.q6": "Другое",
      "inq.agree": "Согласен(на) на использование моих данных для ответа на запрос",
      "inq.eName": "Укажите имя", "inq.eMail": "Введите корректный e-mail", "inq.ePhone": "Укажите номер телефона", "inq.eCountry": "Выберите страну / регион", "inq.eProvince": "Выберите провинцию", "inq.eCity": "Выберите город", "inq.eType": "Выберите тему", "inq.eMsg": "Опишите ваш вопрос", "inq.eAgree": "Сначала поставьте галочку",
      "inq.doneT": "Отправлено, ждите ответа рынка", "inq.doneD": "Рынок свяжется с вами в рабочее время",
      "dt.report": "Отчёт проверки", "dt.contact": "Контакты", "dt.share": "Поделиться", "dt.viewReport": "Смотреть отчёт проверки",
      "dt.reportTxt": "Автомобиль прошёл 128-пунктовую проверку рынка: кузов и ЛКП, силовая структура, проверка на затопление/пожар, двигатель, КПП, подвеска, электрика, шины и тормоза.<br>Вывод: без ДТП, затопления и пожара; бумажный отчёт имеет приоритет.",
      "dt.scanWechat": "Скан в WeChat", "dt.shareTip": "Отсканируйте, чтобы открыть авто на телефоне<br>или переслать друзьям",
      "dt.copyLink": "Ссылка", "dt.makeNote": "Заметка",
      "dt.copiedLink": "Ссылка скопирована", "dt.copiedNote": "Заметка об авто скопирована, можно вставить",
      "dt.popTitle": "Узнать цену · Горячая линия рынка",
      "sl.advTitle": "3 причины продать авто на {m}:",
      "sl.formHead1": "Мультиканальные продажи — быстрее сделка", "sl.formHead2": "Разместить объявление",
      "sl.fModel": "Марка и модель", "sl.fCity": "Город регистрации", "sl.fReg": "Первая регистрация", "sl.fMile": "Пробег", "sl.fPrice": "Желаемая цена",
      "sl.fName": "Имя (необязательно)", "sl.fPhone": "Номер телефона", "sl.fCode": "Код",
      "sl.unitWanKm": "×10 тыс. км", "sl.unitWan": "×10 тыс.¥",
      "sl.city1": "Местный номер", "sl.city2": "Другой регион (нужна смена регистрации)",
      "sl.getCode": "Получить код", "sl.resend": "Повтор {s}с",
      "sl.fMail": "Эл. почта", "sl.eMail": "Введите корректный адрес эл. почты",
      "sl.submit": "Отправить",
      "sl.eModel": "Выберите марку и модель", "sl.eCity": "Выберите город регистрации", "sl.eReg": "Выберите дату первой регистрации",
      "sl.eMile": "Укажите пробег", "sl.ePhone": "Введите корректный номер телефона", "sl.eCode": "Введите код подтверждения",
      "sl.adv1t": "Напрямую дилерам — быстрее", "sl.adv1d": "Заявка сразу 4 дилерам рынка; средний отклик с оценкой — 30 минут.",
      "sl.adv2t": "Ставки со всей страны — выгоднее", "sl.adv2d": "Сеть дилеров по всей стране, несколько покупателей, прозрачная цена.",
      "sl.adv3t": "Партнёрские рынки — с гарантией", "sl.adv3d": "Оформление сделки и расчёт в одном сервисном зале с контролем средств.",
      "sc.title": "Заявка отправлена", "sc.tip": "Ваша заявка на продажу отправлена на рынок {m}.<br>С вами свяжется наш сотрудник — будьте на связи.",
      "sc.btn1": "На главную", "sc.btn2": "Смотреть авто",
      "nl.hot": "Популярное", "nl.slogan": "— Честный и стандартный рынок авто с пробегом",
      "nd.pub": "Опубликовано: ", "nd.src": "Источник: ", "nd.views": "Просмотры: {n}",
      "nd.prev": "Предыдущая: ", "nd.next": "Следующая: ", "nd.none": "Нет", "nd.back": "К списку новостей",
      "nd.p1": "Как оператор рынка мы придерживаемся принципов честности и стандартов, обеспечивая покупателям прозрачную среду.",
      "nd.p2": "Последние меры политики — межпровинциальная смена регистрации, снятие ограничений и новые правила выставления счетов — заметно ускорили оборот авто с пробегом. Рынок развивает проверку, финансирование и сервис.",
      "nd.p3": "Далее рынок продолжит рейтингование дилеров, выборочные проверки авто и обучение персонала ради качественного развития регионального авторынка.",
      "ab.cap1": "Главный торговый зал", "ab.cap2": "Крытая площадка A", "ab.cap3": "Зона электромобилей",
      "ab.cap4": "Сервисный центр · Регистрация", "ab.cap5": "Центр проверки", "ab.cap6": "Ночная парковка",
      "ab.addrLabel": "Адрес рынка", "ab.telLabel": "Горячая линия", "ab.trafficLabel": "Как добраться",
      "v.汽油": "Бензин", "v.插电混动": "Гибрид (PHEV)", "v.纯电": "Электро",
      "v.国VI": "China VI", "v.国V": "China V",
      "v.白": "Белый", "v.黑": "Чёрный", "v.银": "Серебристый", "v.灰": "Серый", "v.红": "Красный", "v.蓝": "Синий", "v.金": "Золотистый",
      "v.本市场A区": "Зона A рынка", "v.本市场B区": "Зона B рынка", "v.本市场C区": "Зона C рынка",
      "v.新能源展区": "Зона EV", "v.豪华车馆": "Зал люкс", "v.商务车馆": "Зал MPV",
      "v.色": "",
      "home.serviceTags": ["Бесплатный гид", "Автокредит", "Экспертиза", "Страхование", "Оформление", "ТО и ремонт"],
      "home.sellAdvantages": ["Напрямую дилерам — продадим быстрее", "Ставки со всей страны — выгодная цена", "Партнёрские рынки — сделка под гарантией"],
      // #AI:design:start
      "home.banner1.title": "ООО «Чжуншань Хунъюань — продажа подержанных автомобилей»",
      // #AI:design:end
      "home.banner1.sub": "Честно · Стандартно · Комфортно",
      "home.banner2.title": "Всё для покупки и продажи",
      "home.banner2.sub": "Гид / Автокредит / Экспертиза / Оформление",
      "home.banner3.title": "3000+ проверенных авто",
      "home.banner3.sub": "Новинки ежедневно · Гарантия"
    }
  };

  /* 国家/地区下拉数据（[中文, English, Русский]）：海外市场常见目的地，换市场时可增删 */
  var COUNTRIES = window.COUNTRIES = [
    ["中国", "China", "Китай"],
    ["俄罗斯", "Russia", "Россия"],
    ["哈萨克斯坦", "Kazakhstan", "Казахстан"],
    ["吉尔吉斯斯坦", "Kyrgyzstan", "Кыргызстан"],
    ["乌兹别克斯坦", "Uzbekistan", "Узбекистан"],
    ["格鲁吉亚", "Georgia", "Грузия"],
    ["阿塞拜疆", "Azerbaijan", "Азербайджан"],
    ["阿联酋", "UAE", "ОАЭ"],
    ["沙特阿拉伯", "Saudi Arabia", "Саудовская Аравия"],
    ["泰国", "Thailand", "Таиланд"],
    ["越南", "Vietnam", "Вьетнам"],
    ["菲律宾", "Philippines", "Филиппины"],
    ["马来西亚", "Malaysia", "Малайзия"],
    ["柬埔寨", "Cambodia", "Камбоджа"],
    ["缅甸", "Myanmar", "Мьянма"],
    ["其他", "Other", "Другое"]
  ];

  /* ---------- 演示数据译文（车源名称，按 id） ---------- */
  var NAME_I18N = {
    1:  { en: "Audi A4L 2021 40TFSI Luxury Sport", ru: "Ауди A4L 2021 40TFSI Люкс" },
    2:  { en: "Buick Excelle 2019 18T AT Elite", ru: "Бьюик Excelle 2019 18T AT Elite" },
    3:  { en: "Volkswagen Polo 2016 1.4L AT Trend", ru: "Volkswagen Polo 2016 1.4L AT Trend" },
    4:  { en: "BYD Song PLUS DM-i 2021 110KM Flagship", ru: "BYD Song PLUS DM-i 2021 110KM" },
    5:  { en: "Honda CR-V 2020 240TURBO 2WD Urban", ru: "Хонда CR-V 2020 240TURBO 2WD" },
    6:  { en: "Toyota Corolla 2018 1.2T AT Pioneer", ru: "Тойота Corolla 2018 1.2T AT" },
    7:  { en: "Nissan Sylphy 2022 1.6L CVT XL Smart", ru: "Ниссан Sylphy 2022 1.6L CVT XL" },
    8:  { en: "BMW 3 Series 2020 325Li M Sport", ru: "БМВ 3 серии 2020 325Li M Sport" },
    9:  { en: "Mercedes-Benz C-Class 2019 C 260 L Sport", ru: "Mercedes-Benz C-Класс 2019 C 260 L Sport" },
    10: { en: "Geely Boyue 2021 1.8TD AT 2WD", ru: "Geely Boyue 2021 1.8TD AT" },
    11: { en: "Haval H6 2020 1.5T AT Platinum Urban", ru: "Haval H6 2020 1.5T AT Platinum" },
    12: { en: "Ford Focus 2019 HB EcoBoost 180 AT", ru: "Форд Focus 2019 EcoBoost 180 AT" },
    13: { en: "Volkswagen Tiguan L 2021 330TSI 2WD Smart", ru: "Volkswagen Tiguan L 2021 330TSI 2WD" },
    14: { en: "Buick GL8 2018 ES 28T Comfort", ru: "Бьюик GL8 2018 ES 28T Comfort" },
    15: { en: "Wuling Hongguang MINI EV 2022 Enjoy NMC", ru: "Wuling Hongguang MINI EV 2022 Enjoy" },
    16: { en: "Tesla Model 3 2021 Standard Range RWD Plus", ru: "Tesla Model 3 2021 Standard Range" },
    17: { en: "Toyota Highlander 2017 2.0T AWD Luxury 7-seat", ru: "Тойота Highlander 2017 2.0T AWD 7 мест" },
    18: { en: "Honda Fit 2021 1.5L CVT Sport", ru: "Хонда Fit 2021 1.5L CVT Sport" },
    19: { en: "Audi Q3 2019 35TFSI Style Sport", ru: "Ауди Q3 2019 35TFSI Style" },
    20: { en: "Nissan Qashqai 2023 1.3T CVT Leader", ru: "Ниссан Qashqai 2023 1.3T CVT" },
    21: { en: "BYD Qin PLUS DM-i 2023 Champion 55KM", ru: "BYD Qin PLUS DM-i 2023 Champion 55KM" },
    22: { en: "Volkswagen Lavida 2017 1.6L AT Comfort", ru: "Volkswagen Lavida 2017 1.6L AT" },
    23: { en: "Hyundai ix35 2018 2.0L AT 2WD Comfort", ru: "Hyundai ix35 2018 2.0L AT" },
    24: { en: "Mercedes-Benz E-Class 2021 E 300 L Style", ru: "Mercedes-Benz E-Класс 2021 E 300 L Style" },
    25: { en: "BMW X1 2022 sDrive20Li Style", ru: "БМВ X1 2022 sDrive20Li Style" },
    26: { en: "GAC Trumpchi M8 2021 390T Luxury", ru: "GAC M8 2021 390T Luxury" },
    27: { en: "Ford Mustang 2019 2.3T EcoBoost Dark Edition", ru: "Форд Mustang 2019 2.3T EcoBoost" },
    28: { en: "Changan CS35 PLUS 2020 1.4T AT Connect", ru: "Changan CS35 PLUS 2020 1.4T AT" }
  };

  /* 品牌短名（首页品牌行/列表页品牌筛选） */
  var BRAND_I18N = {
    "奥迪": { en: "Audi", ru: "Ауди" }, "别克": { en: "Buick", ru: "Бьюик" }, "大众": { en: "Volkswagen", ru: "VAG" },
    "丰田": { en: "Toyota", ru: "Тойота" }, "本田": { en: "Honda", ru: "Хонда" }, "日产": { en: "Nissan", ru: "Ниссан" },
    "宝马": { en: "BMW", ru: "БМВ" }, "奔驰": { en: "Mercedes", ru: "Мерседес" }, "比亚迪": { en: "BYD", ru: "BYD" },
    "吉利": { en: "Geely", ru: "Geely" }, "哈弗": { en: "Haval", ru: "Haval" }, "福特": { en: "Ford", ru: "Форд" },
    "五菱": { en: "Wuling", ru: "Wuling" }, "特斯拉": { en: "Tesla", ru: "Tesla" }, "现代": { en: "Hyundai", ru: "Hyundai" },
    "广汽传祺": { en: "GAC", ru: "GAC" }, "长安": { en: "Changan", ru: "Changan" }
  };

  /* 车系短名（列表页车系筛选；ru 沿用国际拉丁车型名） */
  var SERIES_I18N = {
    "奥迪A4L": "A4L", "英朗": "Excelle", "Polo": "Polo", "宋PLUS": "Song PLUS", "CR-V": "CR-V", "卡罗拉": "Corolla",
    "轩逸": "Sylphy", "3系": "3 Series", "C级": "C-Class", "博越": "Boyue", "H6": "H6", "福克斯": "Focus",
    "途观L": "Tiguan L", "GL8": "GL8", "宏光MINIEV": "Hongguang MINI EV", "Model3": "Model 3", "汉兰达": "Highlander",
    "飞度": "Fit", "Q3": "Q3", "逍客": "Qashqai", "秦PLUS": "Qin PLUS", "朗逸": "Lavida", "ix35": "ix35",
    "E级": "E-Class", "X1": "X1", "M8": "M8", "Mustang": "Mustang", "CS35PLUS": "CS35 PLUS"
  };

  /* 新闻译文（按 id） */
  var NEWS_I18N = {
    1: { en: { title: "Market News | Hongyuan August Trusted-Dealer List Announced", summary: "Based on customer ratings, deal fulfillment and complaint rates, this month's Trusted Dealer list is out. The market keeps pushing credit ratings for worry-free buying.", imgText: "Trusted Dealers" },
       ru: { title: "Новости | Список надёжных дилеров Хунъюаня за август", summary: "По оценкам клиентов, исполнению сделок и уровню жалоб опубликован месячный рейтинг надёжных дилеров. Рынок продолжает развивать систему кредитных рейтингов.", imgText: "Рейтинг дилеров" } },
    2: { en: { title: "Policy | Cross-province used-car title transfer now live at our market", summary: "The nationwide cross-province transfer program for used-car registration is fully in effect; our service hall has a dedicated window for one-stop title transfer.", imgText: "Transfer Window" },
       ru: { title: "Политика | Межпровинциальная смена регистрации запущена на рынке", summary: "Программа межпровинциального переоформления авто с пробегом вступила в силу; в сервисном зале рынка работает специальное окно.", imgText: "Окно регистрации" } },
    3: { en: { title: "Industry | NEV used-car resale value recovers: 3-year retention over 55%", summary: "With unified battery-health standards and better warranties, NEV used-car circulation accelerates. Our NEV zone traffic rose 30% month on month.", imgText: "NEV Value" },
       ru: { title: "Отрасль | Ликвидность электро авто растёт: остаточная стоимость за 3 года свыше 55%", summary: "Благодаря единым стандартам проверки батареи и гарантиям оборот электромобилей с пробегом ускоряется. Поток в зону EV вырос на 30% за месяц.", imgText: "Ценность EV" } },
    4: { en: { title: "Event | Summer Car Festival closes with 612 deals in 3 days", summary: "The 3-day Summer Car Festival welcomed 26k visitors and 612 on-site deals. Thanks to dealers and buyers — National Day festival coming soon.", imgText: "Summer Festival" },
       ru: { title: "Событие | Летний автосалон: 612 сделок за 3 дня", summary: "Трёхдневный летний фестиваль собрал свыше 26 тыс. гостей и 612 сделок. Благодарим дилеров и покупателей — впереди фестиваль к Дню образования КНР.", imgText: "Летний фестиваль" } },
    5: { en: { title: "Service | New 128-point inspection line, reports verifiable online", summary: "The inspection center upgraded equipment with underbody imaging and battery-health testing; reports are online and verifiable by QR code.", imgText: "Inspection Upgrade" },
       ru: { title: "Сервис | Новая линия проверки из 128 пунктов, отчёт проверяется онлайн", summary: "Центр проверки обновил оборудование: добавлены съёмка днища и тест батареи. Отчёты загружаются онлайн и проверяются по QR-коду.", imgText: "Апгрейд проверки" } },
    6: { en: { title: "Notice | Zone B viewing route adjusted during flood season", summary: "Due to drainage works in flood season, the Zone B viewing route is temporarily adjusted. Please follow on-site signs; sorry for the inconvenience.", imgText: "Flood-season Guide" },
       ru: { title: "Инфо | Маршрут в зоне B временно изменён в сезон паводков", summary: "Из-за работ по дренажу в сезон паводков маршрут осмотра авто в зоне B временно изменён. Проследуйте по указателям на месте.", imgText: "Указатель сезона" } }
  };

  /* 商户译文（按数组下标） */
  var DEALER_I18N = [
    { en: { name: "CarStar Luxury Cars", desc: "Dealer: professional used-car brokerage, wholesale & retail, focused on luxury brands, nationwide coverage." },
      ru: { name: "CarStar Люкс", desc: "Дилер: профессиональный брокер, опт и розница, люксовые бренды, работа по всей стране." } },
    { en: { name: "Integrity Auto Mall", desc: "Dealer: 10+ years in family-car wholesale, mainstream brands ¥30k-150k, nationwide delivery & warranty supported." },
      ru: { name: "Integrity Авто", desc: "Дилер: более 10 лет в опте семейных авто, бренды ¥30-150 тыс., доставка и гарантия по стране." } },
    { en: { name: "NEV House", desc: "Dealer: focused on used NEVs; battery health report included; BYD, Tesla, Li Auto and more." },
      ru: { name: "NEV Дом", desc: "Дилер: электромобили с пробегом; отчёт о состоянии батареи в комплекте; BYD, Tesla, Li Auto и др." } },
    { en: { name: "SmoothRoad MPV Store", desc: "Dealer: MPV & business vans — GL8, Trumpchi M8, Sienna in stock; financing & trade-in supported." },
      ru: { name: "SmoothRoad MPV", desc: "Дилер: минивэны и бизнес-вэны — GL8, M8, Sienna в наличии; кредит и trade-in." } }
  ];

  /* 关于页正文译文 */
  // #AI:design:start
  var ABOUT_I18N = {
    zh: { address: "中山市火炬开发区大岭工业区22号之九" },
    en: {
      p1: "<b>{m}</b> was established in 2011 and is located at {address}. As a flagship market under the used-car division of Zhongshan Materials Group, it has operated in the used-car industry for years and is one of the city's core used-car trading platforms.",
      p2: "The group's used-car division pioneered the one-stop used-car mall service model, building a full-chain platform covering choosing, appraisal, title transfer and after-sale, with financing, repair and insurance on site. It holds used-car export qualification (export, logistics, customs, settlement) and shares inventory with major markets nationwide, rated among Guangdong Top-10 used-car markets. <span style='color:#999'>(Compiled from public business registration and group website on 2026-09-18; please have the market verify before official release)</span>",
      p3: "— With integrity, innovation and service at our core, we build a worry-free, comfortable car-buying experience.",
      intro: "Market profile: Zhongshan Hongyuan Used Car Dealership Co., Ltd., established 2011, located at {address}. A flagship market of Zhongshan Materials Group offering one-stop used-car trading, title transfer, appraisal and annual inspection services.",
      address: "No. 22-9, Daling Industrial Area, Torch Development Zone, Zhongshan City",
      traffic: "Search 'Hongyuan Motor Vehicle Market' in your navigation app; bus info to be provided by the market"
    },
    ru: {
      p1: "<b>{m}</b> основана в 2011 году и расположена по адресу: {address}. Это ключевой рынок автомобильного подразделения группы Zhongshan Materials и одна из основных площадок оборота авто с пробегом в городе.",
      p2: "Подразделение группы первым в стране создало формат авторынка полного цикла: «выбор — оценка — регистрация — послепродажное обслуживание» с финансированием, ремонтом и страхованием на месте. Есть лицензия на экспорт авто с пробегом (экспорт, логистика, таможня, расчёты), действует обмен стоками с крупными рынками страны; рынок входил в топ-10 рынков Гуандуна. <span style='color:#999'>(Составлено по открытым данным 2026-09-18; перед официальным публикацией просим рынок подтвердить)</span>",
      p3: "— Честность, инновации и сервис: создаём комфортную и надёжную среду покупки автомобиля.",
      intro: "О рынке: ООО «Чжуншань Хунъюань — продажа подержанных автомобилей», основано в 2011 г.; адрес: {address}. Ключевой рынок группы Zhongshan Materials: продажа авто с пробегом, смена регистрации, оценка, техосмотр — всё в одном месте.",
      address: "г. Чжуншань, зона развития Торч, промышленная зона Далин, дом 22-9",
      traffic: "В навигаторе ищите «Hongyuan Motor Vehicle Market»; информацию об автобусах предоставит рынок"
    }
  };
  // #AI:design:end

  /* ---------- 核心 API ---------- */
  window.t = function (key) {
    var d = I18N[window.__lang] || I18N.zh;
    if (d[key] != null) return d[key];
    if (I18N.zh[key] != null) return I18N.zh[key];
    return key;
  };
  /* 模板串：tf('rc.text', {n:8, m:'Hongyuan'}) */
  window.tf = function (key, vars) {
    var s = t(key);
    Object.keys(vars || {}).forEach(function (k) { s = s.replace("{" + k + "}", vars[k]); });
    return s;
  };
  window.tArr = function (key, baseArr) {
    if (window.__lang === "zh") return baseArr;
    var a = (I18N[window.__lang] || {})[key];
    return (a && a.length === baseArr.length) ? a : baseArr;
  };
  window.tOr = function (key, fallback) {
    if (window.__lang === "zh") return fallback;
    var v = (I18N[window.__lang] || {})[key];
    return v != null ? v : fallback;
  };
  window.marketName = function () { return I18N_MARKET[window.__lang].name; };
  window.marketShort = function () { return I18N_MARKET[window.__lang].short; };
  /* 数据值本地化：颜色/燃料/排放/位置 */
  window.V = function (zhVal) {
    if (window.__lang === "zh") return zhVal;
    return t("v." + zhVal);
  };
  window.carName = function (car) {
    if (window.__lang === "zh") return car.name;
    var n = NAME_I18N[car.id];
    return n ? n[window.__lang] : car.name;
  };
  window.brandName = function (b) {
    if (window.__lang === "zh") return b;
    var m = BRAND_I18N[b];
    return m ? m[window.__lang] : b;
  };
  window.seriesName = function (s) {
    if (window.__lang === "zh") return s;
    return SERIES_I18N[s] || s;
  };
  window.newsI = function (n) {
    if (window.__lang === "zh") return n;
    var x = NEWS_I18N[n.id];
    return x ? x[window.__lang] : n;
  };
  window.dealerI = function (i, m) {
    if (window.__lang === "zh") return m;
    var x = DEALER_I18N[i];
    return x ? x[window.__lang] : m;
  };
  window.aboutI = function () {
    if (window.__lang === "zh") return null;
    return ABOUT_I18N[window.__lang];
  };
  window.marketIntroI = function () {
    if (window.__lang === "zh") return SITE_CONFIG.marketIntro;
    var x = ABOUT_I18N[window.__lang];
    return x ? x.intro : SITE_CONFIG.marketIntro;
  };
  window.addressI = function () {
    var x = ABOUT_I18N[window.__lang];
    return x ? x.address : SITE_CONFIG.address;
  };
  window.trafficI = function () {
    if (window.__lang === "zh") return SITE_CONFIG.traffic;
    var x = ABOUT_I18N[window.__lang];
    return x ? x.traffic : SITE_CONFIG.traffic;
  };

  /* ---------- 数值/单位格式化（万 ↔ k/тыс.） ---------- */
  window.fmtMileage = function (v) {           /* v 单位：万公里 */
    if (window.__lang === "zh") return v + "万公里";
    var k = v * 10;
    var s = (k % 1 === 0) ? k : k.toFixed(1);
    return window.__lang === "en" ? s + "k km" : s + " тыс. км";
  };
  /* #AI:design —— 俄文千卢布格式化（YAN 2026-09-28 确认：全站卢布统一「тыс. ₽」，废除「млн ₽」写法）
     v 单位：万元人民币 → 千卢布 = v × 10000 × 11.59 ÷ 1000；保留 1 位小数（整数省略）、逗号小数点（俄式）、整数部分空格千分位。例：7万 → 811,3 тыс. ₽；32.6万 → 3 778,3 тыс. ₽ */
  function fmtRubThs(v) {
    var t = Math.round(v * 10000 * 11.59 / 100) / 10;  /* 千卢布，四舍五入到 1 位小数 */
    var s = (t % 1 === 0) ? String(t) : t.toFixed(1);
    var p = s.split(".");
    p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return (p.length > 1 ? p[0] + "," + p[1] : p[0]) + " тыс. ₽";
  }
  window.fmtPrice = function (v) {             /* v 单位：万元人民币；中文=万，英文=美元，俄文=千卢布（тыс. ₽） */
    if (window.__lang === "zh") return v + "万";
    /* 换算汇率与 js/rates.js 保持一致（演示固定值，接实时汇率接口后同步替换） */
    var usdPerCny = 6.876;
    if (window.__lang === "en") {
      var usd = Math.round(v * 10000 / usdPerCny);
      return "$" + usd.toLocaleString("en-US");
    }
    return fmtRubThs(v);
  };
  /* 美元辅助价（v 单位：万元人民币）：与 fmtPrice en 分支同汇率同格式（$千分位），供俄文双币展示复用 */
  window.fmtUsd = function (v) {
    var usd = Math.round(v * 10000 / 6.876);
    return "$" + usd.toLocaleString("en-US");
  };
  /* #AI:design —— 售价双币（YAN 2026-09-28 确认）：俄文=卢布为主+美元并排为辅；en/zh 与 fmtPrice 输出口径一致（返回 HTML 安全串）。
     仅用于「车辆售价」；新车指导价(diOldPrice)/价格区间(priceLabel)仍用 fmtPrice 单币种，勿在此函数上扩散。 */
  window.fmtPriceDualHTML = function (v) {
    if (window.__lang !== "ru") return esc(fmtPrice(v));
    return '<span class="pc-rub">' + esc(fmtPrice(v)) + '</span><span class="pc-usd">' + esc(fmtUsd(v)) + '</span>';
  };
  /* 双币纯文本版（分享笔记等复制场景，俄文用 / 分隔） */
  window.fmtPriceDualText = function (v) {
    if (window.__lang !== "ru") return fmtPrice(v);
    return fmtPrice(v) + " / " + fmtUsd(v);
  };
  /* 价格区间标签（min/max 单位：万元人民币）：随语言翻译并按同汇率换算 */
  window.priceLabel = function (min, max) {
    var L = window.__lang;
    if (L === "zh") {
      if (min === 0) return max + "万以下";
      if (max >= 999) return min + "万以上";
      return min + "-" + max + "万";
    }
    if (L === "en") {
      var k = function (w) { return Math.round(w * 10000 / 6.876 / 1000); };
      if (min === 0) return "Under $" + k(max) + "k";
      if (max >= 999) return "Over $" + k(min) + "k";
      return "$" + k(min) + "–" + k(max) + "k";
    }
    /* 俄文区间标签统一 тыс. ₽（YAN 2026-09-28，废除 млн 分支）；数值四舍五入到百位、无小数，
       允许与中文档位不逐一对应（YAN 2026-09-28 确认）；车辆售价 fmtPrice 仍 1 位小数，勿混淆 */
    var rk = function (w) {
      var h = Math.round(w * 10000 * 11.59 / 1000 / 100) * 100;   /* 千卢布取整到百位 */
      return String(h).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " тыс. ₽";
    };
    if (min === 0) return "до " + rk(max);
    if (max >= 999) return "от " + rk(min);
    return rk(min) + " – " + rk(max);
  };
  window.fmtReg = function (s) {               /* "2021-06" */
    if (window.__lang === "zh") return s + "上牌";
    if (window.__lang === "en") return "Reg. " + s;
    var p = s.split("-"); return "Рег. " + (p.length > 1 ? p[1] + "." + p[0] : s);
  };
  window.fmtGear = function (g) {              /* "自动(CVT)" / "自动" / "手动" */
    var base = g.split("(")[0];
    if (window.__lang === "zh") return g.indexOf("(") > -1 ? g.replace("自动(", "").replace(")", "") : base;
    if (g.indexOf("E-CVT") > -1) return "E-CVT";
    if (g.indexOf("CVT") > -1) return "CVT";
    if (base.indexOf("自动") > -1) return window.__lang === "en" ? "AT" : "АКПП";
    if (base.indexOf("手动") > -1) return window.__lang === "en" ? "MT" : "МКПП";
    return base;
  };
  window.bodyLabel = function (b) {
    var key = "body." + b;
    var d = I18N[window.__lang] || I18N.zh;
    return d[key] != null ? d[key] : b;
  };

  /* ---------- 切换语言 ---------- */
  document.documentElement.setAttribute("data-lang", window.__lang);
  /* 初始加载同步 <html lang>（原先仅 setLang 时更新，默认 ru 需与页面语言一致；zh 仍映射 zh-CN） */
  document.documentElement.lang = (window.__lang === "zh") ? "zh-CN" : window.__lang;

  window.setLang = function (lang) {
    if (lang !== "zh" && lang !== "en" && lang !== "ru") return;
    window.__lang = lang;
    try { localStorage.setItem("hy_lang", lang); } catch (e) {}
    document.documentElement.lang = (lang === "zh") ? "zh-CN" : lang;
    document.documentElement.setAttribute("data-lang", lang);
    if (typeof renderHeader === "function" && typeof renderFooter === "function") {
      renderHeader(window.__activePage || "");
      renderFooter();
      renderFloatBar();
    }
    /* 页内静态标记 */
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) { el.placeholder = t(el.dataset.i18nPh); });
    if (typeof window.__rerenderPage === "function") window.__rerenderPage();
    if (typeof window.enhanceAllSelects === "function") window.enhanceAllSelects();
    if (typeof window.refreshSelectPh === "function") window.refreshSelectPh();
  };
})();
