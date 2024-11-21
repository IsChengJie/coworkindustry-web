<template>
  <div class="settings-container">
    <!-- 左侧菜单栏 -->
    <div class="settings-menu">
      <el-menu
        :default-active="activeMenu"
        class="settings-menu-vertical"
        :router="true">
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
        <el-menu-item index="/settings/agreements">
          <el-icon><Document /></el-icon>
          <span>协议库</span>
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
import { User, Lock, Bell, Brush, Document } from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
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