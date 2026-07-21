<template>
  <div class="vl-page">

    <!-- 筛选区 -->
    <div class="vl-filter-wrap">
      <el-form :model="filters" inline class="vl-filter-form">

        <el-form-item label="所属市场">
          <el-select v-model="filters.market" placeholder="请选择市场" clearable size="large" filterable :disabled="currentRole !== '超级管理员'">
            <el-option v-for="m in marketOptions" :key="m" :label="m" :value="m" />
          </el-select>
        </el-form-item>
        <el-form-item label="商户名称">
          <el-select v-model="filters.merchant" placeholder="请选择商户" clearable size="large" filterable>
            <el-option v-for="m in merchantOptions" :key="m" :label="m" :value="m" />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select v-model="filters.brand" placeholder="请选择品牌车系车型" clearable size="large" filterable>
            <el-option label="丰田" value="丰田" />
            <el-option label="奔驰" value="奔驰" />
            <el-option label="宝马" value="宝马" />
            <el-option label="大众" value="大众" />
            <el-option label="奥迪" value="奥迪" />
            <el-option label="本田" value="本田" />
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input v-model="filters.plate" placeholder="请输入车牌号码" clearable size="large" />
        </el-form-item>

        <el-form-item label="车辆状态">
          <el-select v-model="filters.vehicleStatus" placeholder="全部" clearable size="large">
            <el-option label="在库" value="在库" />
            <el-option label="已上架" value="已上架" />
            <el-option label="已出库" value="已出库" />
          </el-select>
        </el-form-item>
        <el-form-item label="能源类型">
          <el-select v-model="filters.energyType" placeholder="全部" clearable size="large">
            <el-option label="燃油" value="燃油" />
            <el-option label="纯电动" value="纯电动" />
            <el-option label="插电混动" value="插电混动" />
            <el-option label="油电混动" value="油电混动" />
          </el-select>
        </el-form-item>
        <el-form-item label="冻结状态">
          <el-select v-model="filters.freezeStatus" placeholder="全部" clearable size="large">
            <el-option label="已冻结" value="frozen" />
            <el-option label="未冻结" value="none" />
          </el-select>
        </el-form-item>
        <el-form-item label="冻结来源">
          <el-select v-model="filters.freezeSource" placeholder="全部" size="large">
            <el-option label="全部" value="" />
            <el-option label="手动冻结" value="manual" />
            <el-option label="金融质押冻结" value="finance_pledge" />
            <el-option label="合同到期冻结" value="contract" />
            <el-option label="金融管控冻结" value="finance_ctrl" />
          </el-select>
        </el-form-item>

        <el-form-item label="金融冻结渠道">
          <el-select v-model="filters.financeChannel" placeholder="全部" size="large">
            <el-option label="全部" value="" />
            <el-option label="宜商行" value="宜商行" />
            <el-option label="鑫易蓉" value="鑫易蓉" />
            <el-option label="邮储银行" value="邮储银行" />
            <el-option label="浙商智合贷" value="浙商智合贷" />
            <el-option label="泸州银行" value="泸州银行" />
          </el-select>
        </el-form-item>

        <!-- 扩展筛选项 -->
        <template v-if="showMore">
          <el-form-item label="质押状态">
            <el-select v-model="filters.pledgeStatus" placeholder="全部" clearable size="large">
              <el-option label="已质押" value="pledged" />
              <el-option label="未质押" value="none" />
            </el-select>
          </el-form-item>
          <el-form-item label="车架号">
            <el-input v-model="filters.vin" placeholder="请输入车架号后六位" clearable size="large" />
          </el-form-item>
          <el-form-item label="RFID">
            <el-input v-model="filters.rfid" placeholder="请输入RFID" clearable size="large" />
          </el-form-item>
          <el-form-item label="绑定RFID">
            <el-select v-model="filters.rfidBound" placeholder="全部" clearable size="large">
              <el-option label="已绑定" value="bound" />
              <el-option label="未绑定" value="unbound" />
            </el-select>
          </el-form-item>
          <el-form-item label="零售价">
            <el-select v-model="filters.priceRange" placeholder="全部" clearable size="large">
              <el-option label="10万以下" value="0-10" />
              <el-option label="10-30万" value="10-30" />
              <el-option label="30-50万" value="30-50" />
              <el-option label="50万以上" value="50+" />
            </el-select>
          </el-form-item>
          <el-form-item label="检测状态">
            <el-select v-model="filters.inspectStatus" placeholder="全部" clearable size="large">
              <el-option label="已检测" value="inspected" />
              <el-option label="未检测" value="none" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否评估价">
            <el-select v-model="filters.isEvalPrice" placeholder="全部" clearable size="large">
              <el-option label="是" value="yes" />
              <el-option label="否" value="no" />
            </el-select>
          </el-form-item>
          <el-form-item label="评估价">
            <el-input v-model="filters.evalPrice" placeholder="请选择评估价" clearable size="large" />
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select v-model="filters.auditStatus" placeholder="请选择审核状态" clearable size="large">
              <el-option label="待审核" value="pending" />
              <el-option label="已审核" value="approved" />
              <el-option label="已驳回" value="rejected" />
            </el-select>
          </el-form-item>
          <el-form-item label="车源同步状态">
            <el-select v-model="filters.syncStatus" placeholder="全部" clearable size="large">
              <el-option label="已同步" value="synced" />
              <el-option label="未同步" value="none" />
            </el-select>
          </el-form-item>
          <el-form-item label="黑名单车">
            <el-select v-model="filters.blacklist" placeholder="请选择" clearable size="large">
              <el-option label="是" value="yes" />
              <el-option label="否" value="no" />
            </el-select>
          </el-form-item>
          <el-form-item label="库龄期间">
            <el-select v-model="filters.storageAgePeriod" placeholder="全部" clearable size="large">
              <el-option label="30天以内" value="0-30" />
              <el-option label="30-90天" value="30-90" />
              <el-option label="90天以上" value="90+" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间区间" class="vl-date-item">
            <el-date-picker
              v-model="filters.dateRange"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="large"
              style="width: 320px"
            />
          </el-form-item>
        </template>

        <!-- 操作按钮行 -->
        <el-form-item class="vl-search-actions">
          <el-button type="primary" size="large" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button size="large" :icon="Refresh" @click="resetFilters">重置</el-button>
          <el-button type="danger" size="large" plain>批量入库</el-button>
          <el-button type="success" size="large" plain>批量出库</el-button>
          <el-button size="large" :icon="Download" plain>查询数据导出</el-button>
        </el-form-item>
      </el-form>

      <!-- 展开/收起 -->
      <div class="vl-toggle" @click="showMore = !showMore">
        <span>{{ showMore ? '收起筛选' : '展开筛选' }}</span>
        <el-icon class="vl-toggle-icon" :class="{ 'is-up': showMore }"><ArrowDown /></el-icon>
      </div>
    </div>

    <!-- 表格区 -->
    <div class="vl-table-wrap">
      <el-table
        :data="paginatedData"
        border
        style="width: 100%"
        :header-cell-style="{ background: '#F5F7FA', color: '#909399', fontWeight: 'bold', textAlign: 'center' }"
      >
        <el-table-column label="首图" width="110" align="center">
          <template #default="scope">
            <el-image :src="scope.row.image" class="vl-thumb" fit="cover"
              :preview-src-list="[scope.row.image]" preview-teleported />
          </template>
        </el-table-column>

        <el-table-column label="车辆信息" min-width="220">
          <template #default="scope">
            <div class="vl-car-info">
              <div class="vl-car-name">{{ scope.row.name }}</div>
              <div class="vl-car-vin">
                车架号：{{ scope.row.vin }}
                <el-button type="primary" link size="small" @click="copyText(scope.row.vin)">复制</el-button>
              </div>
              <div class="vl-car-market">所属市场：{{ scope.row.market }}</div>
              <span v-if="scope.row.engineSize" class="vl-engine-badge">{{ scope.row.engineSize }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="零售价" width="100" align="center">
          <template #default="scope">
            <span class="vl-price">{{ scope.row.price > 0 ? scope.row.price + '万元' : '0万元' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="联系人信息" min-width="160">
          <template #default="scope">
            <div class="vl-contact">
              <div class="vl-contact-name">
                {{ scope.row.merchantContact }}
                <el-tag v-for="tag in scope.row.contactTags" :key="tag" size="small" :type="tag === '合作商' ? 'warning' : 'info'" class="vl-contact-tag">{{ tag }}</el-tag>
              </div>
              <div class="vl-contact-phone">{{ scope.row.merchantPhone }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="车辆状态" width="130" align="center">
          <template #default="scope">
            <div class="vl-status">
              <div class="vl-status-text">{{ scope.row.vehicleStatus }}</div>
              <div class="vl-status-age">库龄{{ scope.row.storageAge }}天</div>
              <div class="vl-status-time">{{ scope.row.lastUpdateTime }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="指标状态" width="100" align="center">
          <template #default="scope">
            <span v-if="scope.row.indexStatus">{{ scope.row.indexStatus }}</span>
            <span v-else class="vl-empty">—</span>
          </template>
        </el-table-column>

        <el-table-column label="审核状态" width="100" align="center">
          <template #default="scope">
            <span v-if="scope.row.auditStatus">{{ scope.row.auditStatus }}</span>
            <span v-else class="vl-empty">—</span>
          </template>
        </el-table-column>

        <el-table-column label="管控信息" width="190" align="center">
          <template #default="scope">
            <div class="vl-ctrl-info">
              <!-- 冻结标签（仅冻结车展示） -->
              <template v-if="scope.row.freezeStatus === 'frozen'">
                <span class="vl-freeze-badge">已冻结</span>
                <span class="vl-source-tag">{{ SOURCE_MAP[scope.row.freezeSource] }}</span>
                <span v-if="scope.row.freezeSource === 'manual' && scope.row.freezeReason" class="vl-freeze-reason-tag">{{ scope.row.freezeReason }}</span>
              </template>
              <!-- 所有车辆均展示 -->
              <span v-if="scope.row.rfid" class="vl-rfid-tag">RFID号：{{ scope.row.rfid }}</span>
              <span class="vl-plate-tag" :class="{ 'is-unbound': !scope.row.plate }">
                {{ scope.row.plate ? '车牌号：' + scope.row.plate : '车牌号未绑定' }}
              </span>
              <span class="vl-entry-tag">暂无出入场记录</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="scope">
            <div class="vl-op-btns">
              <el-button type="primary" size="small">查看</el-button>
              <el-dropdown size="small">
                <el-button size="small">更多操作<el-icon class="el-icon--right"><ArrowDown /></el-icon></el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>编辑车辆</el-dropdown-item>
                    <el-dropdown-item>车辆上架</el-dropdown-item>
                    <el-dropdown-item>移库</el-dropdown-item>
                    <el-dropdown-item
                      v-if="!scope.row.freezeStatus"
                      divided
                      @click="handleFreezeVehicle(scope.row)"
                    >冻结车辆</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="vl-pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredData.length"
          background
        />
      </div>
    </div>

    <!-- ===== 冻结车辆弹窗 ===== -->
    <el-dialog v-model="freezeDialogVisible" title="冻结车辆" width="480px" align-center>
      <div v-if="currentFreezeVehicle">
        <el-form :model="freezeForm" label-width="90px">
          <el-form-item label="冻结原因" required>
            <el-select v-model="freezeForm.reason" placeholder="请选择冻结原因" style="width: 100%">
              <el-option
                v-for="item in currentMarketFreezeReasons"
                :key="item.reason"
                :label="item.reason"
                :value="item.reason"
              />
              <el-option label="其他" value="__other__" />
            </el-select>
            <div v-if="!currentMarketFreezeReasons.length" style="margin-top:6px; color:#F56C6C; font-size:12px;">
              该市场暂无冻结原因配置，请先前往冻结车设置添加，或选择"其他"手动输入
            </div>
          </el-form-item>
          <el-form-item v-if="freezeForm.reason === '__other__'" label="手动输入">
            <el-input
              v-model="freezeForm.customReason"
              placeholder="请输入冻结原因"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="freezeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitFreeze">确认冻结</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Refresh, Download, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  currentRole: String,
  currentUserMarket: { type: String, default: null },
  freezeReasonConfigs: { type: Array, default: () => [] },
})

const SOURCE_MAP = {
  manual: '手动冻结',
  finance_pledge: '金融质押冻结',
  contract: '合同到期冻结',
  finance_ctrl: '金融管控冻结',
}

const marketOptions = ['上海信车二手车市场', '北京顺义二手车市场', '郑州智慧车市', '广州南方二手车城']
const merchantOptions = ['上海信车精品车商', '北京顺通二手车', '深圳易车行', '成都华信汽贸']

// ==================== Mock 数据 ====================
const vehicleData = ref([
  // 上海信车 - 手动冻结
  {
    id: 1, name: '奔驰 E300L 2023款 运动版',
    vin: 'WDD2050041A123456', market: '上海信车二手车市场',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=150&fit=crop',
    engineSize: '2.0T', price: 45,
    merchantContact: '王经理', contactTags: ['合作商'], merchantPhone: '138****1001',
    vehicleStatus: '已在库', storageAge: 48, lastUpdateTime: '2026-05-01 10:00',
    storageTime: '2026-05-01 10:00:00',
    freezeStatus: 'frozen', freezeSource: 'manual', rfid: '567890', plate: '沪A·99012',
  },
  {
    id: 5, name: '特斯拉 Model 3 2023款 Performance',
    vin: '5YJ3E1EA4KF100001', market: '上海信车二手车市场',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad42243c59?w=200&h=150&fit=crop',
    engineSize: '纯电', price: 32,
    merchantContact: '张主管', contactTags: [], merchantPhone: '139****2002',
    vehicleStatus: '已在库', storageAge: 20, lastUpdateTime: '2026-05-14 14:00',
    storageTime: '2026-05-14 14:00:00',
    freezeStatus: 'frozen', freezeSource: 'manual', rfid: '678901', plate: '沪B·56789',
  },
  // 上海信车 - 金融管控冻结
  {
    id: 16, name: '奔驰 E300L 2023款 运动版 AMG',
    vin: 'WDD2130562A001001', market: '上海信车二手车市场',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad42243c59?w=200&h=150&fit=crop',
    engineSize: '2.0T', price: 52,
    merchantContact: '王经理', contactTags: ['合作商'], merchantPhone: '138****1001',
    vehicleStatus: '已在库', storageAge: 38, lastUpdateTime: '2026-05-15 09:00',
    storageTime: '2026-05-15 09:00:00',
    freezeStatus: 'frozen', freezeSource: 'finance_ctrl', rfid: '201001', plate: '沪A·88812',
  },
  {
    id: 17, name: '宝马 5系 2022款 525Li M运动套装',
    vin: 'WBAJB0C51JB123002', market: '上海信车二手车市场',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=150&fit=crop',
    engineSize: '2.0T', price: 38,
    merchantContact: '张主管', contactTags: ['合作商'], merchantPhone: '139****2002',
    vehicleStatus: '已在库', storageAge: 35, lastUpdateTime: '2026-05-18 14:30',
    storageTime: '2026-05-18 14:30:00',
    freezeStatus: 'frozen', freezeSource: 'finance_ctrl', rfid: '202002', plate: '沪C·32456',
  },
  // 上海信车 - 合同到期冻结
  {
    id: 19, name: '大众 帕萨特 2023款 330TSI 商务版',
    vin: 'LSVCC2B46MN201001', market: '上海信车二手车市场',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=200&h=150&fit=crop',
    engineSize: '2.0T', price: 18,
    merchantContact: '王经理', contactTags: ['合作商'], merchantPhone: '138****1001',
    vehicleStatus: '已在库', storageAge: 52, lastUpdateTime: '2026-05-01 00:01',
    storageTime: '2026-04-10 08:00:00',
    freezeStatus: 'frozen', freezeSource: 'contract', rfid: '211001', plate: '沪B·11234',
  },
  {
    id: 20, name: '本田 雅阁 2024款 2.0T 锐·耀版',
    vin: 'LHGCR2F59MA201002', market: '上海信车二手车市场',
    image: 'https://images.unsplash.com/photo-1606148332761-348259ca3f81?w=200&h=150&fit=crop',
    engineSize: '2.0T', price: 22,
    merchantContact: '张主管', contactTags: ['合作商'], merchantPhone: '139****2002',
    vehicleStatus: '已在库', storageAge: 45, lastUpdateTime: '2026-05-08 00:01',
    storageTime: '2026-04-18 10:00:00',
    freezeStatus: 'frozen', freezeSource: 'contract', rfid: '212002', plate: '沪A·56789',
  },
  // 其他市场（超管可见）
  {
    id: 201, name: '奥迪 Q5L 2023款 45 TFSI 豪华型',
    vin: 'WAUZZZ8R5NA201001', market: '北京顺义二手车市场',
    image: 'https://images.unsplash.com/photo-1606148332761-348259ca3f81?w=200&h=150&fit=crop',
    engineSize: '2.0T', price: 36,
    merchantContact: '孙经理', contactTags: ['合作商'], merchantPhone: '132****6001',
    vehicleStatus: '已在库', storageAge: 18, lastUpdateTime: '2026-06-05 10:00',
    storageTime: '2026-06-05 10:00:00',
    freezeStatus: 'frozen', freezeSource: 'manual', rfid: '301001', plate: '京A·12001',
  },
  // 上海信车 - 未冻结车辆
  {
    id: 101, name: '丰田 凯美瑞 2024款 2.0 豪华版',
    vin: 'JTNBF3HK5E3021001', market: '上海信车二手车市场',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=200&h=150&fit=crop',
    engineSize: '2.0', price: 19,
    merchantContact: '李经理', contactTags: [], merchantPhone: '136****3001',
    vehicleStatus: '已在库', storageAge: 12, lastUpdateTime: '2026-06-10 10:00',
    storageTime: '2026-06-10 10:00:00',
    freezeStatus: '', freezeSource: '', rfid: '101001', plate: '沪D·33210',
  },
  {
    id: 102, name: '大众 途观L 2023款 330TSI 旗舰版',
    vin: 'LSVAA2B21MN102001', market: '上海信车二手车市场',
    image: 'https://images.unsplash.com/photo-1606148332761-348259ca3f81?w=200&h=150&fit=crop',
    engineSize: '2.0T', price: 24,
    merchantContact: '王经理', contactTags: ['合作商'], merchantPhone: '138****1001',
    vehicleStatus: '已在库', storageAge: 7, lastUpdateTime: '2026-06-15 14:00',
    storageTime: '2026-06-15 14:00:00',
    freezeStatus: '', freezeSource: '', rfid: '102002', plate: '沪E·45678',
  },
])

// ==================== 筛选 ====================
const showMore = ref(false)
const filters = ref({
  market: '', merchant: '', brand: '', plate: '',
  vehicleStatus: '', energyType: '', freezeStatus: '', freezeSource: '', financeChannel: '',
  pledgeStatus: '', vin: '', rfid: '', rfidBound: '',
  priceRange: '', inspectStatus: '', isEvalPrice: '', evalPrice: '',
  auditStatus: '', syncStatus: '', blacklist: '', storageAgePeriod: '',
  dateRange: [],
})

const handleSearch = () => {}
const resetFilters = () => {
  Object.keys(filters.value).forEach(k => { filters.value[k] = Array.isArray(filters.value[k]) ? [] : '' })
}

const copyText = (text) => {
  navigator.clipboard?.writeText(text).catch(() => {})
  ElMessage.success('已复制')
}

const filteredData = computed(() => {
  let data = vehicleData.value

  // 数据范围
  if (props.currentRole !== '超级管理员' && props.currentUserMarket) {
    data = data.filter(v => v.market === props.currentUserMarket)
  }

  if (filters.value.market) data = data.filter(v => v.market === filters.value.market)
  if (filters.value.merchant) data = data.filter(v => v.merchantContact.includes(filters.value.merchant))
  if (filters.value.plate) data = data.filter(v => v.plate && v.plate.includes(filters.value.plate))
  if (filters.value.vehicleStatus) data = data.filter(v => v.vehicleStatus === filters.value.vehicleStatus)
  if (filters.value.freezeStatus === 'frozen') data = data.filter(v => v.freezeStatus === 'frozen')
  if (filters.value.freezeStatus === 'none') data = data.filter(v => !v.freezeStatus)
  if (filters.value.freezeSource) data = data.filter(v => v.freezeSource === filters.value.freezeSource)
  if (filters.value.vin) data = data.filter(v => v.vin.toUpperCase().includes(filters.value.vin.toUpperCase()))
  if (filters.value.rfid) data = data.filter(v => v.rfid && v.rfid.includes(filters.value.rfid))

  return data
})

// ==================== 分页 ====================
const currentPage = ref(1)
const pageSize = ref(10)
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

// ==================== 冻结车辆 ====================
const freezeDialogVisible = ref(false)
const currentFreezeVehicle = ref(null)
const freezeForm = ref({ reason: '', customReason: '', description: '' })

const currentMarketFreezeReasons = computed(() => {
  if (!currentFreezeVehicle.value) return []
  return props.freezeReasonConfigs.filter(c => c.market === currentFreezeVehicle.value.market)
})

const handleFreezeVehicle = (row) => {
  currentFreezeVehicle.value = row
  freezeForm.value = { reason: '', customReason: '', description: '' }
  freezeDialogVisible.value = true
}

const submitFreeze = () => {
  const finalReason = freezeForm.value.reason === '__other__'
    ? freezeForm.value.customReason.trim()
    : freezeForm.value.reason
  if (!finalReason) {
    return ElMessage.warning('请选择或填写冻结原因')
  }
  const vehicle = vehicleData.value.find(v => v.id === currentFreezeVehicle.value.id)
  if (vehicle) {
    vehicle.freezeStatus = 'frozen'
    vehicle.freezeSource = 'manual'
    vehicle.freezeReason = finalReason
  }
  ElMessage.success('车辆冻结成功')
  freezeDialogVisible.value = false
}
</script>

<style scoped>
.vl-page {
  background: #f9fafb;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 12px 0;
}

/* 筛选区 */
.vl-filter-wrap {
  background: #f2f2f2;
  padding: 20px 0 0;
  border-bottom: 1px solid #e8e8e8;
}
.vl-filter-form {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}
:deep(.vl-filter-form .el-form-item) {
  margin-right: 0;
  margin-bottom: 20px;
  margin-left: 0;
  padding: 0 12px;
}
:deep(.vl-filter-form .el-form-item__label) {
  width: 90px !important;
  justify-content: flex-end;
  height: 40px;
  line-height: 40px;
  padding-right: 12px;
  color: #606266;
  font-size: 14px;
  white-space: nowrap;
}
:deep(.vl-filter-form .el-select .el-select__wrapper),
:deep(.vl-filter-form .el-input) { width: 200px; }
.vl-date-item :deep(.el-input) { width: 320px; }
.vl-search-actions {
  flex-basis: 100%;
}
:deep(.vl-filter-form .vl-search-actions .el-form-item__content) {
  margin-left: 102px !important;
  display: flex;
  gap: 12px;
}
.vl-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 0;
  cursor: pointer;
  font-size: 13px;
  color: #409eff;
  border-top: 1px solid #e8e8e8;
  user-select: none;
}
.vl-toggle-icon { transition: transform 0.2s; }
.vl-toggle-icon.is-up { transform: rotate(180deg); }

/* 表格区 */
.vl-table-wrap {
  flex: 1;
  padding: 16px 0;
  background: #f9fafb;
  overflow: auto;
}
.vl-thumb { width: 80px; height: 60px; border-radius: 4px; }
.vl-car-info { padding: 2px 0; }
.vl-car-name { font-size: 14px; font-weight: bold; color: #303133; margin-bottom: 4px; }
.vl-car-vin { font-size: 12px; color: #606266; margin-bottom: 2px; }
.vl-car-market { font-size: 12px; color: #909399; margin-bottom: 4px; }
.vl-engine-badge {
  display: inline-block;
  background: #ecf5ff;
  color: #409eff;
  border: 1px solid #b3d8ff;
  border-radius: 3px;
  font-size: 11px;
  padding: 1px 6px;
}
.vl-price { font-size: 14px; color: #303133; font-weight: 500; }
.vl-contact-name { font-size: 14px; color: #303133; margin-bottom: 4px; }
.vl-contact-tag { margin-left: 4px; }
.vl-contact-phone { font-size: 12px; color: #909399; }
.vl-status { text-align: center; }
.vl-status-text { font-size: 13px; color: #67c23a; font-weight: 500; margin-bottom: 2px; }
.vl-status-age { font-size: 12px; color: #909399; margin-bottom: 2px; }
.vl-status-time { font-size: 12px; color: #909399; }
.vl-empty { color: #c0c4cc; }

/* 管控信息 */
.vl-ctrl-info { display: flex; flex-direction: column; align-items: center; gap: 5px; }
.vl-freeze-badge {
  display: inline-block;
  background: #f56c6c;
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 10px;
  border-radius: 3px;
}
.vl-source-tag {
  display: inline-block;
  background: #fef0f0;
  border: 1px solid #fbc4c4;
  color: #f56c6c;
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 3px;
}
.vl-rfid-tag {
  display: inline-block;
  background: #f0fff4;
  border: 1px solid #95de9a;
  color: #52c41a;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 3px;
}
.vl-plate-tag {
  display: inline-block;
  background: #e6f4ff;
  border: 1px solid #91caff;
  color: #1677ff;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 3px;
}
.vl-plate-tag.is-unbound {
  background: #e6f4ff;
  border-color: #91caff;
  color: #1677ff;
}
.vl-entry-tag {
  display: inline-block;
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  color: #bfbfbf;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 4px;
}

/* 操作列 */
.vl-op-btns { display: flex; flex-direction: column; align-items: center; gap: 6px; }

/* 分页 */
.vl-pagination { margin-top: 16px; display: flex; justify-content: flex-end; }

/* 冻结原因标签 */
.vl-freeze-reason-tag {
  display: inline-block;
  background: #fff7e6;
  border: 1px solid #ffd591;
  color: #d46b08;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

/* 冻结弹窗 */
.vl-freeze-vehicle-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #eef0f3;
}
.vl-freeze-car-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}
.vl-freeze-car-vin {
  font-size: 13px;
  color: #909399;
  font-family: monospace;
}
</style>
