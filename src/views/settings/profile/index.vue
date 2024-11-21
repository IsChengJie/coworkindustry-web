<template>
  <div class="settings-section">
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
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus/es/components/form'
import { ElMessage } from 'element-plus'

const profileForm = reactive({
  email: 'user@example.com',
  name: 'John Doe',
  phone: '123-456-7890'
})

const profileRules = reactive({
  name: [
    { required: true, message: 'Please enter your name', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Please enter your phone number', trigger: 'blur' },
    { pattern: /^\d{3}-\d{3}-\d{4}$/, message: 'Please enter a valid phone number', trigger: 'blur' }
  ]
})

const profileFormRef = ref<FormInstance | null>(null)

const updateProfile = async () => {
  if (!profileFormRef.value) return

  try {
    await profileFormRef.value.validate()
    ElMessage.success('Profile updated successfully')
  } catch (error) {
    console.error('Profile update failed:', error)
  }
}
</script> 