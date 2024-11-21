<template>
  <div class="settings-container">
    <!-- 左侧菜单栏 -->
    <div class="settings-menu">
      <el-menu
        :default-active="activeMenu"
        class="settings-menu-vertical"
        @select="handleMenuSelect">
        <el-menu-item index="profile">
          <el-icon><User /></el-icon>
          <span>个人信息</span>
        </el-menu-item>
        <el-menu-item index="security">
          <el-icon><Lock /></el-icon>
          <span>安全设置</span>
        </el-menu-item>
        <el-menu-item index="notification">
          <el-icon><Bell /></el-icon>
          <span>通知设置</span>
        </el-menu-item>
        <el-menu-item index="appearance">
          <el-icon><Brush /></el-icon>
          <span>外观设置</span>
        </el-menu-item>
        <el-menu-item index="devices">
          <el-icon><Monitor /></el-icon>
          <span>设备管理</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 右侧内容区 -->
    <div class="settings-content">
      <!-- 个人信息设置 -->
      <div v-show="activeMenu === 'profile'" class="settings-section">
        <h2>个人信息</h2>
        <el-form :model="profileForm" :rules="profileRules" ref="profileFormRef" label-width="120px">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="profileForm.email" disabled />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="profileForm.name" />
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="profileForm.phone" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateProfile">保存修改</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 安全设置 -->
      <div v-show="activeMenu === 'security'" class="settings-section">
        <h2>安全设置</h2>
        <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="120px">
          <el-form-item label="当前密码" prop="currentPassword">
            <el-input v-model="passwordForm.currentPassword" type="password" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="passwordForm.newPassword" type="password" />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="passwordForm.confirmPassword" type="password" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changePassword">修改密码</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 通知设置 -->
      <div v-show="activeMenu === 'notification'" class="settings-section">
        <h2>通知设置</h2>
        <el-form label-width="120px">
          <el-form-item label="邮件通知">
            <el-switch v-model="notificationSettings.email" />
          </el-form-item>
          <el-form-item label="系统通知">
            <el-switch v-model="notificationSettings.system" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveNotificationSettings">保存设置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 外观设置 -->
      <div v-show="activeMenu === 'appearance'" class="settings-section">
        <h2>外观设置</h2>
        <el-form label-width="120px">
          <el-form-item label="主题色">
            <el-color-picker v-model="appearanceSettings.theme" />
          </el-form-item>
          <el-form-item label="字体大小">
            <el-select v-model="appearanceSettings.fontSize">
              <el-option label="小" value="small" />
              <el-option label="中" value="medium" />
              <el-option label="大" value="large" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveAppearanceSettings">保存设置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 设备管理 -->
      <device-management v-show="activeMenu === 'devices'" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock, Bell, Brush, Monitor, Plus } from '@element-plus/icons-vue'
import DeviceManagement from './DeviceManagement.vue'

const activeMenu = ref('profile')

const handleMenuSelect = (index: string) => {
  activeMenu.value = index
}

// Profile form
const profileForm = reactive({
  email: 'user@example.com',
  name: 'John Doe',
  phone: '123-456-7890'
})

const profileRules = reactive<FormRules>({
  name: [
    { required: true, message: 'Please enter your name', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Please enter your phone number', trigger: 'blur' },
    { pattern: /^\d{3}-\d{3}-\d{4}$/, message: 'Please enter a valid phone number', trigger: 'blur' }
  ]
})

const profileFormRef = ref<FormInstance>()

const updateProfile = async () => {
  if (!profileFormRef.value) return

  try {
    await profileFormRef.value.validate()
    // TODO: Implement profile update API call
    ElMessage.success('Profile updated successfully')
  } catch (error) {
    console.error('Profile update failed:', error)
  }
}

// Password form
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = reactive<FormRules>({
  currentPassword: [
    { required: true, message: 'Please enter your current password', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: 'Please enter a new password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm your new password', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (value !== passwordForm.newPassword) {
        callback(new Error('Passwords do not match'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ]
})

const passwordFormRef = ref<FormInstance>()

const changePassword = async () => {
  if (!passwordFormRef.value) return

  try {
    await passwordFormRef.value.validate()
    // TODO: Implement password change API call
    ElMessage.success('Password changed successfully')
  } catch (error) {
    console.error('Password change failed:', error)
  }
}

// 新增通知设置
const notificationSettings = reactive({
  email: true,
  system: true
})

const saveNotificationSettings = () => {
  ElMessage.success('通知设置已保存')
}

// 新增外观设置
const appearanceSettings = reactive({
  theme: '#409EFF',
  fontSize: 'medium'
})

const saveAppearanceSettings = () => {
  ElMessage.success('外观设置已保存')
}
</script>

<style scoped>
.settings-container {
  display: flex;
  min-height: calc(100vh - 60px); /* 假设顶部导航栏高度为60px */
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

.settings-section {
  max-width: 800px;
}

.settings-section h2 {
  margin-bottom: 24px;
  color: #303133;
  font-weight: 500;
}

.el-form-item {
  margin-bottom: 22px;
}

/* 响应式设计 */
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

.devices-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.devices-description {
  color: #666;
  margin: 0;
  flex: 1;
  margin-left: 20px;
  margin-right: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 