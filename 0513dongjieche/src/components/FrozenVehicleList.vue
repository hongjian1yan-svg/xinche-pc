<template>
  <el-config-provider :locale="zhCn">
    <el-container class="layout-container">

      <!-- 侧边栏 -->
      <el-aside width="180px" class="sidebar">
        <div class="logo">
          <img src="../logo.png" alt="logo" class="sidebar-logo" />
          <span class="logo-text">智慧车市</span>
        </div>
        <el-menu
          :default-active="currentMenu === 'vehicleList' ? '1-0' : currentMenu === 'settings' ? '1-2' : '1-1'"
          background-color="#ffffff"
          text-color="#66798c"
          active-text-color="#ffffff"
          class="side-menu"
          :default-openeds="['1']"
        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon><Management /></el-icon>
              <span>车辆管理</span>
            </template>
            <el-menu-item index="1-0" @click="currentMenu = 'vehicleList'">车辆列表</el-menu-item>
            <el-menu-item index="1-1" @click="currentMenu = 'list'">冻结车列表</el-menu-item>
            <el-menu-item index="1-2" @click="currentMenu = 'settings'">冻结车设置</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="2">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon><List /></el-icon>
            <span>订单管理</span>
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container direction="vertical">

        <!-- 顶部状态栏 -->
        <el-header height="60px" class="top-header">
          <div class="market-info">【新车智慧二手车交易市场】</div>
          <div class="header-right">
            <div class="role-switcher">
              <span class="role-label">演示角色：</span>
              <el-select v-model="currentRole" size="small" style="width: 150px">
                <el-option v-for="r in ROLE_OPTIONS" :key="r" :label="r" :value="r" />
              </el-select>
            </div>
            <div class="user-profile">
              <img
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                class="avatar"
                alt="avatar"
              />
              <span class="username">刘建国</span>
              <div class="role-tag">{{ currentRole }}</div>
              <div class="arrow-container">
                <el-icon :size="12"><ArrowDown /></el-icon>
              </div>
            </div>
          </div>
        </el-header>

        <el-main class="main-content">
          <VehicleList
            v-if="currentMenu === 'vehicleList'"
            :current-role="currentRole"
            :current-user-market="currentUserMarket"
          />
          <div v-if="currentMenu === 'list'" class="content-body">

            <!-- Tab 筛选 -->
            <div class="tab-filter-container">
              <div
                v-for="tab in visibleTabs"
                :key="tab.name"
                class="tab-item"
                :class="{ 'is-active': activeTab === tab.name }"
                @click="handleTabClick(tab.name)"
              >
                {{ tab.label }}
              </div>
            </div>

            <!-- 筛选区域 -->
            <div class="search-filter-container">
              <el-form :model="filters" inline class="search-form">
                <el-form-item label="所属市场">
                  <el-select
                    v-model="filters.market"
                    placeholder="请选择市场"
                    clearable
                    size="large"
                    filterable
                    :disabled="currentRole !== '超级管理员'"
                  >
                    <el-option label="上海信车二手车市场" value="上海信车二手车市场" />
                    <el-option label="北京顺义二手车市场" value="北京顺义二手车市场" />
                    <el-option label="郑州智慧车市" value="郑州智慧车市" />
                    <el-option label="广州南方二手车城" value="广州南方二手车城" />
                  </el-select>
                </el-form-item>
                <el-form-item label="商户名称">
                  <el-select v-model="filters.merchant" placeholder="请选择商户" clearable size="large" filterable>
                    <el-option label="上海信车精品车商" value="上海信车精品车商" />
                    <el-option label="北京顺通二手车" value="北京顺通二手车" />
                    <el-option label="深圳易车行" value="深圳易车行" />
                    <el-option label="成都华信汽贸" value="成都华信汽贸" />
                  </el-select>
                </el-form-item>
                <el-form-item label="车架号">
                  <el-input v-model="filters.vin" placeholder="请输入车架号" clearable size="large" />
                </el-form-item>
                <el-form-item label="车牌号">
                  <el-input v-model="filters.plate" placeholder="请输入车牌号" clearable size="large" />
                </el-form-item>
                <el-form-item label="RFID">
                  <el-input v-model="filters.rfid" placeholder="请输入RFID" clearable size="large" />
                </el-form-item>
                <el-form-item label="冻结时间">
                  <el-date-picker
                    v-model="filters.dateRange"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    size="large"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    style="width: 380px"
                  />
                </el-form-item>
                <el-form-item label="冻结来源">
                  <el-select
                    v-model="filters.source"
                    placeholder="全部"
                    clearable
                    size="large"
                    @change="handleSourceChange"
                  >
                    <el-option label="手动冻结" value="manual" />
                    <el-option label="金融质押冻结" value="finance_pledge" />
                    <el-option label="合同到期冻结" value="contract" />
                    <el-option label="金融管控冻结" value="finance_ctrl" />
                  </el-select>
                </el-form-item>
                <el-form-item class="search-actions">
                  <el-button type="primary" size="large" :icon="Search" @click="handleSearch">查询</el-button>
                  <el-button size="large" :icon="Refresh" @click="resetFilters">重置</el-button>
                  <el-button size="large" :icon="Download" @click="handleExport">导出</el-button>
                </el-form-item>
              </el-form>
            </div>

            <!-- 表格区域 -->
            <div class="view-container">
              <el-table
                :key="activeTab"
                :data="paginatedTableData"
                style="width: 100%"
                border
                class="business-table"
                :header-cell-style="{ background: '#F5F7FA', color: '#909399', fontWeight: 'bold', textAlign: 'center' }"
              >
                <el-table-column label="市场名称" min-width="150" align="center">
                  <template #default="scope">
                    {{ scope.row.market || '-' }}
                  </template>
                </el-table-column>

                <el-table-column label="车辆图片" width="120" align="center">
                  <template #default="scope">
                    <el-image
                      :src="scope.row.image"
                      class="vehicle-img"
                      fit="cover"
                      :preview-src-list="[scope.row.image]"
                      preview-teleported
                    />
                  </template>
                </el-table-column>

                <el-table-column label="车辆信息" min-width="200">
                  <template #default="scope">
                    <div class="vehicle-info-content">
                      <div class="brand-name">{{ scope.row.name }}</div>
                      <div class="info-sub">VIN: {{ scope.row.vin }}</div>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="车商信息" min-width="160">
                  <template #default="scope">
                    <div class="vehicle-info-content">
                      <div class="brand-name">{{ scope.row.merchant }}</div>
                      <div class="info-sub">{{ scope.row.merchantContact }}</div>
                      <div class="info-sub">{{ scope.row.merchantPhone }}</div>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column label="RFID" width="110" align="center">
                  <template #default="scope">
                    <span v-if="scope.row.rfid" class="rfid-tag">{{ scope.row.rfid }}</span>
                    <span v-else>-</span>
                  </template>
                </el-table-column>

                <el-table-column label="车牌号" width="110" align="center">
                  <template #default="scope">
                    {{ scope.row.plate || '-' }}
                  </template>
                </el-table-column>

                <!-- 冻结来源 (二期新增) -->
                <el-table-column label="冻结来源" width="130" align="center">
                  <template #default="scope">
                    <span class="source-tag">{{ SOURCE_MAP[scope.row.source] }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="冻结时间" width="170" align="center" prop="freezeTime" />

                <!-- 已解冻 Tab 特有字段 -->
                <el-table-column v-if="activeTab === 'released'" label="申请解冻原因" width="140" align="center">
                  <template #default="scope">
                    {{ scope.row.source === 'manual' ? (scope.row.unfreezeReason || '-') : '-' }}
                  </template>
                </el-table-column>
                <el-table-column v-if="activeTab === 'released'" label="申请解冻时间" width="170" align="center">
                  <template #default="scope">
                    {{ scope.row.source === 'manual' ? (scope.row.unfreezeApplyTime || '-') : '-' }}
                  </template>
                </el-table-column>
                <el-table-column v-if="activeTab === 'released'" label="解冻时间" width="170" align="center" prop="unfreezeTime" />
                <el-table-column v-if="activeTab === 'released'" label="解冻有效期" width="110" align="center">
                  <template #default="scope">
                    {{ scope.row.source === 'manual' ? (scope.row.unfreezeValidPeriod || '无限制') : '-' }}
                  </template>
                </el-table-column>

                <!-- 操作列 -->
                <el-table-column label="操作" width="100" fixed="right" align="center">
                  <template #default="scope">
                    <div class="operation-btns">

                      <!-- 待审核：查看详情 / 审核通过 / 审核驳回 / 操作日志 -->
                      <template v-if="activeTab === 'pending'">
                        <el-button type="primary" size="small" @click="showDetail(scope.row)">查看详情</el-button>
                        <el-button type="primary" size="small" @click="openAudit(scope.row, 'approved')">审核通过</el-button>
                        <el-button type="danger" size="small" plain @click="openAudit(scope.row, 'rejected')">审核驳回</el-button>
                        <el-button type="primary" size="small" plain @click="openLog(scope.row)">操作日志</el-button>
                      </template>

                      <!-- 审核通过 / 审核驳回：查看详情 / 操作日志 -->
                      <template v-else-if="activeTab === 'approved' || activeTab === 'rejected'">
                        <el-button type="primary" size="small" @click="showDetail(scope.row)">查看详情</el-button>
                        <el-button type="primary" size="small" plain @click="openLog(scope.row)">操作日志</el-button>
                      </template>

                      <!-- 已冻结：查看详情 / 车辆解冻（权限判断）/ 操作日志 -->
                      <template v-else-if="activeTab === 'frozen'">
                        <el-button type="primary" size="small" @click="showDetail(scope.row)">查看详情</el-button>
                        <el-button v-if="canUnfreeze(scope.row)" type="primary" size="small" plain @click="openUnfreeze(scope.row)">车辆解冻</el-button>
                        <el-button type="primary" size="small" plain @click="openLog(scope.row)">操作日志</el-button>
                      </template>

                      <!-- 已解冻：查看详情 / 操作日志 -->
                      <template v-else-if="activeTab === 'released'">
                        <el-button type="primary" size="small" @click="showDetail(scope.row)">查看详情</el-button>
                        <el-button type="primary" size="small" plain @click="openLog(scope.row)">操作日志</el-button>
                      </template>

                    </div>
                  </template>
                </el-table-column>
              </el-table>

              <div class="pagination-container">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[10, 20, 50, 100]"
                  :background="true"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </div>
          </div>

          <!-- ===== 冻结车设置页 ===== -->
          <div v-if="currentMenu === 'settings'" class="content-body">
            <div class="settings-toolbar">
              <el-tabs v-model="settingsActiveTab">
                <el-tab-pane label="解冻原因" name="reasonSettings" />
              </el-tabs>
            </div>
            <div class="search-filter-container settings-filter-container" style="margin-top: 0;">
              <el-button type="primary" :icon="Plus" @click="handleAddReason" class="settings-add-btn">添加解冻原因</el-button>
              <el-form inline class="search-form">
                <el-form-item label="市场名称">
                  <el-input placeholder="请输入市场名称" clearable size="large" />
                </el-form-item>
                <el-form-item label="创建时间">
                  <el-date-picker
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    size="large"
                    style="width: 340px"
                  />
                </el-form-item>
                <el-form-item class="search-actions settings-search-actions">
                  <el-button type="primary" size="large" :icon="Search">查询</el-button>
                  <el-button size="large" :icon="Refresh">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="view-container">
              <el-table
                :data="settingsData"
                border
                class="business-table"
                style="width: 100%"
                :header-cell-style="{ background: '#F5F7FA', color: '#909399', fontWeight: 'bold', textAlign: 'center' }"
              >
                <el-table-column prop="market" label="市场名称" align="center" min-width="160" />
                <el-table-column prop="reason" label="解冻原因" align="center" min-width="140" />
                <el-table-column label="解冻有效期" align="center" width="140">
                  <template #default="scope">
                    {{ formatConfigDuration(scope.row.validity) }}
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" width="200" />
                <el-table-column label="操作" width="150" align="center" fixed="right">
                  <template #default="scope">
                    <el-button type="primary" link @click="handleEditReason(scope.row, scope.$index)">编辑</el-button>
                    <el-button type="danger" link>删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <!-- ===== 车辆冻结详情抽屉 ===== -->
          <el-drawer
            v-model="detailVisible"
            title="车辆冻结详情"
            size="50%"
            direction="rtl"
          >
            <div v-if="currentDetail" class="detail-container">

              <!-- 1. 车辆基本信息 -->
              <div class="detail-header-card">
                <el-image :src="currentDetail.image" class="detail-main-img" fit="cover" />
                <div class="detail-header-info">
                  <div class="detail-car-name">{{ currentDetail.name }}</div>
                  <div style="margin-top: 10px">
                    <span class="source-tag">{{ SOURCE_MAP[currentDetail.source] }}</span>
                  </div>
                  <div style="margin-top: 10px">
                    <span class="plate-tag">{{ currentDetail.plate }}</span>
                  </div>
                </div>
              </div>

              <!-- 2. 冻结信息 -->
              <div class="detail-section">
                <div class="section-title">冻结信息</div>
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="市场名称">{{ currentDetail.market }}</el-descriptions-item>
                  <el-descriptions-item label="车架号">{{ currentDetail.vin }}</el-descriptions-item>
                  <el-descriptions-item v-if="currentDetail.source === 'finance_pledge'" label="质押状态">
                    <el-tag type="danger" size="small" effect="dark">已质押</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="商户名称">{{ currentDetail.merchant || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="商户负责人">{{ currentDetail.merchantContact || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="联系电话">{{ currentDetail.merchantPhone || '-' }}</el-descriptions-item>
                  <el-descriptions-item label="冻结时间">{{ currentDetail.freezeTime }}</el-descriptions-item>
                  <el-descriptions-item v-if="currentDetail.source === 'manual' && currentDetail.unfreezeApplyTime" label="申请解冻原因">{{ currentDetail.unfreezeReason || '-' }}</el-descriptions-item>
                  <el-descriptions-item v-if="currentDetail.source === 'manual' && currentDetail.unfreezeApplyTime" label="申请解冻时间">{{ currentDetail.unfreezeApplyTime || '-' }}</el-descriptions-item>
                  <el-descriptions-item v-if="currentDetail.unfreezeTime" label="解冻时间">{{ currentDetail.unfreezeTime }}</el-descriptions-item>
                  <el-descriptions-item v-if="currentDetail.source === 'manual' && currentDetail.unfreezeApplyTime && activeTab === 'released'" label="解冻有效期">{{ currentDetail.unfreezeValidPeriod || '无限制' }}</el-descriptions-item>
                </el-descriptions>
              </div>

              <!-- 3. 申请解冻照片（手动冻结且已提交解冻申请时展示） -->
              <div v-if="currentDetail.source === 'manual' && currentDetail.unfreezeApplyTime" class="detail-section">
                <div class="section-title">申请解冻照片</div>
                <div v-if="currentDetail.photos && currentDetail.photos.length > 0" class="photo-grid">
                  <el-image
                    v-for="(p, i) in currentDetail.photos"
                    :key="i"
                    :src="p"
                    class="photo-thumb"
                    fit="cover"
                    :preview-src-list="currentDetail.photos"
                    preview-teleported
                  />
                </div>
                <div v-else class="photo-empty">暂无照片</div>
              </div>

              <!-- 4a. 金融质押冻结 - 质押订单信息 -->
              <div v-if="currentDetail.source === 'finance_pledge' && currentDetail.pledgeOrderInfo" class="detail-section">
                <div class="section-title">质押订单信息</div>
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="订单编号">{{ currentDetail.pledgeOrderInfo.orderNo }}</el-descriptions-item>
                  <el-descriptions-item label="库容公司">{{ currentDetail.pledgeOrderInfo.fundCompany }}</el-descriptions-item>
                  <el-descriptions-item label="申请时间">{{ currentDetail.pledgeOrderInfo.applyTime }}</el-descriptions-item>
                  <el-descriptions-item label="用款总额">{{ currentDetail.pledgeOrderInfo.totalAmount }}</el-descriptions-item>
                  <el-descriptions-item label="状态">{{ currentDetail.pledgeOrderInfo.status }}</el-descriptions-item>
                  <el-descriptions-item label="银行状态">{{ currentDetail.pledgeOrderInfo.bankStatus }}</el-descriptions-item>
                </el-descriptions>
              </div>

              <!-- 4b. 合同到期冻结 - 合同信息 -->
              <div v-if="currentDetail.source === 'contract' && currentDetail.contractInfo" class="detail-section">
                <div class="section-title">合同信息</div>
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="合同编号">{{ currentDetail.contractInfo.contractNo }}</el-descriptions-item>
                  <el-descriptions-item label="租赁类型">{{ currentDetail.contractInfo.leaseType }}</el-descriptions-item>
                  <el-descriptions-item label="经营主体">{{ currentDetail.contractInfo.businessEntity }}</el-descriptions-item>
                  <el-descriptions-item label="区域名称">{{ currentDetail.contractInfo.areaName }}</el-descriptions-item>
                  <el-descriptions-item label="铺位名称">{{ currentDetail.contractInfo.stallName }}</el-descriptions-item>
                  <el-descriptions-item label="合同起止时间" :span="2">{{ currentDetail.contractInfo.contractPeriod }}</el-descriptions-item>
                </el-descriptions>
              </div>

              <!-- 4c. 金融管控冻结 - 金融管控信息 -->
              <div v-if="currentDetail.source === 'finance_ctrl' && currentDetail.financeCtrlInfo" class="detail-section">
                <div class="section-title">金融管控信息</div>
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="金融公司">{{ currentDetail.financeCtrlInfo.financeCompany }}</el-descriptions-item>
                  <el-descriptions-item label="创建时间">{{ currentDetail.financeCtrlInfo.createTime }}</el-descriptions-item>
                  <el-descriptions-item label="操作人">{{ currentDetail.financeCtrlInfo.operator }}</el-descriptions-item>
                  <el-descriptions-item label="管控方式">{{ currentDetail.financeCtrlInfo.controlMethod }}</el-descriptions-item>
                  <el-descriptions-item label="管控状态">{{ currentDetail.financeCtrlInfo.controlStatus }}</el-descriptions-item>
                  <el-descriptions-item label="备注" :span="2">{{ currentDetail.financeCtrlInfo.remark }}</el-descriptions-item>
                </el-descriptions>
              </div>

              <!-- 5. 冻结记录（时间轴，所有来源） -->
              <div class="detail-section">
                <div class="section-title">冻结记录</div>
                <el-timeline>
                  <el-timeline-item
                    v-for="(record, index) in currentDetail.freezeHistory"
                    :key="index"
                    :timestamp="record.time"
                    placement="top"
                    :type="index === 0 ? 'primary' : ''"
                    :hollow="index !== 0"
                  >
                    <span class="timeline-action">{{ record.action }}</span>
                    <span v-if="record.operator" class="timeline-operator"> · {{ record.operator }}</span>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </div>
          </el-drawer>

          <!-- ===== 操作日志对话框 ===== -->
          <el-dialog v-model="logVisible" title="操作日志" width="600px" align-center>
            <el-table
              v-if="currentLogRow"
              :data="currentLogRow.freezeHistory"
              border
              :header-cell-style="{ background: '#F5F7FA', color: '#909399', fontWeight: 'bold', textAlign: 'center' }"
            >
              <el-table-column label="操作人" prop="operator" width="120" align="center" />
              <el-table-column label="操作内容" prop="action" min-width="180" />
              <el-table-column label="操作时间" prop="time" width="180" align="center" />
            </el-table>
            <template #footer>
              <el-button @click="logVisible = false">关闭</el-button>
            </template>
          </el-dialog>

          <!-- ===== 解冻确认对话框 ===== -->
          <el-dialog
            v-model="unfreezeVisible"
            title="车辆解冻"
            :width="currentUnfreezeRow?.source === 'manual' ? '520px' : '420px'"
            align-center
          >
            <div v-if="currentUnfreezeRow">

              <!-- 手动冻结：表单填写 -->
              <template v-if="currentUnfreezeRow.source === 'manual'">
                <el-form :model="unfreezeForm" ref="unfreezeFormRef" label-width="90px" :rules="unfreezeRules">
                  <el-form-item label="解冻原因" prop="reason">
                    <el-select v-model="unfreezeForm.reason" placeholder="请选择解冻原因" style="width: 100%">
                      <el-option v-for="item in currentMarketReasons" :key="item.reason" :label="item.reason" :value="item.reason" />
                    </el-select>
                    <div v-if="!currentMarketReasons.length" class="unfreeze-validity">
                      <span class="validity-label" style="color:#F56C6C">该市场暂无配置解冻原因，请先前往冻结车设置添加</span>
                    </div>
                    <div v-else-if="unfreezeForm.reason" class="unfreeze-validity">
                      <span class="validity-label">解冻有效期：</span>
                      <span class="validity-value">{{ formatConfigDuration(currentMarketReasons.find(r => r.reason === unfreezeForm.reason)?.validity ?? 0) }}</span>
                    </div>
                  </el-form-item>
                  <el-form-item label="解冻描述">
                    <el-input
                      v-model="unfreezeForm.description"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入解冻描述（可选）"
                    />
                  </el-form-item>
                  <el-form-item label="上传图片">
                    <el-upload
                      v-model:file-list="unfreezeForm.fileList"
                      action="#"
                      list-type="picture-card"
                      :auto-upload="false"
                      :limit="6"
                    >
                      <el-icon><Plus /></el-icon>
                    </el-upload>
                  </el-form-item>
                </el-form>
              </template>

              <!-- 合同到期/金融管控：简单确认，不展示车辆信息 -->
              <template v-else>
                <div class="confirm-dialog">
                  <el-icon class="confirm-icon" color="#E6A23C" :size="40"><WarningFilled /></el-icon>
                  <p class="confirm-tip">确定要解冻该车辆吗？</p>
                </div>
              </template>

            </div>
            <template #footer>
              <el-button @click="unfreezeVisible = false">取消</el-button>
              <el-button type="primary" @click="confirmUnfreeze">提交</el-button>
            </template>
          </el-dialog>

          <!-- ===== 审核解冻申请对话框 ===== -->
          <el-dialog
            v-model="auditVisible"
            :title="auditAction === 'approved' ? '审核通过确认' : '审核驳回确认'"
            :width="auditAction === 'approved' ? '420px' : '480px'"
            align-center
          >
            <div v-if="currentAuditRow">

              <!-- 审核通过：仅一句确认文案 -->
              <template v-if="auditAction === 'approved'">
                <div class="confirm-dialog">
                  <p class="confirm-tip">确定审核通过并解冻该车辆吗？</p>
                </div>
              </template>

              <!-- 审核驳回：驳回原因（必填） -->
              <template v-else>
                <el-form :model="auditForm" ref="auditFormRef" label-width="80px" :rules="auditRules">
                  <el-form-item label="驳回原因" prop="remark">
                    <el-input
                      v-model="auditForm.remark"
                      type="textarea"
                      :rows="4"
                      placeholder="请输入驳回原因"
                    />
                  </el-form-item>
                </el-form>
              </template>

            </div>
            <template #footer>
              <el-button @click="auditVisible = false">取消</el-button>
              <el-button
                :type="auditAction === 'approved' ? 'primary' : 'danger'"
                @click="handleAudit"
              >{{ auditAction === 'approved' ? '确认通过' : '确认驳回' }}</el-button>
            </template>
          </el-dialog>

          <!-- ===== 添加/编辑解冻原因对话框 ===== -->
          <el-dialog
            v-model="addReasonDialogVisible"
            :title="isEdit ? '编辑解冻原因' : '添加解冻原因'"
            width="550px"
            align-center
          >
            <el-form :model="addReasonForm" label-width="100px">
              <el-form-item label="市场名称" required>
                <el-select
                  v-model="addReasonForm.market"
                  placeholder="请选择市场"
                  style="width: 100%"
                  :disabled="isEdit"
                >
                  <el-option v-for="item in marketOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <el-form-item label="解冻原因" required>
                <el-input v-model="addReasonForm.reason" placeholder="请输入解冻原因" :disabled="isEdit" />
              </el-form-item>
              <el-form-item label="解冻有效期">
                <el-radio-group v-model="addReasonForm.validityType">
                  <el-radio value="关闭">关闭（无限制）</el-radio>
                  <el-radio value="开启">开启</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="addReasonForm.validityType === '开启'" label="时长设置">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <el-input-number v-model="addReasonForm.days" :min="0" :max="365" style="width: 130px" />
                  <span>天</span>
                  <el-input-number v-model="addReasonForm.hours" :min="0" :max="23" style="width: 130px" />
                  <span>小时</span>
                </div>
              </el-form-item>
            </el-form>
            <template #footer>
              <el-button @click="cancelAddReason">取消</el-button>
              <el-button type="primary" @click="submitAddReason">确定</el-button>
            </template>
          </el-dialog>

        </el-main>
      </el-container>
    </el-container>
  </el-config-provider>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import VehicleList from './VehicleList.vue'
import {
  Management, User, List, Setting, ArrowDown, Search, Refresh, WarningFilled, SuccessFilled, Download, Plus
} from '@element-plus/icons-vue'

// ==================== 角色 ====================
const ROLE_OPTIONS = ['超级管理员', '市场管理员', '金融管控管理员']
const currentRole = ref('超级管理员')

// 演示用：各角色绑定的所属市场
const ROLE_MARKET_MAP = {
  '超级管理员': null,
  '市场管理员': '上海信车二手车市场',
  '金融管控管理员': '上海信车二手车市场',
}
const currentUserMarket = computed(() => ROLE_MARKET_MAP[currentRole.value] ?? null)

// ==================== 解冻原因（从冻结车设置动态获取，按车辆所属市场过滤） ====================
const currentMarketReasons = computed(() => {
  if (!currentUnfreezeRow.value) return []
  return settingsData.value.filter(s => s.market === currentUnfreezeRow.value.market)
})

// ==================== 冻结来源映射 ====================
const SOURCE_MAP = {
  manual: '手动冻结',
  finance_pledge: '金融质押冻结',
  contract: '合同到期冻结',
  finance_ctrl: '金融管控冻结'
}

// ==================== Tab 配置 ====================
const ALL_TABS = [
  { label: '已冻结', name: 'frozen' },
  { label: '已解冻', name: 'released' },
  { label: '待审核', name: 'pending' },
  { label: '审核通过', name: 'approved' },
  { label: '审核驳回', name: 'rejected' }
]

const activeTab = ref('frozen')
const currentPage = ref(1)
const pageSize = ref(10)

// ==================== 筛选条件 ====================
const filters = ref({
  market: '',
  merchant: '',
  vin: '',
  plate: '',
  rfid: '',
  dateRange: [],
  source: ''
})

// ==================== Tab 联动逻辑 ====================
// 手动冻结/全部：5个Tab；其余来源：仅「已冻结」「已解冻」
const visibleTabs = computed(() => {
  const src = filters.value.source
  if (!src || src === 'manual') return ALL_TABS
  return ALL_TABS.slice(0, 2)
})

// 切换冻结来源时：若当前 Tab 被隐藏，自动回退到「已冻结」
const handleSourceChange = () => {
  currentPage.value = 1
  const names = visibleTabs.value.map(t => t.name)
  if (!names.includes(activeTab.value)) {
    activeTab.value = 'frozen'
  }
}

const handleTabClick = (name) => {
  activeTab.value = name
  currentPage.value = 1
}

// ==================== 操作权限判断 ====================
const canUnfreeze = (row) => {
  if (activeTab.value === 'released') return false
  const { source } = row
  const role = currentRole.value
  if (source === 'finance_pledge') return false
  if (source === 'manual' || source === 'contract') {
    return ['超级管理员', '市场管理员'].includes(role)
  }
  if (source === 'finance_ctrl') {
    return ['超级管理员', '金融管控管理员'].includes(role)
  }
  return false
}

// ==================== 详情抽屉 ====================
const detailVisible = ref(false)
const currentDetail = ref(null)
const showDetail = (row) => {
  currentDetail.value = row
  detailVisible.value = true
}

// ==================== 操作日志 ====================
const logVisible = ref(false)
const currentLogRow = ref(null)
const openLog = (row) => {
  currentLogRow.value = row
  logVisible.value = true
}

// ==================== 解冻确认 ====================
const unfreezeVisible = ref(false)
const currentUnfreezeRow = ref(null)
const unfreezeFormRef = ref(null)
const unfreezeForm = ref({ reason: '', description: '', fileList: [] })
const unfreezeRules = {
  reason: [{ required: true, message: '请选择解冻原因', trigger: 'change' }]
}
const openUnfreeze = (row) => {
  currentUnfreezeRow.value = row
  unfreezeForm.value = { reason: '', description: '', fileList: [] }
  unfreezeVisible.value = true
}
const confirmUnfreeze = async () => {
  if (currentUnfreezeRow.value.source === 'manual') {
    const valid = await unfreezeFormRef.value?.validate().catch(() => false)
    if (!valid) return
  }
  ElMessage.success(`车辆「${currentUnfreezeRow.value.plate}」解冻操作已提交`)
  unfreezeVisible.value = false
}

// ==================== 审核 ====================
const auditVisible = ref(false)
const auditAction = ref('approved') // 'approved' | 'rejected'
const currentAuditRow = ref(null)
const auditFormRef = ref(null)
const auditForm = ref({ remark: '' })
const auditRules = {
  remark: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }]
}
const openAudit = (row, action) => {
  currentAuditRow.value = row
  auditAction.value = action
  auditForm.value = { remark: '' }
  auditVisible.value = true
}
const handleAudit = async () => {
  if (auditAction.value === 'rejected') {
    const valid = await auditFormRef.value?.validate().catch(() => false)
    if (!valid) return
  }
  const label = auditAction.value === 'approved' ? '审核通过' : '已驳回'
  ElMessage.success(`${label}：${currentAuditRow.value.plate}`)
  auditVisible.value = false
}

// ==================== Mock 数据 ====================
const tableData = ref([
  // 手动冻结 - 已冻结
  {
    id: 1, name: '大众途观L 2023款 330TSI 豪华版', plate: '沪A·88888',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=200&h=150&fit=crop',
    merchant: '上海信车精品车商', merchantContact: '王经理', merchantPhone: '138****8888',
    market: '上海信车二手车市场', vin: 'LSVCC2B46MN123456', rfid: '123456',
    source: 'manual', status: 'frozen',
    freezeTime: '2026-05-10 09:30:00',
    photos: [],
    freezeHistory: [
      { time: '2026-05-10 09:30:00', action: '手动冻结', operator: '张管理员' }
    ]
  },
  // 手动冻结 - 待审核
  {
    id: 2, name: '本田CR-V 2022款 240TURBO 四驱豪华版', plate: '京B·66666',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=200&h=150&fit=crop',
    merchant: '北京顺通二手车', merchantContact: '李经理', merchantPhone: '139****9999',
    market: '北京顺义二手车市场', vin: 'LHGCR2F59MA000001', rfid: '234567',
    source: 'manual', status: 'pending',
    freezeTime: '2026-05-08 14:20:00',
    unfreezeReason: '临时提车出售',
    unfreezeApplyTime: '2026-05-12 10:30:00',
    photos: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200&h=150&fit=crop'],
    freezeHistory: [
      { time: '2026-05-12 10:30:00', action: '申请解冻 · 临时提车出售', operator: '车商李某' },
      { time: '2026-05-08 14:20:00', action: '手动冻结', operator: '赵管理员' }
    ]
  },
  // 手动冻结 - 审核通过
  {
    id: 3, name: '丰田凯美瑞 2022款 2.0S 豪华版', plate: '粤A·12345',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=150&fit=crop',
    merchant: '深圳易车行', merchantContact: '陈经理', merchantPhone: '186****5555',
    market: '广州南方二手车城', vin: 'JTDBE30K253049671', rfid: '345678',
    source: 'manual', status: 'approved',
    freezeTime: '2026-04-25 10:00:00',
    unfreezeReason: '已结清欠款',
    unfreezeApplyTime: '2026-05-11 09:00:00',
    unfreezeTime: '2026-05-11 14:30:00',
    photos: [],
    freezeHistory: [
      { time: '2026-05-11 14:30:00', action: '审核通过 · 解冻', operator: '王管理员' },
      { time: '2026-05-11 09:00:00', action: '申请解冻 · 已结清欠款', operator: '车商陈某' },
      { time: '2026-04-25 10:00:00', action: '手动冻结', operator: '王管理员' }
    ]
  },
  // 手动冻结 - 审核驳回
  {
    id: 4, name: '宝马3系 2023款 325Li M运动套装', plate: '川A·55555',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=200&h=150&fit=crop',
    merchant: '成都华信汽贸', merchantContact: '刘经理', merchantPhone: '176****4444',
    market: '郑州智慧车市', vin: 'WBA5X9C56JG123456', rfid: '456789',
    source: 'manual', status: 'rejected',
    freezeTime: '2026-05-01 11:00:00',
    unfreezeReason: '急需资金周转',
    unfreezeApplyTime: '2026-05-10 15:00:00',
    photos: [],
    freezeHistory: [
      { time: '2026-05-10 17:00:00', action: '审核驳回 · 理由不充分', operator: '孙管理员' },
      { time: '2026-05-10 15:00:00', action: '申请解冻 · 急需资金周转', operator: '车商刘某' },
      { time: '2026-05-01 11:00:00', action: '手动冻结', operator: '孙管理员' }
    ]
  },
  // 手动冻结 - 已解冻（有解冻有效期）
  {
    id: 5, name: '奔驰C级 2022款 C 200 L 运动版', plate: '浙A·99999',
    image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=200&h=150&fit=crop',
    merchant: '上海信车精品车商', merchantContact: '王经理', merchantPhone: '138****8888',
    market: '上海信车二手车市场', vin: 'WDD2050041A123456', rfid: '567890',
    source: 'manual', status: 'released',
    freezeTime: '2026-04-01 09:00:00',
    unfreezeReason: '合规整改完成',
    unfreezeApplyTime: '2026-05-05 09:30:00',
    unfreezeTime: '2026-05-05 14:00:00',
    unfreezeValidPeriod: '7天',
    photos: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=200&h=150&fit=crop'],
    freezeHistory: [
      { time: '2026-05-05 14:00:00', action: '审核通过 · 解冻（有效期7天）', operator: '张管理员' },
      { time: '2026-05-05 09:30:00', action: '申请解冻 · 合规整改完成', operator: '车商王某' },
      { time: '2026-04-01 09:00:00', action: '手动冻结', operator: '张管理员' }
    ]
  },
  // 金融质押冻结 - 已冻结
  {
    id: 6, name: '特斯拉 Model 3 2024款 长续航后驱版', plate: '沪C·77777',
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=200&h=150&fit=crop',
    merchant: '上海信车精品车商', merchantContact: '王经理', merchantPhone: '138****8888',
    market: '上海信车二手车市场', vin: '5YJ3E1EA4KF100001', rfid: '678901',
    source: 'finance_pledge', status: 'frozen',
    freezeTime: '2026-05-05 10:00:00',
    pledgeOrderInfo: {
      orderNo: 'ZY202605050001',
      fundCompany: '平安汽车金融',
      applyTime: '2026-05-04 14:20:00',
      totalAmount: '18.5万',
      status: '已审核',
      bankStatus: '已放款'
    },
    freezeHistory: [
      { time: '2026-05-05 10:00:00', action: '金融质押 · 系统自动冻结', operator: '系统' },
      { time: '2026-05-04 14:20:00', action: '提交质押申请', operator: '车商申某' }
    ]
  },
  // 金融质押冻结 - 已解冻（系统自动，无申请信息）
  {
    id: 7, name: '比亚迪 汉EV 2023款 冠军版 605KM', plate: '鲁B·11223',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad42243c59?w=200&h=150&fit=crop',
    merchant: '北京顺通二手车', merchantContact: '李经理', merchantPhone: '139****9999',
    market: '北京顺义二手车市场', vin: 'LGXCE4GB2N1234567', rfid: '789012',
    source: 'finance_pledge', status: 'released',
    freezeTime: '2026-03-01 10:00:00',
    unfreezeTime: '2026-05-05 08:00:00',
    pledgeOrderInfo: {
      orderNo: 'ZY202603010001',
      fundCompany: '招商银行汽车金融',
      applyTime: '2026-02-28 11:00:00',
      totalAmount: '22.0万',
      status: '已结清',
      bankStatus: '已还款'
    },
    freezeHistory: [
      { time: '2026-05-05 08:00:00', action: '还款完成 · 系统自动解冻', operator: '系统' },
      { time: '2026-03-01 10:00:00', action: '金融质押 · 系统自动冻结', operator: '系统' }
    ]
  },
  // 合同到期冻结 - 已冻结
  {
    id: 8, name: '奥迪 A6L 2024款 45TFSI 臻选动感型', plate: '豫A·15077',
    image: 'https://images.unsplash.com/photo-1606148332761-348259ca3f81?w=200&h=150&fit=crop',
    merchant: '成都华信汽贸', merchantContact: '刘经理', merchantPhone: '176****4444',
    market: '郑州智慧车市', vin: 'WAUZZZ4G5MN000001', rfid: '890123',
    source: 'contract', status: 'frozen',
    freezeTime: '2026-05-01 00:01:00',
    contractInfo: {
      contractNo: 'HT2023060001',
      leaseType: '固定摊位',
      businessEntity: '成都华信汽贸有限公司',
      areaName: 'A区',
      stallName: 'A-023',
      contractPeriod: '2023-06-01 至 2026-04-30'
    },
    freezeHistory: [
      { time: '2026-05-01 00:01:00', action: '摊位合同到期 · 系统自动冻结', operator: '系统' }
    ]
  },
  // 合同到期冻结 - 已解冻（管理员手动解冻，无申请信息）
  {
    id: 9, name: '小鹏 G6 2023款 580 长续航 Max', plate: '苏E·66666',
    image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf048?w=200&h=150&fit=crop',
    merchant: '深圳易车行', merchantContact: '陈经理', merchantPhone: '186****5555',
    market: '广州南方二手车城', vin: 'LSGWA6DB3PF000001', rfid: '901234',
    source: 'contract', status: 'released',
    freezeTime: '2026-04-15 00:01:00',
    unfreezeTime: '2026-05-08 11:30:00',
    contractInfo: {
      contractNo: 'HT2023040005',
      leaseType: '固定摊位',
      businessEntity: '深圳易车行有限公司',
      areaName: 'C区',
      stallName: 'C-101',
      contractPeriod: '2023-04-15 至 2026-04-14'
    },
    freezeHistory: [
      { time: '2026-05-08 11:30:00', action: '管理员手动解冻', operator: '李管理员' },
      { time: '2026-04-15 00:01:00', action: '摊位合同到期 · 系统自动冻结', operator: '系统' }
    ]
  },
  // 金融管控冻结 - 已冻结
  {
    id: 10, name: '理想 L9 2024款 Ultra 智能焕新版', plate: '京A·88888',
    image: 'https://images.unsplash.com/photo-1695641775791-c11f7da3768f?w=200&h=150&fit=crop',
    merchant: '北京顺通二手车', merchantContact: '李经理', merchantPhone: '139****9999',
    market: '北京顺义二手车市场', vin: 'LSJA24A89N1000001', rfid: '010123',
    source: 'finance_ctrl', status: 'frozen',
    freezeTime: '2026-05-09 10:00:00',
    financeCtrlInfo: {
      financeCompany: '招商银行汽车金融',
      createTime: '2026-05-09 10:00:00',
      operator: '赵管控员',
      controlMethod: '远程GPS封控',
      controlStatus: '管控中',
      remark: '贷款逾期30天以上，启动金融管控'
    },
    freezeHistory: [
      { time: '2026-05-09 10:00:00', action: '金融管控冻结', operator: '赵管控员' }
    ]
  },
  // 金融管控冻结 - 已解冻
  {
    id: 11, name: '问界 M9 2024款 增程 Ultra 6座', plate: '渝A·33445',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&h=150&fit=crop',
    merchant: '成都华信汽贸', merchantContact: '刘经理', merchantPhone: '176****4444',
    market: '郑州智慧车市', vin: 'LSJA24A89N2000002', rfid: '110123',
    source: 'finance_ctrl', status: 'released',
    freezeTime: '2026-04-20 09:00:00',
    unfreezeTime: '2026-05-10 16:00:00',
    financeCtrlInfo: {
      financeCompany: '建设银行汽车金融',
      createTime: '2026-04-20 09:00:00',
      operator: '钱管控员',
      controlMethod: 'OBD实时监控',
      controlStatus: '已解除',
      remark: '贷款已全额还清'
    },
    freezeHistory: [
      { time: '2026-05-10 16:00:00', action: '金融管控解冻', operator: '钱管控员' },
      { time: '2026-04-20 09:00:00', action: '金融管控冻结', operator: '钱管控员' }
    ]
  },
  // 金融质押冻结 - 已冻结（第2条）
  {
    id: 12, name: '极氪 001 2024款 WE版 100kWh', plate: '湘A·33445',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=150&fit=crop',
    merchant: '深圳易车行', merchantContact: '陈经理', merchantPhone: '186****5555',
    market: '广州南方二手车城', vin: 'LGXCE4GB2N2345678', rfid: '120123',
    source: 'finance_pledge', status: 'frozen',
    freezeTime: '2026-05-11 14:00:00',
    pledgeOrderInfo: {
      orderNo: 'ZY202605110002',
      fundCompany: '工商银行汽车金融',
      applyTime: '2026-05-10 10:00:00',
      totalAmount: '31.5万',
      status: '待审核',
      bankStatus: '待放款'
    },
    freezeHistory: [
      { time: '2026-05-11 14:00:00', action: '金融质押 · 系统自动冻结', operator: '系统' },
      { time: '2026-05-10 10:00:00', action: '提交质押申请', operator: '车商陈某' }
    ]
  },
  // 合同到期冻结 - 已冻结（第2条）
  {
    id: 13, name: '五菱宏光 MINI EV 2022款 马卡龙版', plate: '冀A·5F151',
    image: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=200&h=150&fit=crop',
    merchant: '北京顺通二手车', merchantContact: '李经理', merchantPhone: '139****9999',
    market: '北京顺义二手车市场', vin: 'LZWC2A6B2P1234567', rfid: '130123',
    source: 'contract', status: 'frozen',
    freezeTime: '2026-05-03 00:01:00',
    contractInfo: {
      contractNo: 'HT2023050002',
      leaseType: '临时摊位',
      businessEntity: '李某个人',
      areaName: 'B区',
      stallName: 'B-045',
      contractPeriod: '2023-05-01 至 2026-04-30'
    },
    freezeHistory: [
      { time: '2026-05-03 00:01:00', action: '摊位合同到期 · 系统自动冻结', operator: '系统' }
    ]
  },
  // 手动冻结 - 已冻结（第2条）
  {
    id: 14, name: '蔚来 ET5 2023款 75kWh 标准续航', plate: '苏B·22334',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad42243c59?w=200&h=150&fit=crop',
    merchant: '成都华信汽贸', merchantContact: '刘经理', merchantPhone: '176****4444',
    market: '郑州智慧车市', vin: 'WBANE51060CX12345', rfid: '140123',
    source: 'manual', status: 'frozen',
    freezeTime: '2026-05-12 16:00:00',
    photos: [],
    freezeHistory: [
      { time: '2026-05-12 16:00:00', action: '手动冻结', operator: '周管理员' }
    ]
  },
  // 金融管控冻结 - 已冻结（第2条）
  {
    id: 15, name: '宝马 iX3 2024款 创领型 M运动套装', plate: '粤B·55667',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=150&fit=crop',
    merchant: '深圳易车行', merchantContact: '陈经理', merchantPhone: '186****5555',
    market: '广州南方二手车城', vin: 'WBY73EF08N7D00001', rfid: '150123',
    source: 'finance_ctrl', status: 'frozen',
    freezeTime: '2026-05-13 08:30:00',
    financeCtrlInfo: {
      financeCompany: '农业银行汽车金融',
      createTime: '2026-05-13 08:30:00',
      operator: '孙管控员',
      controlMethod: '系统围栏管控',
      controlStatus: '管控中',
      remark: '高净值车辆重点金融风控'
    },
    freezeHistory: [
      { time: '2026-05-13 08:30:00', action: '金融管控冻结', operator: '孙管控员' }
    ]
  },
  // 上海信车 - 金融管控冻结（已冻结）
  {
    id: 16, name: '奔驰 E300L 2023款 运动版', plate: '沪A·88812',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad42243c59?w=200&h=150&fit=crop',
    merchant: '上海信车精品车商', merchantContact: '王经理', merchantPhone: '138****1001',
    market: '上海信车二手车市场', vin: 'WDD2130562A001001', rfid: '201001',
    source: 'finance_ctrl', status: 'frozen',
    freezeTime: '2026-05-15 09:00:00',
    financeCtrlInfo: {
      financeCompany: '招商银行汽车金融',
      createTime: '2026-05-15 09:00:00',
      operator: '李管控员',
      controlMethod: '系统围栏管控',
      controlStatus: '管控中',
      remark: '贷款逾期超过60天，启动金融管控'
    },
    freezeHistory: [
      { time: '2026-05-15 09:00:00', action: '金融管控冻结', operator: '李管控员' }
    ]
  },
  {
    id: 17, name: '宝马 5系 2022款 525Li M运动套装', plate: '沪C·32456',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=150&fit=crop',
    merchant: '上海信车精品车商', merchantContact: '张主管', merchantPhone: '139****2002',
    market: '上海信车二手车市场', vin: 'WBAJB0C51JB123002', rfid: '202002',
    source: 'finance_ctrl', status: 'frozen',
    freezeTime: '2026-05-18 14:30:00',
    financeCtrlInfo: {
      financeCompany: '平安汽车金融',
      createTime: '2026-05-18 14:30:00',
      operator: '李管控员',
      controlMethod: '物理锁定',
      controlStatus: '管控中',
      remark: '质押评估异常，临时管控'
    },
    freezeHistory: [
      { time: '2026-05-18 14:30:00', action: '金融管控冻结', operator: '李管控员' }
    ]
  },
  // 上海信车 - 合同到期冻结
  {
    id: 19, name: '大众 帕萨特 2023款 330TSI 商务版', plate: '沪B·11234',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=200&h=150&fit=crop',
    merchant: '上海信车精品车商', merchantContact: '王经理', merchantPhone: '138****1001',
    market: '上海信车二手车市场', vin: 'LSVCC2B46MN201001', rfid: '211001',
    source: 'contract', status: 'frozen',
    freezeTime: '2026-05-01 00:01:00',
    contractInfo: {
      contractNo: 'HT2023050101',
      leaseType: '固定摊位',
      businessEntity: '上海信车精品车商有限公司',
      areaName: 'B区',
      stallName: 'B-012',
      contractPeriod: '2023-05-01 至 2026-04-30'
    },
    freezeHistory: [
      { time: '2026-05-01 00:01:00', action: '摊位合同到期 · 系统自动冻结', operator: '系统' }
    ]
  },
  {
    id: 20, name: '本田 雅阁 2024款 2.0T 锐·耀版', plate: '沪A·56789',
    image: 'https://images.unsplash.com/photo-1606148332761-348259ca3f81?w=200&h=150&fit=crop',
    merchant: '上海信车精品车商', merchantContact: '张主管', merchantPhone: '139****2002',
    market: '上海信车二手车市场', vin: 'LHGCR2F59MA201002', rfid: '212002',
    source: 'contract', status: 'frozen',
    freezeTime: '2026-05-08 00:01:00',
    contractInfo: {
      contractNo: 'HT2023050102',
      leaseType: '活动摊位',
      businessEntity: '上海信车精品车商有限公司',
      areaName: 'C区',
      stallName: 'C-007',
      contractPeriod: '2023-05-08 至 2026-05-07'
    },
    freezeHistory: [
      { time: '2026-05-08 00:01:00', action: '摊位合同到期 · 系统自动冻结', operator: '系统' }
    ]
  },
  {
    id: 21, name: '丰田 凯美瑞 2023款 2.5 豪华版', plate: '沪C·98765',
    image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=200&h=150&fit=crop',
    merchant: '上海信车精品车商', merchantContact: '赵总监', merchantPhone: '135****3003',
    market: '上海信车二手车市场', vin: 'JTDBE30K253201003', rfid: '213003',
    source: 'contract', status: 'released',
    freezeTime: '2026-04-10 00:01:00',
    unfreezeTime: '2026-04-25 14:00:00',
    contractInfo: {
      contractNo: 'HT2023040103',
      leaseType: '固定摊位',
      businessEntity: '上海信车精品车商有限公司',
      areaName: 'A区',
      stallName: 'A-031',
      contractPeriod: '2023-04-10 至 2026-04-09'
    },
    freezeHistory: [
      { time: '2026-04-25 14:00:00', action: '管理员手动解冻', operator: '李管理员' },
      { time: '2026-04-10 00:01:00', action: '摊位合同到期 · 系统自动冻结', operator: '系统' }
    ]
  },
  {
    id: 18, name: '奥迪 A6L 2023款 45 TFSI 豪华型', plate: '沪D·67890',
    image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=200&h=150&fit=crop',
    merchant: '上海信车精品车商', merchantContact: '赵总监', merchantPhone: '135****3003',
    market: '上海信车二手车市场', vin: 'WAUZZZ4G5MN003003', rfid: '203003',
    source: 'finance_ctrl', status: 'released',
    freezeTime: '2026-04-20 10:00:00',
    unfreezeTime: '2026-05-20 16:00:00',
    financeCtrlInfo: {
      financeCompany: '工商银行汽车金融',
      createTime: '2026-04-20 10:00:00',
      operator: '钱管控员',
      controlMethod: '系统围栏管控',
      controlStatus: '已解除',
      remark: '欠款结清，解除管控'
    },
    freezeHistory: [
      { time: '2026-05-20 16:00:00', action: '金融管控解冻', operator: '钱管控员' },
      { time: '2026-04-20 10:00:00', action: '金融管控冻结', operator: '钱管控员' }
    ]
  }
])

// ==================== 筛选逻辑 ====================
const filteredTableData = computed(() => {
  let data = tableData.value

  // 数据范围：按角色过滤
  const role = currentRole.value
  const userMarket = currentUserMarket.value
  if (role === '市场管理员') {
    data = data.filter(item => item.market === userMarket)
  } else if (role === '金融管控管理员') {
    data = data.filter(item => item.market === userMarket && item.source === 'finance_ctrl')
  }

  data = data.filter(item => item.status === activeTab.value)

  if (filters.value.source) {
    data = data.filter(item => item.source === filters.value.source)
  }
  if (filters.value.market) {
    data = data.filter(item => item.market === filters.value.market)
  }
  if (filters.value.merchant) {
    data = data.filter(item => item.merchant === filters.value.merchant)
  }
  if (filters.value.vin) {
    const v = filters.value.vin.toUpperCase()
    data = data.filter(item => item.vin && item.vin.toUpperCase().includes(v))
  }
  if (filters.value.plate) {
    data = data.filter(item => item.plate && item.plate.includes(filters.value.plate))
  }
  if (filters.value.rfid) {
    data = data.filter(item => item.rfid && item.rfid.includes(filters.value.rfid))
  }

  return data
})

const paginatedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredTableData.value.slice(start, start + pageSize.value)
})

const total = computed(() => filteredTableData.value.length)

const handleSearch = () => { currentPage.value = 1 }

const resetFilters = () => {
  filters.value = { market: '', merchant: '', vin: '', plate: '', rfid: '', dateRange: [], source: '' }
  currentPage.value = 1
}

const handleExport = () => {
  const baseColumns = [
    { label: '车型名称', key: 'name' },
    { label: '车架号', key: 'vin' },
    { label: '所属市场', key: 'market' },
    { label: '车商名称', key: 'merchant' },
    { label: '联系人', key: 'merchantContact' },
    { label: '联系电话', key: 'merchantPhone' },
    { label: '车辆RFID', key: 'rfid' },
    { label: '车牌号', key: 'plate' },
    { label: '冻结来源', key: 'source', format: v => SOURCE_MAP[v] || v },
    { label: '冻结时间', key: 'freezeTime' }
  ]
  const releasedColumns = [
    { label: '申请解冻原因', key: 'unfreezeReason', format: (v, row) => row.source === 'manual' ? (v || '-') : '-' },
    { label: '申请解冻时间', key: 'unfreezeApplyTime', format: (v, row) => row.source === 'manual' ? (v || '-') : '-' },
    { label: '解冻时间', key: 'unfreezeTime' },
    { label: '解冻有效期', key: 'unfreezeValidPeriod', format: (v, row) => row.source === 'manual' ? (v || '无限制') : '-' }
  ]

  const columns = activeTab.value === 'released' ? [...baseColumns, ...releasedColumns] : baseColumns
  const header = columns.map(c => c.label).join(',')
  const rows = filteredTableData.value.map(row =>
    columns.map(col => {
      const val = col.format ? col.format(row[col.key], row) : (row[col.key] || '-')
      const str = String(val)
      return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str
    }).join(',')
  )

  const csv = '﻿' + [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `冻结车列表_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '')}.csv`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// ==================== 菜单切换 ====================
const currentMenu = ref('list')

// ==================== 冻结车设置 ====================
const settingsActiveTab = ref('reasonSettings')
const settingsData = ref([
  { market: '上海信车二手车市场', reason: '临时提车出售', validity: 168, createTime: '2026-01-10 10:00:00' },
  { market: '北京顺义二手车市场', reason: '已结清欠款', validity: 0, createTime: '2026-01-10 11:30:00' },
  { market: '郑州智慧车市', reason: '合规整改完成', validity: 72, createTime: '2026-01-10 14:00:00' },
  { market: '广州南方二手车城', reason: '车辆转移', validity: 24, createTime: '2026-01-11 09:12:00' },
])

const formatConfigDuration = (val) => {
  if (val === 0) return '无限制'
  const hours = parseInt(val)
  if (isNaN(hours)) return val
  const d = Math.floor(hours / 24)
  const h = hours % 24
  if (d > 0) return h > 0 ? `${d}天${h}小时` : `${d}天`
  return `${h}小时`
}

const addReasonDialogVisible = ref(false)
const isEdit = ref(false)
const editIndex = ref(-1)
const marketOptions = ref(['上海信车二手车市场', '北京顺义二手车市场', '郑州智慧车市', '广州南方二手车城'])
const addReasonForm = ref({ market: '', reason: '', validityType: '关闭', days: 0, hours: 0 })

const handleAddReason = () => {
  isEdit.value = false
  addReasonForm.value = { market: '', reason: '', validityType: '关闭', days: 0, hours: 0 }
  addReasonDialogVisible.value = true
}

const handleEditReason = (row, index) => {
  isEdit.value = true
  editIndex.value = index
  addReasonForm.value = {
    market: row.market,
    reason: row.reason,
    validityType: row.validity > 0 ? '开启' : '关闭',
    days: Math.floor(row.validity / 24),
    hours: row.validity % 24
  }
  addReasonDialogVisible.value = true
}

watch([() => addReasonForm.value.days, () => addReasonForm.value.hours], ([d, h]) => {
  if (addReasonForm.value.validityType === '开启' && d === 0 && h === 0) {
    addReasonForm.value.validityType = '关闭'
  }
})

const cancelAddReason = () => { addReasonDialogVisible.value = false }

const submitAddReason = () => {
  if (!addReasonForm.value.market || !addReasonForm.value.reason) {
    return ElMessage.warning('请填写市场名称和解冻原因')
  }
  let validityValue = 0
  if (addReasonForm.value.validityType === '开启') {
    validityValue = (addReasonForm.value.days * 24) + addReasonForm.value.hours
  }
  if (isEdit.value) {
    settingsData.value[editIndex.value] = {
      ...settingsData.value[editIndex.value],
      reason: addReasonForm.value.reason,
      validity: validityValue
    }
    ElMessage.success('配置更新成功')
  } else {
    settingsData.value.unshift({
      market: addReasonForm.value.market,
      reason: addReasonForm.value.reason,
      validity: validityValue,
      createTime: new Date().toLocaleString('zh-CN').replace(/\//g, '-')
    })
    ElMessage.success('配置添加成功')
  }
  addReasonDialogVisible.value = false
}
</script>

<style scoped>
/* ===== 布局 ===== */
.layout-container {
  height: 100vh;
  background-color: #f2f4f5;
  min-width: 1200px;
}

/* ===== 侧边栏 ===== */
.sidebar {
  background-color: #ffffff;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
  border-right: 1px solid #f0f0f0;
  height: 100vh;
  overflow: hidden auto;
}
.logo {
  height: 90px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #f0f2f5;
}
.sidebar-logo {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}
.logo-text {
  color: #0444a6;
  font-size: 20px;
  font-weight: normal;
  white-space: nowrap;
}
.side-menu {
  border-right: none;
}
:deep(.el-menu-item.is-active) {
  background-color: #48528e !important;
  color: #ffffff !important;
}
:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: #f2f7ff !important;
  color: #409eff !important;
}

/* ===== 顶部状态栏 ===== */
.top-header {
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}
.market-info {
  font-size: 14px;
  color: #333333;
  font-weight: 600;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}
.role-switcher {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
}
.role-label { white-space: nowrap; }
.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}
.username {
  font-size: 16px;
  color: #000000;
  font-weight: 600;
}
.role-tag {
  min-width: 68px;
  height: 20px;
  padding: 0 8px;
  background-color: #d0e2f2;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #1d2c4f;
  white-space: nowrap;
}
.arrow-container {
  width: 20px;
  height: 20px;
  background-color: #f3f5fc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* ===== 主内容区 ===== */
.main-content {
  padding: 15px;
  background: #f2f4f5;
  overflow: auto;
}
.content-body {
  background-color: #f9fafb;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 12px;
}

/* ===== Tab 筛选 ===== */
.tab-filter-container {
  display: flex;
  flex-wrap: nowrap;
}
.tab-item {
  width: 90px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #303133;
  background-color: #f9fafb;
  border: 1px solid #e3e4e5;
  border-bottom: none;
  margin-right: -1px;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
  transition: background-color 0.15s;
}
.tab-item:last-child { margin-right: 0; }
.tab-item.is-active { background-color: #f2f2f2; }
.tab-item:hover:not(.is-active) { background-color: #ecf5ff; color: #409eff; }

/* ===== 筛选容器 ===== */
.search-filter-container {
  background-color: #f2f2f2;
  padding: 20px 0 0;
  border-bottom: 1px solid #e8e8e8;
}
.search-form {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}
:deep(.search-form .el-form-item) {
  margin-right: 0;
  margin-bottom: 20px;
  margin-left: 0;
  padding: 0 12px;
}
:deep(.search-form .el-form-item__label) {
  width: 80px !important;
  justify-content: flex-end;
  height: 40px;
  line-height: 40px;
  padding-right: 12px;
}
:deep(.search-form .el-input),
:deep(.search-form .el-select .el-select__wrapper) {
  width: 200px;
}
.search-actions {
  flex-basis: 100%;
}
:deep(.search-form .search-actions) {
  margin-bottom: 20px;
}
:deep(.search-form .search-actions .el-form-item__content) {
  margin-left: 92px !important;
  display: flex;
  gap: 12px;
}

/* ===== 表格区域 ===== */
.view-container {
  margin-top: 40px;
}
.vehicle-img {
  width: 100px;
  height: 75px;
  border-radius: 4px;
}
.vehicle-info-content { padding: 4px 0; }
.brand-name {
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
  font-size: 14px;
}
.info-sub {
  font-size: 12px;
  color: #66798c;
  line-height: 1.6;
}
.rfid-tag {
  display: inline-block;
  background: #f0f5ff;
  border: 1px solid #adc6ff;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 13px;
  color: #1d39c4;
  font-family: monospace;
  white-space: nowrap;
}
/* 二期新增：冻结来源标签 */
.source-tag {
  display: inline-block;
  color: #F56C6C;
  font-size: 12px;
  font-weight: 500;
  background: #fef0f0;
  border: 1px solid #fbc4c4;
  padding: 2px 8px;
  border-radius: 3px;
}
.operation-btns {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
:deep(.operation-btns .el-button) {
  margin: 0 !important;
  width: 80px;
}
:deep(.business-table .el-table__row) { height: auto; min-height: 54px; }

/* ===== 分页 ===== */
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* ===== 详情抽屉 ===== */
.detail-container { padding: 0 4px 40px; }

.detail-header-card {
  display: flex;
  gap: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #eef0f3;
}
.detail-main-img {
  width: 180px;
  height: 135px;
  border-radius: 6px;
  border: 1px solid #eee;
  flex-shrink: 0;
}
.detail-header-info { flex: 1; }
.detail-car-name {
  font-size: 17px;
  font-weight: bold;
  color: #303133;
  line-height: 1.4;
}

.detail-section { margin-bottom: 28px; }
.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 14px;
  padding-left: 10px;
  border-left: 4px solid #48528e;
  line-height: 16px;
}

.photo-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.photo-thumb {
  width: 100px;
  height: 75px;
  border-radius: 4px;
  border: 1px solid #eee;
  cursor: pointer;
}
.photo-empty {
  height: 80px;
  background: #f8f9fb;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  font-size: 13px;
}

.timeline-action { font-weight: 500; color: #303133; }
.timeline-operator { font-size: 12px; color: #909399; }

/* ===== 解冻有效期提示 ===== */
.unfreeze-validity {
  margin-top: 8px;
  font-size: 13px;
}
.validity-label { color: #909399; }
.validity-value { color: #F56C6C; font-weight: 500; }

/* ===== 解冻确认弹窗 ===== */
.confirm-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  gap: 12px;
}
.confirm-icon { margin-bottom: 4px; }
.confirm-tip {
  font-size: 15px;
  color: #303133;
  font-weight: 500;
}
.confirm-car-card {
  width: 100%;
  background: #f8f9fb;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  padding: 12px 16px;
  text-align: center;
}

/* ===== 冻结车设置 ===== */
.settings-toolbar {
  margin-bottom: 0;
}
:deep(.settings-toolbar .el-tabs__header) { margin-bottom: 0; }
:deep(.settings-toolbar .el-tabs__item.is-active) { color: #409eff; }

.settings-add-btn {
  margin: 20px 12px 12px;
  display: block;
}
:deep(.settings-filter-container .search-form) {
  padding: 0 12px;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
}
:deep(.settings-filter-container .search-form .el-form-item) {
  margin-bottom: 8px;
}
:deep(.settings-search-actions) {
  flex-basis: 100%;
  margin-top: 8px;
}
</style>

<style>
/* 操作列描边按钮确保纯白底（覆盖 EP2 的浅色 tint） */
.operation-btns .el-button--primary.is-plain {
  background-color: #ffffff !important;
}
.operation-btns .el-button--danger.is-plain {
  background-color: #ffffff !important;
}
</style>
