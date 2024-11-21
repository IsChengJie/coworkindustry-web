<template>
  <div class="settings-section">
    <div class="section-header">
      <h2>Notification Settings</h2>
      <p class="section-description">Manage your notification preferences</p>
    </div>

    <el-form :model="notificationForm" label-width="160px">
      <el-form-item label="Email Notifications">
        <el-switch v-model="notificationForm.emailEnabled" />
      </el-form-item>

      <el-form-item label="System Notifications">
        <el-switch v-model="notificationForm.systemEnabled" />
      </el-form-item>

      <el-form-item label="Device Alerts">
        <el-switch v-model="notificationForm.deviceAlerts" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const notificationForm = reactive({
  emailEnabled: true,
  systemEnabled: true,
  deviceAlerts: true
})
</script> 