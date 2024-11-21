<template>
  <div class="quick-signin">
    <el-form :model="form" label-width="120px" @submit.prevent="handleQuickSignIn">
      <el-form-item label="姓名" required>
        <el-input v-model="form.name" placeholder="请输入访客姓名"></el-input>
      </el-form-item>
      <el-form-item label="电话" required>
        <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuickSignIn">快速签到</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { quickSignIn } from '@/api/visitorService'
import { ElMessage } from 'element-plus'

const form = ref({
  name: '',
  phone: ''
})

const handleQuickSignIn = async () => {
  try {
    if (!form.value.name || !form.value.phone) {
      ElMessage.warning('请填写必要信息')
      return
    }
    
    await quickSignIn(form.value.name, form.value.phone)
    ElMessage.success('签到成功')
    form.value.name = ''
    form.value.phone = ''
  } catch (error) {
    ElMessage.error('签到失败：' + error.message)
  }
}
</script> 