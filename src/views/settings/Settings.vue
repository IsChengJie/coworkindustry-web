<template>
  <div class="settings">
    <h2>Settings</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Profile" name="profile">
        <el-form :model="profileForm" :rules="profileRules" ref="profileFormRef" label-width="120px">
          <el-form-item label="Email" prop="email">
            <el-input v-model="profileForm.email" disabled />
          </el-form-item>
          <el-form-item label="Name" prop="name">
            <el-input v-model="profileForm.name" />
          </el-form-item>
          <el-form-item label="Phone" prop="phone">
            <el-input v-model="profileForm.phone" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateProfile">Update Profile</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Change Password" name="password">
        <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="120px">
          <el-form-item label="Current Password" prop="currentPassword">
            <el-input v-model="passwordForm.currentPassword" type="password" />
          </el-form-item>
          <el-form-item label="New Password" prop="newPassword">
            <el-input v-model="passwordForm.newPassword" type="password" />
          </el-form-item>
          <el-form-item label="Confirm Password" prop="confirmPassword">
            <el-input v-model="passwordForm.confirmPassword" type="password" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changePassword">Change Password</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const activeTab = ref('profile')

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
</script>

<style scoped>
.settings {
  padding: 20px;
}

.el-tabs {
  margin-top: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}
</style> 