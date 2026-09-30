<!-- #AI:prd:file -->

# 鸿源市场 PC 官网账号登录技术可行性说明

> 文档用途：提供技术团队评估开发可行性、服务选型和联调范围。
>
> 适用项目：鸿源市场 PC 官网
>
> 文档日期：2026-09-24
>
> 当前状态：技术评估稿，尚未进入页面开发和生产接入

## 1. 结论摘要

本次建议评估三类登录方式：

1. Google 账号登录：技术上可行，使用 Google Sign in with Google / OpenID Connect。
2. Telegram 账号登录：技术上可行，建议使用 Telegram 官方 OpenID Connect 授权码流程。
3. 国外手机号登录：技术上可行，使用短信验证码（SMS OTP）验证手机号，再创建或登录鸿源本地账号。

本期暂不考虑 WhatsApp 作为第三方账号登录方式。WhatsApp 可作为后续手机号验证码或消息触达渠道，但不按 Google/Telegram 同类的通用网站 OAuth 登录来设计。

当前官网是静态 HTML 预览，不能仅通过增加按钮完成安全登录。正式开发至少需要后端接口、用户数据库、登录 Session、HTTPS 域名，以及 Google/Telegram/短信服务商的应用配置。

## 2. 目标

为海外买家、卖家和咨询用户提供低门槛的官网登录能力，用于后续支持：

- 保存用户账号和手机号验证状态；
- 关联收藏、询价、卖车或咨询记录；
- 在不同设备上恢复用户登录状态；
- 为后续线索跟进和账号安全提供统一身份。

本说明只评估登录和身份验证能力，不包含会员等级、支付、营销消息、权限角色和后台账号体系。

## 3. 推荐用户流程

```text
用户点击“登录/注册”
        |
        +--> Google 登录
        |       → Google 授权 → 鸿源回调接口 → 后端验证 Token
        |
        +--> Telegram 登录
        |       → Telegram 授权 → 鸿源回调接口 → 后端验证 Token
        |
        +--> 手机号登录
                → 选择国家区号、输入手机号
                → 后端发送短信验证码
                → 用户输入验证码
                → 后端校验验证码

验证成功 → 查找或创建鸿源本地账号 → 发放鸿源 Session → 返回原页面
验证失败 → 展示原因和重试入口
```

## 4. 各登录方式的实现建议

### 4.1 Google 登录

技术方案：Google Identity Services + OpenID Connect。

开发要点：

- 在 Google Cloud Console 创建项目和 OAuth Client ID；
- 配置官网域名、授权来源和回调地址；
- 前端展示 Google 官方登录按钮；
- 后端验证 ID Token 的签名、发行方、受众和有效期；
- 使用 Google `sub` 作为第三方账号唯一标识，不以邮箱作为唯一主键；
- 验证通过后创建或关联鸿源账号，并发放鸿源自己的登录 Session。

官方资料：

