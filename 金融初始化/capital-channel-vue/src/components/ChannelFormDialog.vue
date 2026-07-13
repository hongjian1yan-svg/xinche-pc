<template>
  <el-dialog
    :title="mode === 'add' ? '新增资金渠道' : '编辑资金渠道'"
    :visible.sync="localVisible"
    width="560px"
    :close-on-click-modal="false"
    @open="initForm"
    @closed="resetForm"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="110px" size="small">
      <el-form-item label="所属市场" prop="market">
        <el-select
          v-model="form.market"
          placeholder="请选择所属市场"
          style="width:100%;"
          :disabled="isMarketLocked"
          @change="onMarketChange"
        >
          <el-option v-for="m in marketOptions" :key="m" :label="m" :value="m" />
        </el-select>
      </el-form-item>
      <el-form-item label="渠道名称" prop="channelName">
        <el-input
          v-model="form.channelName"
          placeholder="请输入渠道名称"
          maxlength="50"
          show-word-limit
          :disabled="mode === 'edit'"
        />
      </el-form-item>
      <el-form-item label="所属金融公司" prop="company">
        <el-select
          v-model="form.company"
          placeholder="请选择金融公司"
          style="width:100%;"
          :disabled="isCompanyLocked"
        >
          <el-option v-for="c in availableCompanies" :key="c" :label="c" :value="c" />
        </el-select>
      </el-form-item>
      <el-form-item label="放款比例" prop="loanRatio">
        <el-input
          v-model.number="form.loanRatio"
          placeholder="请输入放款比例(1-100)"
          :disabled="hasOrders"
          style="width:200px;"
        >
          <template slot="append">%</template>
        </el-input>
        <span v-if="hasOrders" style="color:#909399;font-size:12px;margin-left:8px;">存在订单，不可修改</span>
      </el-form-item>
      <el-form-item label="车辆评估选项" prop="evalType">
        <el-radio-group v-model="form.evalType" :disabled="hasOrders">
          <el-radio label="auto">自动评估</el-radio>
          <el-radio label="manual">人工评估</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.evalType === 'auto'" label="评估平台" prop="platforms">
        <el-select
          v-model="form.platforms"
          multiple
          placeholder="请选择评估平台"
          style="width:100%;"
          :disabled="hasOrders"
        >
          <el-option label="精真估" value="精真估" />
          <el-option label="车300" value="车300" />
          <el-option label="大圣检测" value="大圣检测" />
        </el-select>
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button size="small" @click="localVisible = false">取消</el-button>
      <el-button type="primary" size="small" @click="handleSubmit">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { marketOptions } from '@/data/mockData'

export default {
  name: 'ChannelFormDialog',
  props: {
    visible: { type: Boolean, default: false },
    mode: { type: String, default: 'add' },
    channelData: { type: Object, default: null },
    lockedMarket: { type: String, default: '' },
    lockedCompany: { type: String, default: '' }
  },
  data() {
    return {
      marketOptions,
      form: {
        market: '',
        channelName: '',
        company: '',
        loanRatio: '',
        evalType: 'auto',
        platforms: []
      },
      rules: {
        market: [{ required: true, message: '请选择所属市场', trigger: 'change' }],
        channelName: [
          { required: true, message: '请输入渠道名称', trigger: 'blur' },
          { validator: this.validateChannelName, trigger: 'blur' }
        ],
        company: [{ required: true, message: '请选择所属金融公司', trigger: 'change' }],
        loanRatio: [
          { required: true, message: '请输入放款比例', trigger: 'blur' },
          { validator: this.validateLoanRatio, trigger: 'blur' }
        ],
        evalType: [{ required: true, message: '请选择车辆评估方式', trigger: 'change' }],
        platforms: [{ validator: this.validatePlatforms, trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapState(['companies', 'channels']),
    localVisible: {
      get() { return this.visible },
      set(val) { this.$emit('update:visible', val) }
    },
    isMarketLocked() {
      return !!this.lockedMarket || this.mode === 'edit'
    },
    isCompanyLocked() {
      return !!this.lockedCompany || this.mode === 'edit'
    },
    hasOrders() {
      if (this.mode !== 'edit' || !this.channelData) return false
      return this.channelData.hasOrders
    },
    availableCompanies() {
      return this.companies
        .filter(c => !this.form.market || c.market === this.form.market)
        .map(c => c.name)
    }
  },
  methods: {
    initForm() {
      if (this.lockedMarket) {
        this.form.market = this.lockedMarket
      }
      if (this.lockedCompany) {
        this.form.company = this.lockedCompany
      }
      if (this.mode === 'edit' && this.channelData) {
        this.form = {
          market: this.channelData.market || '',
          channelName: this.channelData.channelName || '',
          company: this.channelData.company || '',
          loanRatio: this.channelData.loanRatio || '',
          evalType: this.channelData.evalType || 'auto',
          platforms: this.channelData.platforms ? [...this.channelData.platforms] : []
        }
      }
    },
    resetForm() {
      this.form = { market: '', channelName: '', company: '', loanRatio: '', evalType: 'auto', platforms: [] }
      this.$nextTick(() => {
        if (this.$refs.form) this.$refs.form.clearValidate()
      })
    },
    onMarketChange() {
      if (!this.isCompanyLocked) {
        this.form.company = ''
      }
    },
    validateChannelName(rule, value, callback) {
      if (!value) { callback(); return }
      const exists = this.channels.some(c => {
        if (this.mode === 'edit' && this.channelData && c.id === this.channelData.id) return false
        return c.channelName === value
      })
      if (exists) {
        callback(new Error('渠道名称已存在，请更换'))
      } else {
        callback()
      }
    },
    validateLoanRatio(rule, value, callback) {
      const n = Number(value)
      if (isNaN(n) || n < 1 || n > 100) {
        callback(new Error('请输入1-100之间的数字'))
      } else {
        callback()
      }
    },
    validatePlatforms(rule, value, callback) {
      if (this.form.evalType === 'auto' && (!value || value.length === 0)) {
        callback(new Error('自动评估时请至少选择一个评估平台'))
      } else {
        callback()
      }
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        const payload = { ...this.form }
        if (payload.evalType === 'manual') {
          payload.platforms = []
        }
        if (this.mode === 'add') {
          this.$store.commit('ADD_CHANNEL', payload)
          this.$message.success('新增成功')
        } else {
          this.$store.commit('UPDATE_CHANNEL', { ...this.channelData, ...payload })
          this.$message.success('编辑成功')
        }
        this.localVisible = false
        this.$emit('saved')
      })
    }
  }
}
</script>
