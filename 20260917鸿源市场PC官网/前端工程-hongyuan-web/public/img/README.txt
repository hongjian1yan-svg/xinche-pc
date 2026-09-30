img/ 目录 —— 图片替换位说明（当前页面均用 CSS 占位实现，双击 file:// 零外链）

正式替换时放入以下文件即可（尺寸建议）：
- logo.png            顶部/页脚 Logo，建议 160x44（替换 common.js renderHeader 中文字标）
- banner/banner1.jpg  首页 Banner 轮播图，建议 1920x480（配合 config.js banners 数组，将 bg 换成 background-image）
- qr-placeholder.png  全站二维码统一占位图（当前所有二维码位均显示此图；正式替换时按下列三个文件名分别放入 img/ 并把 css/style.css 中 .qr-ph::before 的 url 改为对应图，或为各位置单独加类名）
- qr-service.png      微信服务号二维码，建议 232x232
- qr-subscribe.png    微信订阅号二维码，建议 232x232
- qr-app.png          APP 下载二维码，建议 232x232（config.js showAppDownload=false 可隐藏）
- #AI:design:start
- about/about1.png ~ about/about6.png    关于我们场地照片生成图，正式上线替换为市场实拍图
- news/news-1.png ~ news/news-6.png      公司动态新闻缩略图生成图，正式上线替换为新闻实拍图
- sell-bg.png         卖车页头部背景生成图，替换 style.css .sell-hero 渐变占位
- #AI:design:end

- cars/carN-1..4.webp  车源图（N=车型id 1~28，每车4张外观图），来源懂车帝官方车系图库，2026-09-18 抓取。
  ⚠ 版权提示：仅供模板演示/内部预览使用；正式上线必须替换为市场实拍图或获授权图片。
- report-268v.png  车源详情页检测认证图（268V买车无忧检，市场方提供；换市场时替换）
