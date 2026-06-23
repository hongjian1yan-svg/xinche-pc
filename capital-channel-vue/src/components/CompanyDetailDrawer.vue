<template>
  <div>
    <!-- 遮罩 -->
    <transition name="mask-fade">
      <div v-if="visible" class="drawer-mask" @click="handleClose" />
    </transition>

    <!-- 抽屉主体 -->
    <transition name="drawer-slide">
      <div v-if="visible" class="company-drawer">
        <!-- 关闭按钮（在抽屉左外侧） -->
        <button class="drawer-close-btn" @click="handleClose">
          <i class="el-icon-close" style="color:#fff;font-size:16px;"></i>
        </button>

        <div class="drawer-inner" v-if="company">
          <!-- Header -->
          <div class="drawer-header">
            <span class="drawer-title">金融公司详情</span>
            <el-button size="small" icon="el-icon-edit" @click="$emit('edit', company)">编辑</el-button>
          </div>

          <!-- 基础信息格 -->
          <div class="info-grid">
            <div class="info-row">
              <div class="info-cell">
                <span class="info-label">所属市场</span>
                <span class="info-value">{{ company.market }}</span>
              </div>
              <div class="info-cell">
                <span class="info-label">创建时间</span>
                <span class="info-value">{{ company.createdAt }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-cell">
                <span class="info-label">操作人</span>
                <span class="info-value">{{ company.creator }}</span>
              </div>
              <div class="info-cell"></div>
            </div>
          </div>

          <!-- 金融公司信息 -->
          <div class="detail-section">
            <div class="section-title">金融公司信息</div>
            <table class="detail-table">
              <tbody>
                <tr>
                  <td class="td-label">公司名称</td>
                  <td>{{ company.name }}</td>
                  <td class="td-label">负责人</td>
                  <td>{{ company.owner }}</td>
                </tr>
                <tr>
                  <td class="td-label">负责人电话</td>
                  <td>{{ company.ownerPhone }}</td>
                  <td class="td-label">负责人证件号</td>
                  <td>{{ company.idNumber || '—' }}</td>
                </tr>
                <tr>
                  <td class="td-label">备注</td>
                  <td colspan="3">{{ company.remark || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 图片信息 -->
          <div class="detail-section">
            <div class="section-title">图片信息</div>
            <div v-if="!company.image" style="color:#C0C4CC;font-size:13px;padding:12px 0;">暂无图片</div>
            <img v-else :src="company.image" style="max-width:200px;border-radius:4px;" />
          </div>

          <!-- 资金渠道 -->
          <div class="detail-section">
            <div class="section-title">资金渠道</div>
            <div v-if="companyChannels.length === 0" style="color:#C0C4CC;font-size:13px;padding:12px 0;">暂无资金渠道</div>
            <table v-else class="detail-table channel-table">
              <thead>
                <tr>
                  <th>渠道名称</th>
                  <th>放款比例</th>
                  <th>车辆评估方式</th>
                  <th>评估平台</th>
                  <th>创建时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ch in companyChannels" :key="ch.id">
                  <td>{{ ch.channelName }}</td>
                  <td>{{ ch.loanRatio }}%</td>
                  <td>{{ ch.evalType === 'auto' ? '自动评估' : '人工评估' }}</td>
                  <td>{{ ch.evalType === 'auto' && ch.platforms && ch.platforms.length ? ch.platforms.join('、') : '—' }}</td>
                  <td>{{ ch.createdAt }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CompanyDetailDrawer',
  props: {
    visible: { type: Boolean, default: false },
    company: { type: Object, default: null }
  },
  computed: {
    ...mapState(['channels']),
    companyChannels() {
      if (!this.company) return []
      return this.channels.filter(c => c.market === this.company.market && c.company === this.company.name)
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>
.drawer-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2000;
}

.company-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 1130px;
  height: 100vh;
  background: #fff;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  z-index: 2001;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.drawer-close-btn {
  position: absolute;
  left: -40px;
  top: 0;
  width: 40px;
  height: 40px;
  background: #409EFF;
  border: none;
  border-radius: 4px 0 0 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.drawer-close-btn:hover {
  background: #337ecc;
}

.drawer-inner {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #EBEEF5;
}

.drawer-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.info-grid {
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  margin-bottom: 24px;
  overflow: hidden;
}

.info-row {
  display: flex;
  border-bottom: 1px solid #EBEEF5;
}

.info-row:last-child {
  border-bottom: none;
}

.info-cell {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-right: 1px solid #EBEEF5;
  font-size: 13px;
}

.info-cell:last-child {
  border-right: none;
}

.info-label {
  color: #909399;
  min-width: 80px;
}

.info-value {
  color: #303133;
}

.detail-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  padding-left: 10px;
  border-left: 3px solid #409EFF;
  margin-bottom: 12px;
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.detail-table td,
.detail-table th {
  border: 1px solid #EBEEF5;
  padding: 10px 14px;
  color: #303133;
  vertical-align: middle;
}

.detail-table th {
  background: #F5F7FA;
  color: #606266;
  font-weight: 500;
  text-align: left;
}

.detail-table .td-label {
  background: #FAFAFA;
  color: #909399;
  width: 130px;
  white-space: nowrap;
}

.channel-table tr {
  height: 41px;
}

/* 动画 */
.mask-fade-enter-active,
.mask-fade-leave-active {
  transition: opacity 0.25s;
}
.mask-fade-enter,
.mask-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.3s ease;
}
.drawer-slide-enter,
.drawer-slide-leave-to {
  transform: translateX(100%);
}
</style>
