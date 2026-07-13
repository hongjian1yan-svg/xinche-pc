---
name: generate-xinche-page
description: Generate Vue3 `<script setup>` + Element Plus pages/modules for 信车 PC 端管理后台（潜客中心/冻结车管理/金融初始化等模块）, following this project's established design system (PC端设计规范/ 下的全局视觉、页面整体布局、tab筛选、表格、按钮、表单、弹窗与抽屉、标签组件规范). Use when the user asks to create a new PC 后台列表页/详情抽屉/表单弹窗, mentions "生成列表页", "生成详情抽屉", "生成审核弹窗", "按现有页面模板新建", or provides a module name for xinche-pc related business page.
---

# Generate Xinche PC Page (Vue3 `<script setup>` + Element Plus)

## Goal
Generate stable, reusable modules for 信车 PC 端管理后台 in the project's existing style, across three page types:
- **list**：三区布局下的业务列表（Tab + 筛选表单 + 表格 + 分页）
- **detail**：右侧滑出的详情抽屉（不跳转路由，保留列表上下文）
- **form**：弹窗表单（确认/审核/日志类弹窗），或独立配置类表单（如金融初始化的渠道/市场配置）

## 技术栈约束（必须遵守，不要退化成 Vue2 Options API）
- Vue 3，一律使用 `<script setup>`，状态用 `ref`/`reactive`，派生值用 `computed`
- UI 组件库为 Element Plus，必须在根节点包一层 `<el-config-provider :locale="zhCn">` 保证中文提示
- 组件命名、目录结构参照现有模块（如 `冻结车_二期/src/components/FrozenVehicleList.vue`、`潜客中心/src/components/CustomerPotentialCenter.vue`）

## Command compatibility (must support all)
- `xinche-page：type=list module=xxx`
- `xinche-page：type=detail module=xxx`
- `xinche-page：type=form module=xxx`
- `按现有列表页模板新建一个 xxx 模块`
- `参照冻结车列表生成一个 xxx 列表页`
- `生成一个 xxx 的审核弹窗`

## Input schema
- `type`：`list` / `detail` / `form`（必填，无法从描述判断时必须询问用户，不要瞎猜）
- `module`：模块中文名（用于文案）+ 建议的英文组件名（PascalCase，如 `VehicleAuditList`）
- `tabs`：该列表页的 Tab 状态集合（如 已冻结/已解冻/待审核/审核通过/审核驳回）
- `filters`：筛选字段清单（Input/Select/DatePicker 分类）
- 其余字段按页面类型在各自章节的"必需字段"里定义

## 全局强制规则（三种类型都适用）

1. **色值/尺寸严格对齐 Element Plus 默认变量**，不要自造颜色：
   - 主色 `#409EFF`、成功 `#67C23A`、警告 `#E6A23C`、危险 `#F56C6C`
   - 文字：主要 `#303133`、常规 `#606266`、次要 `#909399`、占位 `#C0C4CC`
   - 页面背景 `#F2F4F5`，内容容器背景 `#F9FAFB`
2. **8px 栅格间距**：常用间距 4/8/12/16/24/32px，表单项垂直间距默认 22px
3. **主内容区最小宽度 1200px**，设计基准 1920×1080，向下兼容 1366×768
4. **所有弹窗/抽屉**：遮罩点击默认不关闭（防误触）；根节点必须有 `<el-config-provider :locale="zhCn">`
5. **el-message** 用于轻量反馈，居中显示，3 秒自动消失
6. **操作列按钮只允许三种样式**（禁止引入 success/warning/info）：
   - 蓝色填充 `type="primary" size="small"`：主操作（查看详情、审核通过）
   - 蓝色描边 `type="primary" size="small" plain`：次要操作（操作日志等）
   - 红色描边 `type="danger" size="small" plain`：明确否定/风险操作（驳回、解冻、删除）
7. **一个视觉区域内只允许一个填充型主按钮**（弹窗/表单同理）

## Guardrails（生成前必须检查）

1. **module 命名校验**：组件名需为合法 PascalCase，避免与现有组件重名（检查 `src/components/` 下已有文件）
2. **路径冲突检查**：`src/components/{Module}.vue` 已存在时，默认 **merge**（保留现有业务逻辑，只补齐/调整请求部分），不得未经确认整体覆盖
3. **Tab 联动规则必须显式实现**：若筛选条件会影响 Tab 可见性（如按"冻结来源"过滤会隐藏部分 Tab），必须：
   - 筛选值变化时**立即**（无需点查询）重新计算可见 Tab 列表
   - 若当前激活 Tab 被隐藏，自动回退到列表第一项，并重置分页到第 1 页
   - 点击"重置"后筛选清空、Tab 列表恢复完整
4. **不要省略分页组件**：单页数据可能超过 20 条的列表页，必须配置 `el-pagination`，`layout` 统一为 `"total, sizes, prev, pager, next, jumper"`，`page-sizes` 默认 `[10, 20, 50, 100]`，`background: true`

---

## Type = list（Tab + 筛选 + 表格列表）

参照基准：`冻结车_二期/src/components/FrozenVehicleList.vue`

