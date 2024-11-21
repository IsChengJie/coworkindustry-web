<template>
  <div class="visitor-signin">
    <el-form :model="form" label-width="120px" @submit.prevent="handleSignIn">
      <el-form-item label="姓名" required>
        <el-input v-model="form.name" placeholder="请输入访客姓名"></el-input>
      </el-form-item>
      <el-form-item label="电话" required>
        <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="公司">
        <el-input v-model="form.company" placeholder="请输入公司名称"></el-input>
      </el-form-item>
      <el-form-item label="来访目的">
        <el-input
          v-model="form.purpose"
          type="textarea"
          placeholder="请输入来访目的"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSignIn">签到</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { regularSignIn } from '@/api/visitorService'
import { ElMessage } from 'element-plus'

const form = ref({
  name: '',
  phone: '',
  email: '',
  company: '',
  purpose: ''
})

const handleSignIn = async () => {
  try {
    if (!form.value.name || !form.value.phone) {
      ElMessage.warning('请填写必要信息')
      return
    }

    await regularSignIn(form.value)
    ElMessage.success('签到成功')
    resetForm()
  } catch (error) {
    ElMessage.error('签到失败：' + error.message)
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    phone: '',
    email: '',
    company: '',
    purpose: ''
  }
}
</script> 