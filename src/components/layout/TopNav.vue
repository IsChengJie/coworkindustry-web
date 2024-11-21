<template>
  <div class="top-nav-container">
    <div class="top-nav">
      <div class="logo-container">
        <router-link to="/" class="logo">
          <span class="logo-text">

            <span class="company-name">Coworkindustry</span>
          </span>
        </router-link>
      </div>

      <nav class="nav-items">   
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: route.path.startsWith(item.path) }"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <div class="right-section">
        <el-button class="notification-btn" circle>
          <el-icon><Bell /></el-icon>
        </el-button>
        
        <el-dropdown trigger="click">
          <el-avatar :size="32" src="https://avatars.githubusercontent.com/u/1234567?v=4" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>Profile</el-dropdown-item>
              <el-dropdown-item>Settings</el-dropdown-item>
              <el-dropdown-item divided>Logout</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bell } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { path: '/visitors', label: 'Visitors' },
  { path: '/employees', label: 'Employees' },
  { path: '/spaces', label: 'Spaces' },
  { path: '/deliveries', label: 'Deliveries' },
  { path: '/settings', label: 'Settings' }
]
</script>

<style scoped lang="scss">
.top-nav-container {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.top-nav {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  margin: 0 auto;
  max-width: 1440px;
}

.logo-container {
  margin-right: 48px;
  padding: 12px 0;
}

.logo {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.company-name {
  font-size: 20px;
  font-weight: 700;
  color: #FF5722;
  letter-spacing: -0.5px;
  line-height: 1;
  text-transform: lowercase;
}

.nav-items {
  display: flex;
  align-items: center;
  gap: 32px;
  height: 100%;
}

.nav-item {
  position: relative;
  height: 64px;
  line-height: 64px;
  padding: 0;
  color: #4b5563;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #111827;
  }

  &.active {
    color: #111827;
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #FF5722;
    }
  }
}

.right-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.notification-btn {
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  background: transparent;
  color: #6b7280;
  
  &:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
}

:deep(.el-avatar) {
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #e5e7eb;
  }
}

:deep(.el-dropdown-menu) {
  padding: 4px 0;
  
  .el-dropdown-menu__item {
    padding: 8px 16px;
    font-size: 14px;
    line-height: 1.5;
    
    &:hover {
      background-color: #f3f4f6;
      color: #111827;
    }
  }
}
</style> 