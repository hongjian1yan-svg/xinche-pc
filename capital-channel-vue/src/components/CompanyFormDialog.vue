<template>
  <el-dialog
    :title="mode === 'add' ? '新增金融公司' : '编辑金融公司'"
    :visible.sync="localVisible"
    width="560px"
    :close-on-click-modal="false"
    @open="initForm"
    @closed="resetForm"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
      <el-form-item label="所属市场" prop="market">
        <el-select v-model="form.market" placeholder="请选择所属市场" style="width:100%;">
          <el-option v-for="m in marketOptions" :key="m" :label="m" :value="m" />
        </el-select>
      </el-form-item>
      <el-form-item label="公司名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入公司名称" />
      </el-form-item>
      <el-form-item label="负责人" prop="owner">
        <el-input v-model="form.owner" placeholder="请输入负责人姓名" />
      </el-form-item>
      <el-form-item label="负责人电话" prop="ownerPhone">
        <el-input v-model="form.ownerPhone" placeholder="请输入负责人电话" />
      </el-form-item>
      <el-form-item label="证件号码" prop="idNumber">
        <el-input v-model="form.idNumber" placeholder="请输入证件号码（选填）" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入备注（选填）"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="图片信息">
        <el-upload
          action=""
          list-type="picture-card"
          :auto-upload="false"
          :file-list="fileList"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
    </el-form>

    <span slot="footer" style="display:flex;justify-content:flex-end;gap:8px;">
      <el-button size="small" @click="localVisible = false">取消</el-button>
      <el-button
        v-if="mode === 'add'"
        size="small"
        style="color:#409EFF;border-color:#409EFF;"
        @click="handleContinueAddChannel"
      >继续新增资金渠道</el-button>
      <el-button type="primary" size="small" @click="handleSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { marketOptions } from '@/data/mockData'

export default {
  name: 'CompanyFormDialog',
  props: {
    visible: { type: Boolean, default: false },
    mode: { type: String, default: 'add' },
    companyData: { type: Object, default: null }
  },
  data() {
    return {
      marketOptions,
      fileList: [],
      form: {
        market: '',
        name: '',
        owner: '',
        ownerPhone: '',
        idNumber: '',
        remark: '',
        image: null
      },
      rules: {
        market: [{ required: true, message: '请选择所属市场', trigger: 'change' }],
        name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        owner: [{ required: true, message: '请输入负责人姓名', trigger: 'blur' }],
        ownerPhone: [
          { required: true, message: '请输入负责人电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    localVisible: {
      get() { return this.visible },
      set(val) { this.$emit('update:visible', val) }
    }
  },
  methods: {
    initForm() {
      if (this.mode === 'edit' && this.companyData) {
        this.form = {
          market: this.companyData.market || '',
          name: this.companyData.name || '',
          owner: this.companyData.owner || '',
          ownerPhone: this.companyData.ownerPhone || '',
          idNumber: this.companyData.idNumber || '',
          remark: this.companyData.remark || '',
          image: this.companyData.image || null
        }
      } else {
        this.resetForm()
      }
    },
    resetForm() {
      this.form = { market: '', name: '', owner: '', ownerPhone: '', idNumber: '', remark: '', image: null }
      this.fileList = []
      this.$nextTick(() => {
        if (this.$refs.form) this.$refs.form.clearValidate()
      })
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList
    },
    handleFileRemove(file, fileList) {
      this.fileList = fileList
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.saveCompany()
        this.localVisible = false
        this.$emit('saved')
        this.$message.success(this.mode === 'add' ? '新增成功' : '编辑成功')
      })
    },
    saveCompany() {
      if (this.mode === 'add') {
        this.$store.commit('ADD_COMPANY', { ...this.form })
      } else {
        this.$store.commit('UPDATE_COMPANY', { ...this.companyData, ...this.form })
      }
    },
    handleContinueAddChannel() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.saveCompany()
        this.localVisible = false
        this.$emit('saved')
        // 获取刚新增的公司（最后一条）
        const companies = this.$store.state.companies
        const newCompany = companies[companies.length - 1]
        this.$emit('add-channel', newCompany)
      })
    }
  }
}
</script>
