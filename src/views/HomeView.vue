<template>
  <div class="home">
    <!-- Header -->
    <el-header class="header">
      <div class="header-left">
        <img src="@/assets/logo.svg" alt="Coworkindustry" class="logo" />
      </div>
      <div class="header-right">
        <el-dropdown trigger="click">
          <span class="user-profile">
            {{ authStore.userInfo?.email }}
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleProfile">Profile</el-dropdown-item>
              <el-dropdown-item @click="handleSettings">Settings</el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">Sign Out</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- Main Content -->
    <el-container class="main-container">
      <!-- Sidebar -->
      <el-aside width="240px" class="sidebar">
        <el-menu
          :default-active="activeMenu"
          class="menu"
          router
        >
          <el-menu-item index="/">
            <el-icon><Grid /></el-icon>
            <span>Dashboard</span>
          </el-menu-item>
          <el-menu-item index="/visitors">
            <el-icon><User /></el-icon>
            <span>Visitors</span>
          </el-menu-item>
          <el-menu-item index="/employees">
            <el-icon><UserFilled /></el-icon>
            <span>Employees</span>
          </el-menu-item>
          <el-menu-item index="/reports">
            <el-icon><Document /></el-icon>
            <span>Reports</span>
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <span>Settings</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- Content Area -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store'
import { ElMessageBox } from 'element-plus'
import {
  Grid,
  User,
  UserFilled,
  Document,
  Setting,
  ArrowDown
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const activeMenu = ref(route.path)

// Watch route changes to update active menu item
watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = newPath
  }
)

// Handle sign out
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to sign out?',
      'Confirmation',
      {
        confirmButtonText: 'Sign Out',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    authStore.logout()
    router.push('/login')
  } catch {
    // User cancelled
  }
}

// Other handlers
const handleProfile = () => {
  // TODO: Implement profile functionality
}

const handleSettings = () => {
  router.push('/settings')
}
</script>

<style scoped>
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.header-left .logo {
  height: 32px;
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #606266;
}

.user-profile .el-icon {
  margin-left: 4px;
}

.main-container {
  flex: 1;
  background-color: #f5f7fa;
}

.sidebar {
  background-color: white;
  border-right: 1px solid #e4e7ed;
}

.menu {
  border-right: none;
}

.main-content {
  padding: 20px;
  overflow-y: auto;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView'
})
</script> 