<template>
  <div>
    <!-- ============ 金融公司模块 ============ -->
    <div class="page-card" style="padding: 20px; margin-bottom: 16px;">
      <div class="module-header">
        <span class="module-title">金融公司</span>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="openAddCompany">新增金融公司</el-button>
      </div>

      <!-- 筛选区 -->
      <div class="filter-bar">
        <el-select v-model="companyFilter.market" placeholder="所属市场" clearable size="small" style="width:180px;">
          <el-option v-for="m in marketOptions" :key="m" :label="m" :value="m" />
        </el-select>
        <el-input v-model="companyFilter.name" placeholder="金融公司" clearable size="small" />
        <el-input v-model="companyFilter.owner" placeholder="负责人" clearable size="small" />
        <el-input v-model="companyFilter.ownerPhone" placeholder="负责人电话" clearable size="small" />
        <el-date-picker
          v-model="companyFilter.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          style="width:240px;"
        />
        <el-button type="primary" size="small" @click="doCompanySearch">查询</el-button>
        <el-button size="small" @click="doCompanyReset">重置</el-button>
        <el-button size="small" icon="el-icon-download" @click="$message.info('导出功能开发中')">查询数据导出</el-button>
      </div>

      <!-- 公司表格 -->
      <el-table :data="pagedCompanies" border style="width:100%" size="small">
        <el-table-column prop="market" label="所属市场" min-width="150" />
        <el-table-column prop="name" label="金融公司名称" min-width="120" />
        <el-table-column prop="owner" label="负责人" width="90" />
        <el-table-column prop="ownerPhone" label="负责人电话" width="130" />
        <el-table-column label="负责人证件号" width="180">
          <template slot-scope="{ row }">{{ row.idNumber || '—' }}</template>
        </el-table-column>
        <el-table-column label="资金渠道数量" width="110" align="center">
          <template slot-scope="{ row }">
            {{ channelCountByCompany(row.market, row.name) }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="140" fixed="right">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="openCompanyDetail(row)">查看</el-button>
            <el-dropdown size="small" trigger="click" @command="(cmd) => handleCompanyAction(cmd, row)">
              <el-button type="text" size="small" style="margin-left:4px">
                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit">编辑</el-dropdown-item>
                <el-dropdown-item command="delete" style="color:#F56C6C">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <div style="display:flex;justify-content:flex-end;margin-top:16px;">
        <el-pagination
          background layout="total, prev, pager, next"
          :total="filteredCompanies.length"
          :page-size="companyPageSize"
          :current-page.sync="companyPage"
          small
        />
      </div>
    </div>

    <!-- ============ 资金渠道模块 ============ -->
    <div class="page-card" style="padding: 20px;">
      <div class="module-header">
        <span class="module-title">资金渠道</span>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="openAddChannel()">新增渠道</el-button>
      </div>

      <!-- 筛选区 -->
      <div class="filter-bar">
        <el-select v-model="channelFilter.market" placeholder="所属市场" clearable size="small" style="width:180px;">
          <el-option v-for="m in marketOptions" :key="m" :label="m" :value="m" />
        </el-select>
        <el-select v-model="channelFilter.company" placeholder="金融公司" clearable size="small" style="width:140px;">
          <el-option v-for="c in companyOptions" :key="c" :label="c" :value="c" />
        </el-select>
        <el-input v-model="channelFilter.channelName" placeholder="渠道名称" clearable size="small" />
        <el-select v-model="channelFilter.evalType" placeholder="车辆评估方式" clearable size="small" style="width:130px;">
          <el-option label="自动评估" value="auto" />
          <el-option label="人工评估" value="manual" />
        </el-select>
        <el-button type="primary" size="small" @click="doChannelSearch">查询</el-button>
        <el-button size="small" @click="doChannelReset">重置</el-button>
      </div>

      <!-- 渠道表格 -->
      <el-table :data="pagedChannels" border style="width:100%" size="small" empty-text="暂无资金渠道数据">
        <el-table-column prop="market" label="所属市场" min-width="150" />
        <el-table-column prop="company" label="金融公司名称" min-width="120" />
        <el-table-column prop="channelName" label="渠道名称" min-width="180" />
        <el-table-column label="放款比例" width="90" align="center">
          <template slot-scope="{ row }">{{ row.loanRatio }}%</template>
        </el-table-column>
        <el-table-column label="车辆评估方式" width="110" align="center">
          <template slot-scope="{ row }">{{ row.evalType === 'auto' ? '自动评估' : '人工评估' }}</template>
        </el-table-column>
        <el-table-column label="评估平台" min-width="140">
          <template slot-scope="{ row }">
            <span v-if="row.evalType === 'auto' && row.platforms && row.platforms.length">
              {{ row.platforms.join('、') }}
            </span>
            <span v-else style="color:#C0C4CC">—</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="170" fixed="right">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="openEditChannel(row)">编辑</el-button>
            <el-button type="text" size="small" style="color:#F56C6C" @click="openDeleteChannel(row)">删除</el-button>
            <el-button type="text" size="small" @click="openChannelLog(row)">操作日志</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="display:flex;justify-content:flex-end;margin-top:16px;">
        <el-pagination
          background layout="total, prev, pager, next"
          :total="filteredChannels.length"
          :page-size="channelPageSize"
          :current-page.sync="channelPage"
          small
        />
      </div>
    </div>

    <!-- ========== 弹窗/抽屉区 ========== -->

    <!-- 新增/编辑金融公司 -->
    <company-form-dialog
      :visible.sync="companyDialogVisible"
      :mode="companyDialogMode"
      :company-data="editingCompany"
      @saved="handleCompanySaved"
      @add-channel="handleAddChannelAfterCompany"
    />

    <!-- 金融公司详情抽屉 -->
    <company-detail-drawer
      :visible.sync="drawerVisible"
      :company="detailCompany"
      @edit="openEditCompanyFromDrawer"
    />

    <!-- 删除金融公司确认 -->
    <el-dialog title="删除确认" :visible.sync="deleteCompanyVisible" width="420px" :close-on-click-modal="false">
      <div v-if="deletingCompany">
        <div v-if="deleteCompanyBlocked" style="color:#F56C6C;display:flex;align-items:center;gap:6px;margin-bottom:12px;">
          <i class="el-icon-warning" style="font-size:18px;"></i>
          该金融公司下存在资金渠道，请先删除相关渠道后再操作。
        </div>
        <div v-else>
          <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:16px;">
            <i class="el-icon-warning" style="font-size:22px;color:#E6A23C;margin-top:2px;"></i>
            <div>
              <div style="font-size:15px;font-weight:600;margin-bottom:8px;">确认删除？</div>
              <div style="background:#F5F7FA;border:1px solid #EBEEF5;border-radius:4px;padding:10px 14px;margin-bottom:8px;">
                <div style="font-size:13px;color:#303133;">{{ deletingCompany.name }}</div>
                <div style="font-size:12px;color:#909399;margin-top:4px;">{{ deletingCompany.market }}</div>
              </div>
              <div style="color:#909399;font-size:12px;">删除后不可恢复，请谨慎操作。</div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button size="small" @click="deleteCompanyVisible = false">取消</el-button>
        <el-button v-if="!deleteCompanyBlocked" type="danger" size="small" @click="confirmDeleteCompany">确定删除</el-button>
      </span>
    </el-dialog>

    <!-- 新增/编辑资金渠道 -->
    <channel-form-dialog
      :visible.sync="channelDialogVisible"
      :mode="channelDialogMode"
      :channel-data="editingChannel"
      :locked-market="lockedChannelMarket"
      :locked-company="lockedChannelCompany"
      @saved="handleChannelSaved"
    />

    <!-- 删除资金渠道确认 -->
    <el-dialog title="删除确认" :visible.sync="deleteChannelVisible" width="380px" :close-on-click-modal="false">
      <div v-if="deletingChannel">
        <div v-if="deletingChannel.hasOrders" style="color:#F56C6C;display:flex;align-items:center;gap:6px;">
          <i class="el-icon-warning" style="font-size:18px;"></i>
          该资金渠道存在进行中的质押订单，无法删除。
        </div>
        <div v-else>
          <div style="display:flex;align-items:flex-start;gap:10px;">
            <i class="el-icon-warning" style="font-size:22px;color:#E6A23C;margin-top:2px;"></i>
            <div>
              <div style="font-size:15px;font-weight:600;margin-bottom:8px;">确认删除该资金渠道？</div>
              <div style="background:#F5F7FA;border:1px solid #EBEEF5;border-radius:4px;padding:10px 14px;">
                <div style="font-size:13px;color:#303133;">{{ deletingChannel.channelName }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button size="small" @click="deleteChannelVisible = false">取消</el-button>
        <el-button v-if="deletingChannel && !deletingChannel.hasOrders" type="danger" size="small" @click="confirmDeleteChannel">确定删除</el-button>
      </span>
    </el-dialog>

    <!-- 操作日志 -->
    <el-dialog title="操作日志" :visible.sync="logDialogVisible" width="540px">
      <div v-if="logChannel">
        <div v-if="!logChannel.logs || logChannel.logs.length === 0" style="text-align:center;color:#909399;padding:30px 0;">
          暂无操作记录
        </div>
        <el-timeline v-else>
          <el-timeline-item
            v-for="(log, idx) in logChannel.logs"
            :key="idx"
            :timestamp="log.time"
            placement="top"
          >
            <div style="font-size:13px;">
              <span style="color:#909399;">{{ log.user }} · </span>
              <el-tag size="mini" :type="log.type === '新增' ? 'success' : 'warning'" style="margin-right:4px;">{{ log.type }}</el-tag>
              {{ log.detail }}
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
      <span slot="footer">
        <el-button size="small" @click="logDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { marketOptions } from '@/data/mockData'
import CompanyFormDialog from '@/components/CompanyFormDialog.vue'
import CompanyDetailDrawer from '@/components/CompanyDetailDrawer.vue'
import ChannelFormDialog from '@/components/ChannelFormDialog.vue'

export default {
  name: 'FinancialInit',
  components: { CompanyFormDialog, CompanyDetailDrawer, ChannelFormDialog },
  data() {
    return {
      marketOptions,
      // 公司筛选
      companyFilter: { market: '', name: '', owner: '', ownerPhone: '', dateRange: null },
      activeCompanyFilter: { market: '', name: '', owner: '', ownerPhone: '', dateRange: null },
      companyPage: 1,
      companyPageSize: 10,
      // 渠道筛选
      channelFilter: { market: '', company: '', channelName: '', evalType: '' },
      activeChannelFilter: { market: '', company: '', channelName: '', evalType: '' },
      channelPage: 1,
      channelPageSize: 10,
      // 公司弹窗
      companyDialogVisible: false,
      companyDialogMode: 'add',
      editingCompany: null,
      // 详情抽屉
      drawerVisible: false,
      detailCompany: null,
      // 删除公司
      deleteCompanyVisible: false,
      deletingCompany: null,
      // 渠道弹窗
      channelDialogVisible: false,
      channelDialogMode: 'add',
      editingChannel: null,
      lockedChannelMarket: '',
      lockedChannelCompany: '',
      // 删除渠道
      deleteChannelVisible: false,
      deletingChannel: null,
      // 操作日志
      logDialogVisible: false,
      logChannel: null
    }
  },
  computed: {
    ...mapState(['companies', 'channels']),
    ...mapGetters(['channelCountByCompany']),
    companyOptions() {
      return [...new Set(this.companies.map(c => c.name))]
    },
    filteredCompanies() {
      const f = this.activeCompanyFilter
      return this.companies.filter(c => {
        if (f.market && c.market !== f.market) return false
        if (f.name && !c.name.includes(f.name)) return false
        if (f.owner && !c.owner.includes(f.owner)) return false
        if (f.ownerPhone && !c.ownerPhone.includes(f.ownerPhone)) return false
        return true
      })
    },
    pagedCompanies() {
      const start = (this.companyPage - 1) * this.companyPageSize
      return this.filteredCompanies.slice(start, start + this.companyPageSize)
    },
    filteredChannels() {
      const f = this.activeChannelFilter
      return this.channels.filter(c => {
        if (f.market && c.market !== f.market) return false
        if (f.company && c.company !== f.company) return false
        if (f.channelName && !c.channelName.includes(f.channelName)) return false
        if (f.evalType && c.evalType !== f.evalType) return false
        return true
      })
    },
    pagedChannels() {
      const start = (this.channelPage - 1) * this.channelPageSize
      return this.filteredChannels.slice(start, start + this.channelPageSize)
    },
    deleteCompanyBlocked() {
      if (!this.deletingCompany) return false
      return this.channels.some(c => c.market === this.deletingCompany.market && c.company === this.deletingCompany.name)
    }
  },
  methods: {
    // ---- 公司 ----
    doCompanySearch() {
      this.activeCompanyFilter = JSON.parse(JSON.stringify(this.companyFilter))
      this.companyPage = 1
    },
    doCompanyReset() {
      this.companyFilter = { market: '', name: '', owner: '', ownerPhone: '', dateRange: null }
      this.activeCompanyFilter = { market: '', name: '', owner: '', ownerPhone: '', dateRange: null }
      this.companyPage = 1
    },
    openAddCompany() {
      this.companyDialogMode = 'add'
      this.editingCompany = null
      this.companyDialogVisible = true
    },
    handleCompanyAction(cmd, row) {
      if (cmd === 'edit') {
        this.companyDialogMode = 'edit'
        this.editingCompany = { ...row }
        this.companyDialogVisible = true
      } else if (cmd === 'delete') {
        this.deletingCompany = row
        this.deleteCompanyVisible = true
      }
    },
    openCompanyDetail(row) {
      this.detailCompany = row
      this.drawerVisible = true
    },
    openEditCompanyFromDrawer(row) {
      this.drawerVisible = false
      this.$nextTick(() => {
        this.companyDialogMode = 'edit'
        this.editingCompany = { ...row }
        this.companyDialogVisible = true
      })
    },
    confirmDeleteCompany() {
      this.$store.commit('DELETE_COMPANY', this.deletingCompany.id)
      this.deleteCompanyVisible = false
      this.$message.success('删除成功')
    },
    handleCompanySaved() {
      // 刷新由 vuex 响应式驱动，无需额外操作
    },
    handleAddChannelAfterCompany(company) {
      this.$nextTick(() => {
        this.lockedChannelMarket = company.market
        this.lockedChannelCompany = company.name
        this.channelDialogMode = 'add'
        this.editingChannel = null
        this.channelDialogVisible = true
      })
    },

    // ---- 渠道 ----
    doChannelSearch() {
      this.activeChannelFilter = { ...this.channelFilter }
      this.channelPage = 1
    },
    doChannelReset() {
      this.channelFilter = { market: '', company: '', channelName: '', evalType: '' }
      this.activeChannelFilter = { market: '', company: '', channelName: '', evalType: '' }
      this.channelPage = 1
    },
    openAddChannel() {
      this.lockedChannelMarket = ''
      this.lockedChannelCompany = ''
      this.channelDialogMode = 'add'
      this.editingChannel = null
      this.channelDialogVisible = true
    },
    openEditChannel(row) {
      this.lockedChannelMarket = ''
      this.lockedChannelCompany = ''
      this.channelDialogMode = 'edit'
      this.editingChannel = { ...row }
      this.channelDialogVisible = true
    },
    openDeleteChannel(row) {
      this.deletingChannel = row
      this.deleteChannelVisible = true
    },
    confirmDeleteChannel() {
      this.$store.commit('DELETE_CHANNEL', this.deletingChannel.id)
      this.deleteChannelVisible = false
      this.$message.success('删除成功')
    },
    handleChannelSaved() {
      // vuex 响应式
    },
    openChannelLog(row) {
      this.logChannel = row
      this.logDialogVisible = true
    }
  }
}
</script>
