<template>
  <div id="layout">
    <!-- 左侧侧边栏 -->
    <aside class="sidebar">
      <div class="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="4" fill="#409EFF"/>
          <path d="M4 16L8 10L12 13L16 7L20 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="logo-text">智慧车市</span>
      </div>
      <el-menu
        :default-active="$route.path"
        router
        background-color="#ffffff"
        text-color="#303133"
        active-text-color="#409EFF"
        unique-opened
      >
        <el-submenu index="car-market">
          <template slot="title">
            <i class="el-icon-office-building"></i>
            <span>车市管理</span>
          </template>
          <el-menu-item index="/market-list">市场列表</el-menu-item>
        </el-submenu>
        <el-submenu index="storage">
          <template slot="title">
            <i class="el-icon-coin"></i>
            <span>库容管理</span>
          </template>
          <el-menu-item index="/financial-init">金融初始化管理</el-menu-item>
        </el-submenu>
      </el-menu>
    </aside>

    <!-- 右侧主体 -->
    <div class="main-wrapper">
      <!-- 顶部 Header -->
      <header class="top-header">
        <div class="header-left">
          <span class="market-name">泸州汽车交易市场</span>
        </div>
        <div class="header-right">
          <el-button size="small" icon="el-icon-sort">切换角色</el-button>
          <div class="user-avatar">王</div>
          <span class="user-name">王晓明</span>
          <el-tag size="small" type="danger" class="role-tag">超级管理员</el-tag>
        </div>
      </header>

      <!-- 内容区 -->
      <main class="content-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #F2F4F5;
  color: #303133;
}

#layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 180px;
  min-width: 180px;
  background: #fff;
  border-right: 1px solid #EBEEF5;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 16px;
  height: 60px;
  border-bottom: 1px solid #EBEEF5;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.sidebar .el-menu {
  border-right: none;
  flex: 1;
}

.sidebar .el-menu-item {
  height: 40px;
  line-height: 40px;
  font-size: 13px;
  padding-left: 40px !important;
}

.sidebar .el-submenu__title {
  height: 44px;
  line-height: 44px;
  font-size: 13px;
}

.sidebar .el-menu-item.is-active {
  background: #ECF5FF !important;
  color: #409EFF !important;
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-header {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #EBEEF5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
  z-index: 100;
}

.header-left .market-name {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: #409EFF;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
}

.user-name {
  font-size: 14px;
  color: #303133;
}

.role-tag {
  font-size: 11px;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: #F2F4F5;
  padding: 20px;
}

/* 全局通用样式 */
.page-card {
  background: #fff;
  border-radius: 4px;
  border: 1px solid #EBEEF5;
}

.filter-bar {
  background: #F7F8FA;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.filter-bar .el-input,
.filter-bar .el-select,
.filter-bar .el-date-editor {
  width: 160px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  padding-left: 10px;
  border-left: 3px solid #409EFF;
  margin-bottom: 12px;
}

.el-table th {
  background: #F5F7FA !important;
  color: #606266;
  font-weight: 500;
}

.module-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.module-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}
</style>
