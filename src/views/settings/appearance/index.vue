<template>
  <div class="settings-section">
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
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const appearanceSettings = reactive({
  theme: '#409EFF',
  fontSize: 'medium'
})

const saveAppearanceSettings = () => {
  ElMessage.success('外观设置已保存')
}
</script> 