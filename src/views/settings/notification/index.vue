<template>
  <div class="settings-section">
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
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const notificationSettings = reactive({
  email: true,
  system: true
})

const saveNotificationSettings = () => {
  ElMessage.success('通知设置已保存')
}
</script> 