### 必需结构（从上到下）
1. **Tab 筛选栏**：矩形色块 Tab，每个宽 90px 高 40px，非激活 `#f9fafb`、激活 `#F2F2F2`，文字统一 `#303133` 14px；与筛选区无间距、无分割线
2. **筛选条件区**：背景 `#F2F2F2`，多行表单布局，Label 宽度统一 80px 右对齐；操作按钮（查询/重置）单独占最后一行，左边距 92px（80px label + 12px 间距）；查询/重置按钮均为 `size="large"`（40px），分别绑定 `:icon="Search"` / `:icon="Refresh"`
3. **数据表格**：距筛选区 40px；表头背景 `#F5F7FA` 文字 `#909399` 14px 加粗居中；行高 54px；操作列 `fixed="right"`，按钮按 Tab 状态分组展示（见下方"操作列规则"）
4. **分页组件**：表格右下方，距表格顶部 20px

### 操作列按钮规则（必须按 Tab 状态区分，不能所有 Tab 显示同一套按钮）
生成前必须让用户明确各 Tab 对应哪些操作，缺省时参照冻结车列表的既有模式：
- 「待审核」类 Tab：查看详情（蓝色填充）/ 审核通过（蓝色描边）/ 审核驳回（红色描边）/ 操作日志（蓝色描边）
- 「已通过/已驳回」类 Tab：查看详情（蓝色填充）/ 操作日志（蓝色描边）
- 「进行中」类 Tab（如已冻结）：查看详情（蓝色填充）/ 风险操作如解冻（红色描边，按来源+角色权限判断是否展示）/ 操作日志（蓝色描边）

### 必需状态（`ref`/`computed`）
- `activeTab`、`currentPage`、`pageSize`、`filters`（reactive 对象）
- `visibleTabs`（computed，按筛选条件动态计算可见 Tab）
- 表格数据源 + `totalCount`

### 必需方法
- `handleSourceChange` 一类的筛选联动回调（重置分页 + 重新计算可见 Tab）
- `handleSizeChange` / `handleCurrentChange`（分页）
- 按 Tab 触发的操作方法（`showDetail`/`openAudit`/`openLog`/`openUnfreeze` 等，命名参照现有代码）

---

## Type = detail（详情抽屉 `el-drawer`）

参照基准：冻结车模块的详情抽屉实现

### 必需结构
- `direction="rtl"`，`size="50%"`（1920px 屏约 960px）
- 内容区从上至下、Section 间距 28px：
  1. 基本信息卡片（图片 180×135px + 名称 + 标签，容器 `background:#f8fafc; border-radius:8px; border:1px solid #eef0f3`）
  2. 关键信息（`el-descriptions`）
  3. 条件展示的图片/附件区（无内容时用虚线空态占位：`border:1px dashed #dcdfe6; color:#c0c4cc`）
  4. 按来源/类型条件渲染的专属子模块（`v-if`）
  5. 记录时间轴（`el-timeline`，按时间倒序，最新在最上方，最新节点 `type="primary"` 实心，历史节点 `type="info"` 空心）
- Section 标题统一样式：14px 加粗 `#303133`，左侧 4px 装饰竖条 `#48528e`

### 必需状态
- `xxxVisible`（抽屉开关）、`currentXxx`（当前查看的行数据）

### 必需方法
- `showDetail(row)`：赋值当前行数据并打开抽屉

---

## Type = form（弹窗表单 / 独立配置表单）

### 3.1 确认弹窗（不可逆操作前）
- `width="420px"`，`align-center`；警告图标 `WarningFilled` `#E6A23C` 40px + 提示文案 + 目标对象信息卡片（`background:#f8f9fb; border:1px solid #ebeef5; border-radius:6px; text-align:center`）
- 底部：取消（默认） + 确认（`type="primary"`）

### 3.2 审核弹窗（同一弹窗承载通过/驳回两种模式）
- `width="540px"`，`align-center`；标题按 `auditAction` 动态变化（`审核通过确认` / `审核驳回确认`）
- 内容：`el-descriptions` 展示申请信息 + 意见/原因输入框（可选）
- 底部按钮：取消 + 确认（通过 `type="success"`，驳回 `type="danger"`），必须用一个 `ref` 状态区分模式，不要复制两份弹窗

### 3.3 操作日志弹窗（只读）
- `width="540px"`，`align-center`；内容为 `el-timeline`，仅「关闭」按钮

### 3.4 独立配置表单（如金融初始化的渠道/市场配置类页面）
- Label 右对齐，宽度 80-120px；必填星号 `*` 左侧、颜色 `#F56C6C`、间距 4px
- 表单项垂直间距 22px（含校验提示空间）
- 输入框：Default 尺寸 32px/14px 为主，Hover 边框 `#C0C4CC`，Focus 边框 `#409EFF`
- 下拉选项超过 10 条必须开启 `filterable`
- 提交按钮位于表单末尾或页面底部，主按钮居左

### 必需状态
- 表单对象（`reactive`）+ 表单 ref（用于 `validate()`）
- 弹窗可见性开关

### 必需方法
- `open(row, mode)` 一类的打开方法，负责重置表单并注入初始值
- 提交方法：先 `formRef.value.validate()`，通过后才调用业务接口 / emit 事件

---

## Response format（生成后必须输出）
1. 本次创建/修改的文件列表（含所在的模块目录，如 `冻结车_二期/src/components/xxx.vue`）
2. 采用的配置（`type` / `module` / 参照的基准组件）
3. 未解决的 TODO（业务字段缺失、权限判断规则不明确、需用户确认的按钮文案等）
4. 若涉及 Tab 联动或操作列按状态分组，明确列出本次生成的具体映射规则，方便用户核对
