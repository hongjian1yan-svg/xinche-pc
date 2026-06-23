<template>
  <div>
    <div class="page-card" style="padding: 20px;">
      <div class="module-header" style="margin-bottom: 16px;">
        <span class="module-title">市场列表</span>
      </div>

      <!-- 筛选区 -->
      <div class="filter-bar">
        <el-input v-model="filter.name" placeholder="市场名称" clearable size="small" />
        <el-select v-model="filter.status" placeholder="市场状态" clearable size="small">
          <el-option label="全部" value="" />
          <el-option label="正常" value="正常" />
          <el-option label="停用" value="停用" />
        </el-select>
        <el-select v-model="filter.type" placeholder="市场类型" clearable size="small">
          <el-option label="全部" value="" />
          <el-option label="场内市场" value="场内市场" />
          <el-option label="场外市场" value="场外市场" />
        </el-select>
        <el-date-picker
          v-model="filter.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
          style="width: 240px;"
        />
        <el-button type="primary" size="small" @click="doSearch">查询</el-button>
        <el-button size="small" @click="doReset">重置</el-button>
      </div>

      <!-- 表格 -->
      <el-table :data="pagedData" border style="width:100%" size="small">
        <el-table-column prop="id" label="市场ID" width="80" />
        <el-table-column prop="name" label="市场名称" min-width="160" />
        <el-table-column prop="phone" label="服务电话" width="140" />
        <el-table-column prop="address" label="市场地址" min-width="260" align="left" />
        <el-table-column prop="type" label="市场类型" width="100" />
        <el-table-column label="负责人信息" width="140">
          <template slot-scope="{ row }">
            <div>{{ row.owner }}</div>
            <div style="color: #909399; font-size: 12px;">{{ row.ownerPhone }}</div>
          </template>
        </el-table-column>
        <el-table-column label="市场状态" width="90">
          <template slot-scope="{ row }">
            <el-tag :type="row.status === '正常' ? 'success' : 'info'" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" width="120" />
        <el-table-column label="操作" width="140" fixed="right">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="goConfig(row)">编辑</el-button>
            <el-dropdown size="small" trigger="click" @command="(cmd) => handleMoreAction(cmd, row)">
              <el-button type="text" size="small" style="margin-left:4px">更多操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="row.status === '正常' ? 'disable' : 'enable'">
                  {{ row.status === '正常' ? '停用' : '启用' }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div style="display:flex; justify-content:flex-end; margin-top:16px;">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="filteredData.length"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          small
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MarketList',
  data() {
    return {
      filter: { name: '', status: '', type: '', dateRange: null },
      activeFilter: { name: '', status: '', type: '', dateRange: null },
      currentPage: 1,
      pageSize: 10
    }
  },
  computed: {
    ...mapState(['markets']),
    filteredData() {
      return this.markets.filter(m => {
        const f = this.activeFilter
        if (f.name && !m.name.includes(f.name)) return false
        if (f.status && m.status !== f.status) return false
        if (f.type && m.type !== f.type) return false
        if (f.dateRange && f.dateRange.length === 2) {
          const d = new Date(m.created)
          if (d < f.dateRange[0] || d > f.dateRange[1]) return false
        }
        return true
      })
    },
    pagedData() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.filteredData.slice(start, start + this.pageSize)
    }
  },
  methods: {
    doSearch() {
      this.activeFilter = JSON.parse(JSON.stringify(this.filter))
      this.currentPage = 1
    },
    doReset() {
      this.filter = { name: '', status: '', type: '', dateRange: null }
      this.activeFilter = { name: '', status: '', type: '', dateRange: null }
      this.currentPage = 1
    },
    goConfig(row) {
      this.$router.push(`/market-config/${row.id}`)
    },
    handleMoreAction(cmd, row) {
      if (cmd === 'disable') {
        this.$confirm(`确认停用「${row.name}」？`, '提示', { type: 'warning' }).then(() => {
          this.$store.commit('UPDATE_MARKET', { ...row, status: '停用' })
          this.$message.success('已停用')
        }).catch(() => {})
      } else if (cmd === 'enable') {
        this.$store.commit('UPDATE_MARKET', { ...row, status: '正常' })
        this.$message.success('已启用')
      }
    }
  }
}
</script>
