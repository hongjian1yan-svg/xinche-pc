<template>
  <div>
    <div class="page-card" style="padding: 24px; max-width: 700px;">
      <div style="font-size:15px;font-weight:600;color:#303133;margin-bottom:24px;">金融系统设置</div>

      <el-form label-width="180px" size="small">
        <!-- 金融系统开关 -->
        <el-form-item label="金融系统：">
          <el-switch v-model="form.financeEnabled" active-text="开启" inactive-text="关闭" />
        </el-form-item>

        <!-- 金融订单编号前缀 -->
        <el-form-item label="金融订单编号前缀：">
          <div style="display:flex;align-items:center;gap:8px;">
            <el-input
              v-model="form.orderPrefix"
              :disabled="!isEditable"
              style="width:240px;"
              placeholder="请输入前缀"
            />
            <svg v-if="!isEditable" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:#909399;flex-shrink:0;">
              <path d="M11.5 7H4.5C3.67 7 3 7.67 3 8.5V12.5C3 13.33 3.67 14 4.5 14H11.5C12.33 14 13 13.33 13 12.5V8.5C13 7.67 12.33 7 11.5 7Z" stroke="#909399" stroke-width="1.2"/>
              <path d="M5.5 7V4.5C5.5 3.12 6.62 2 8 2C9.38 2 10.5 3.12 10.5 4.5V7" stroke="#909399" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
          </div>
          <div style="margin-top:6px;color:#909399;font-size:12px;line-height:1.6;">
            用于生成该市场的金融订单编号，设置后不可修改<br/>
            金融编号示例：XCJR20260101001
          </div>
        </el-form-item>

        <!-- 用款申请车辆评估 -->
        <el-form-item label="用款申请车辆评估：">
          <div class="segmented-radio">
            <label
              v-for="opt in [{ label: '开启', value: true }, { label: '关闭', value: false }]"
              :key="opt.label"
              :class="['seg-item', form.evalEnabled === opt.value ? 'active' : '']"
              @click="form.evalEnabled = opt.value"
            >{{ opt.label }}</label>
          </div>
        </el-form-item>

        <!-- 评估平台 -->
        <el-form-item label="评估平台：">
          <el-select v-model="form.platforms" multiple placeholder="请选择评估平台" style="width:300px;">
            <el-option label="精真估" value="精真估" />
            <el-option label="车300" value="车300" />
            <el-option label="大圣检测" value="大圣检测" />
          </el-select>
        </el-form-item>

        <!-- 申请金额 -->
        <el-form-item label="申请金额：">
          <div class="segmented-radio">
            <label
              v-for="opt in [{ label: '保留小数点后两位', value: '2' }, { label: '保留小数点后一位', value: '1' }]"
              :key="opt.value"
              :class="['seg-item', form.decimalPlaces === opt.value ? 'active' : '']"
              @click="form.decimalPlaces = opt.value"
            >{{ opt.label }}</label>
          </div>
        </el-form-item>

        <!-- 用款二次审核 -->
        <el-form-item label="用款二次审核：">
          <div class="segmented-radio">
            <label
              v-for="opt in [{ label: '开启', value: true }, { label: '关闭', value: false }]"
              :key="opt.label"
              :class="['seg-item', form.secondReview === opt.value ? 'active' : '']"
              @click="form.secondReview = opt.value"
            >{{ opt.label }}</label>
          </div>
        </el-form-item>

        <!-- 临时出场默认限制 -->
        <el-form-item label="临时出场默认限制：">
          <div class="segmented-radio">
            <label
              v-for="opt in [{ label: '一次出入', value: 'once' }, { label: '不限次出入', value: 'unlimited' }]"
              :key="opt.value"
              :class="['seg-item', form.exitLimit === opt.value ? 'active' : '']"
              @click="form.exitLimit = opt.value"
            >{{ opt.label }}</label>
          </div>
        </el-form-item>

        <!-- 底部按钮 -->
        <el-form-item>
          <el-button size="small" @click="$router.push('/market-list')">返回</el-button>
          <el-button type="primary" size="small" @click="handleSave">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MarketConfig',
  data() {
    return {
      form: {
        financeEnabled: true,
        orderPrefix: '',
        evalEnabled: true,
        platforms: ['精真估'],
        decimalPlaces: '1',
        secondReview: false,
        exitLimit: 'once'
      }
    }
  },
  computed: {
    isEditable() {
      return this.$route.params.id === '52a'
    }
  },
  created() {
    if (!this.isEditable) {
      this.form.orderPrefix = 'JHJR'
    }
  },
  methods: {
    handleSave() {
      this.$message.success('保存成功')
    }
  }
}
</script>

<style scoped>
.segmented-radio {
  display: inline-flex;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  overflow: hidden;
}

.seg-item {
  padding: 5px 14px;
  font-size: 13px;
  cursor: pointer;
  color: #606266;
  background: #fff;
  user-select: none;
  transition: all .2s;
}

.seg-item:not(:last-child) {
  border-right: 1px solid #DCDFE6;
}

.seg-item.active {
  background: #409EFF;
  color: #fff;
  border-color: #409EFF;
}

.seg-item:not(.active):hover {
  color: #409EFF;
}
</style>
