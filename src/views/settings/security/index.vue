<template>
  <div class="settings-section">
    <div class="section-header">
      <h2>Security Settings</h2>
      <p class="section-description">Manage your account security settings</p>
    </div>

    <el-form :model="securityForm" label-width="160px">
      <el-form-item label="Change Password">
        <el-button type="primary" @click="showChangePasswordDialog">
          Change Password
        </el-button>
      </el-form-item>
      
      <el-form-item label="Two-Factor Auth">
        <el-switch v-model="securityForm.twoFactorEnabled" />
      </el-form-item>

      <el-form-item label="Login Notifications">
        <el-switch v-model="securityForm.loginNotifications" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const securityForm = reactive({
  twoFactorEnabled: false,
  loginNotifications: true
})
</script> 