- [Google Sign in with Google](https://developers.google.com/identity/gsi/web/guides/overview)
- [Google OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect)

### 4.2 Telegram 登录

技术方案：Telegram 官方 OpenID Connect 授权码流程，建议使用 PKCE。

开发要点：

- 通过 BotFather 创建 Telegram Bot；
- 配置允许的官网域名和回调地址；
- 前端跳转 Telegram 授权页面；
- 后端验证 ID Token 的签名、`iss`、`aud`、`exp` 等字段；
- 使用 Telegram 用户 ID 作为第三方账号唯一标识；
- 如未来需要读取手机号，必须单独取得用户授权，不能默认获取；
- 旧版 Login Widget 也可实现，但后端需要校验 Telegram 返回数据的 HMAC。

官方资料：

- [Telegram Login with OIDC](https://core.telegram.org/bots/telegram-login)
- [Telegram Login Widget](https://core.telegram.org/widgets/login/)

### 4.3 国外手机号登录

技术方案：短信一次性验证码（SMS OTP）。

推荐流程：

1. 用户选择国家或地区；
2. 用户输入手机号；
3. 前端将手机号提交给鸿源后端；
4. 后端调用短信验证服务发送验证码；
5. 用户输入验证码；
6. 后端向短信服务商校验验证码；
7. 校验成功后创建或登录鸿源账号。

手机号必须统一为 E.164 国际格式，例如：

```text
+8613812345678
+79161234567
+447911123456
```

注意：国际手机号登录技术上可行，但不是所有国家、运营商和号码类型都能保证短信送达。应先确定目标国家，再进行真实号码测试。

可选服务：

| 方案 | 适合情况 | 主要特点 | 需要确认 |
| --- | --- | --- | --- |
| Firebase Phone Auth | 希望快速上线验证 | 自带短信验证、登录态和人机校验 | 目标国家支持范围、数据处理和服务依赖 |
| Twilio Verify | 希望鸿源保留自己的账号体系 | 支持短信验证码、国家权限、频控和反欺诈配置 | 目标国家送达率、价格、账号审核和企业资质 |
| 自建短信验证码 | 已有稳定国际短信通道和运维能力 | 可完全控制后端逻辑 | 不建议作为第一期方案，风控和送达维护成本较高 |

参考资料：

- [Firebase Web 手机号登录](https://firebase.google.com/docs/auth/web/phone-auth)
- [Twilio Verify 国家和地区送达能力](https://www.twilio.com/docs/verify/verify-countries-and-regions-deliverability)
- [Twilio Verify 验证接口](https://www.twilio.com/docs/verify/api/verification)
- [Twilio Verify 防止短信诈骗](https://www.twilio.com/docs/verify/preventing-toll-fraud)

### 4.4 费用评估

| 费用项 | 是否通常按登录次数收费 | 说明 |
| --- | --- | --- |
| Google 登录 | 通常没有单独的登录调用费 | Google 官方登录能力本身通常不按成功登录次数收费；鸿源仍需承担后端、数据库、域名等运行成本。 |
| Telegram 登录 | 通常没有单独的登录调用费 | 官方登录流程通常不按登录次数收费；鸿源仍需承担后端、数据库、域名等运行成本。 |
| Firebase 手机号验证 | 短信收费 | Firebase Phone Auth 按发送短信计费；启用短信服务需关联 Cloud Billing。具体单价按目标国家和 Firebase 当前价格页核算。 |
| Twilio Verify | 收费 | 由验证服务费和短信通道费组成。Twilio 页面当前列出的基础验证费为每次成功验证 US$0.05，此外另计短信费用；国际短信价格按目的国家、运营商等因素变化。 |
| 鸿源自有运行环境 | 视现有资源而定 | 可能涉及服务器、数据库、域名、监控和维护等费用；如已有可复用资源，新增成本需由技术团队核算。 |

费用判断：Google 和 Telegram 登录通常没有按登录次数计费的第三方登录费；国外手机号登录需要短信预算。免费试用、免费额度或促销政策不应作为正式预算依据。

价格会调整，以上仅用于方案比较，不作为报价或预算承诺。技术团队应根据首期目标国家、预估验证码发送量及失败重发量，使用服务商当前价格计算月度区间，并确认税费、号码/注册要求和账单币种。

费用参考（核对日期：2026-09-24）：

- [Firebase 官方价格](https://firebase.google.com/pricing)：Phone Auth 短信按条计费。
- [Firebase 手机号验证计费与滥用说明](https://firebase.google.com/docs/auth/faq-and-troubleshooting)：短信服务需要关联 Cloud Billing，并可设置短信地区策略。
- [Twilio Verify 官方价格](https://www.twilio.com/verify/pricing)：验证费之外另计短信通道费；页面列出的短信示例价为美国价格，不能直接作为其他国家报价。
- [Twilio Verify 国际短信送达范围](https://www.twilio.com/docs/verify/verify-countries-and-regions-deliverability)：按目的国家确认支持范围与限制。

## 5. 本地账号和数据建议

第三方登录和手机号验证成功后，都要落到鸿源自己的本地账号，不直接把 Google、Telegram 或短信服务商的登录态当作业务账号。

建议用户表至少包含：

| 字段 | 说明 |
| --- | --- |
| `user_id` | 鸿源本地用户唯一 ID |
| `status` | 正常、冻结、注销等状态 |
| `created_at` | 创建时间 |
| `last_login_at` | 最后登录时间 |

建议账号绑定表至少包含：

| 字段 | 说明 |
| --- | --- |
| `user_id` | 关联鸿源用户 |
| `provider` | `google`、`telegram`、`phone` |
| `provider_subject` | Google `sub`、Telegram 用户 ID 或规范化手机号 |
| `display_name` | 第三方昵称或用户填写名称 |
| `avatar` | 可选头像地址 |
| `email` | 可选邮箱 |
| `phone_e164` | 规范化后的手机号 |
| `verified_at` | 验证完成时间 |

唯一约束建议为：

```text
(provider, provider_subject)
```

不同登录方式需要合并为同一账号时，应让用户明确确认，不建议仅凭邮箱或手机号自动合并。

## 6. 后端必须具备的接口和安全要求

### 6.1 接口范围

接口名称可由技术团队按现有架构命名，能力至少包括：

- 获取登录配置；
- Google 登录回调；
- Telegram 登录回调；
- 发送手机号验证码；
- 校验手机号验证码；
- 查询当前鸿源用户；
- 退出登录；
- 绑定或解绑第三方账号。

### 6.2 安全要求

- 第三方 `client_secret` 只能保存在后端，不能写入前端页面；
- OAuth/OIDC 流程使用 `state`、`nonce`，授权码流程使用 PKCE；
- 后端必须验证 Token 签名、发行方、受众和过期时间；
- 登录 Session 建议使用 `HttpOnly`、`Secure`、`SameSite` Cookie；
- 不要把第三方 Token 或验证码明文存入 `localStorage`；
- 验证码设置有效期、错误次数上限和发送频率限制；
- 对 IP、手机号和国家设置频控；
- 只开放实际服务国家，避免被短信刷量；
- 记录登录成功、失败、解绑和异常验证日志，但不记录验证码明文；
- 页面需要补充隐私政策、用户协议和短信验证说明。

## 7. 页面需要增加的状态

技术接入前，页面至少要有以下交互状态：

| 状态 | 页面表现 |
| --- | --- |
| 默认未登录 | 显示“登录/注册”入口 |
| 第三方授权中 | 按钮 loading，避免重复点击 |
| 短信发送中 | 显示倒计时，禁止重复发送 |
| 验证码错误 | 提示验证码错误，可重新输入 |
| 验证码过期 | 提示重新获取验证码 |
| 授权取消 | 返回登录弹层，提示用户未完成登录 |
| 登录成功 | 关闭登录弹层，更新用户状态并返回原页面 |
| 网络或服务异常 | 提示稍后重试，不丢失已填写手机号 |
| 账号已被停用 | 提示联系市场方，不允许继续登录 |

## 8. 建议的 MVP 范围

### 本期建议做

- 登录/注册入口；
- Google 登录；
- Telegram 登录；
- 国外手机号 SMS 验证码登录；
- 创建鸿源本地账号；
- 登录态保持和退出登录；
- 基础登录失败提示和验证码频控；
- 至少选择 2–3 个目标国家做真实短信送达测试。

### 本期暂不做

- WhatsApp 账号登录；
- 会员等级、积分、支付；
- 多账号自动合并；
- 企业客户组织和角色权限；
- 登录后营销自动触达；
- 复杂账号中心和安全中心。

## 9. 请技术团队确认的问题

- [ ] 鸿源是否已有后端服务、用户库和统一登录体系？
- [ ] 官网正式域名、HTTPS 和 OAuth 回调地址是什么？
- [ ] 首期需要支持哪些国家和地区？
- [ ] 手机号登录是“登录/注册合一”，还是仅允许已有用户登录？
- [ ] Google、Telegram 和手机号是否需要绑定到同一个鸿源账号？
- [ ] 现有买车咨询、卖车表单和后台线索是否需要关联 `user_id`？
- [ ] 短信服务商由技术团队选择，还是由市场方提供已有账号？
- [ ] 请按目标国家和预计月发送量测算 Firebase / Twilio 的短信成本及可能的固定费用。
- [ ] 用户数据存储区域、隐私政策和短信同意文案由谁确认？
- [ ] 是否需要邮箱作为账号找回或补充联系方式？

## 10. 技术评估结论填写区

由技术团队补充：

| 评估项 | 结论 |
| --- | --- |
| Google 登录 | 待评估 |
| Telegram 登录 | 待评估 |
| 国外手机号短信登录 | 待评估 |
| 推荐短信服务商 | 待评估 |
| 预计开发工作量 | 待评估 |
| 依赖的后端/数据库改造 | 待评估 |
| 目标国家送达测试 | 待评估 |
| 隐私与合规要求 | 待评估 |
| 是否可以进入开发排期 | 待评估 |
