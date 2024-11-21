<template>
  <div class="settings-container">
    <!-- 左侧菜单栏 -->
    <div class="settings-menu">
      <el-menu
        :default-active="activeMenu"
        class="settings-menu-vertical"
        router>
        <el-menu-item index="/settings/profile">
          <el-icon><User /></el-icon>
          <span>个人信息</span>
        </el-menu-item>
        <el-menu-item index="/settings/security">
          <el-icon><Lock /></el-icon>
          <span>安全设置</span>
        </el-menu-item>
        <el-menu-item index="/settings/notification">
          <el-icon><Bell /></el-icon>
          <span>通知设置</span>
        </el-menu-item>
        <el-menu-item index="/settings/appearance">
          <el-icon><Brush /></el-icon>
          <span>外观设置</span>
        </el-menu-item>
        <el-menu-item index="/settings/devices">
          <el-icon><Monitor /></el-icon>
          <span>设备管理</span>
        </el-menu-item>
        <el-menu-item index="/settings/locations">
          <el-icon><Location /></el-icon>
          <span>位置管理</span>
        </el-menu-item>
        <el-menu-item index="/settings/spaces">
          <el-icon><Collection /></el-icon>
          <span>空间管理</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 右侧内容区 -->
    <div class="settings-content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  User, 
  Lock, 
  Bell, 
  Brush, 
  Monitor, 
  Location,
  Management as Collection,
  Menu as Grid,
  Box,
  Document as Files
} from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => {
  if (route.path.startsWith('/settings/spaces/')) {
    return 'spaces'
  }
  return route.path
})
</script>

<style scoped>
.settings-container {
  display: flex;
  min-height: calc(100vh - 60px);
  background-color: #f5f7fa;
}

.settings-menu {
  width: 200px;
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
}

.settings-menu-vertical {
  border-right: none;
}

.settings-content {
  flex: 1;
  padding: 20px;
  background-color: #fff;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-menu-item-group__title) {
  padding: 0;
}

:deep(.el-menu-item) {
  .el-icon {
    margin-right: 8px;
  }
}

:deep(.el-sub-menu .el-menu-item) {
  min-width: auto;
  padding-left: 50px !important;
}

@media (max-width: 768px) {
  .settings-container {
    flex-direction: column;
  }

  .settings-menu {
    width: 100%;
    margin-bottom: 20px;
  }

  .settings-content {
    margin: 0;
    padding: 16px;
  }
}
</style> 