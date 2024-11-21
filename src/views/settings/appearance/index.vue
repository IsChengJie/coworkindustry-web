<template>
  <div class="settings-section">
    <div class="section-header">
      <h2>Appearance</h2>
      <p class="section-description">Customize the appearance of your interface</p>
    </div>

    <el-form :model="appearanceForm" label-width="120px">
      <el-form-item label="Theme Mode">
        <div class="theme-options">
          <div 
            class="theme-option" 
            :class="{ active: appearanceForm.theme === 'light' }"
            @click="selectTheme('light')">
            <div class="theme-preview light-theme">
              <div class="preview-header"></div>
              <div class="preview-content">
                <div class="preview-line"></div>
                <div class="preview-line short"></div>
              </div>
            </div>
            <span class="theme-label">Light</span>
          </div>
          <div 
            class="theme-option" 
            :class="{ active: appearanceForm.theme === 'dark' }"
            @click="selectTheme('dark')">
            <div class="theme-preview dark-theme">
              <div class="preview-header"></div>
              <div class="preview-content">
                <div class="preview-line"></div>
                <div class="preview-line short"></div>
              </div>
            </div>
            <span class="theme-label">Dark</span>
          </div>
          <div 
            class="theme-option" 
            :class="{ active: appearanceForm.theme === 'system' }"
            @click="selectTheme('system')">
            <div class="theme-preview system-theme">
              <div class="preview-half light-theme">
                <div class="preview-header"></div>
                <div class="preview-content">
                  <div class="preview-line"></div>
                </div>
              </div>
              <div class="preview-half dark-theme">
                <div class="preview-header"></div>
                <div class="preview-content">
                  <div class="preview-line"></div>
                </div>
              </div>
            </div>
            <span class="theme-label">Auto</span>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useTheme } from '@/composables/theme'

const { theme, setTheme } = useTheme()

const appearanceForm = reactive({
  theme: 'system'
})

const selectTheme = (mode: 'light' | 'dark' | 'system') => {
  appearanceForm.theme = mode
  setTheme(mode)
}

onMounted(() => {
  appearanceForm.theme = theme.value
})
</script>

<style scoped lang="scss">
.theme-options {
  display: flex;
  gap: 20px;
  margin-top: 8px;
}

.theme-option {
  cursor: pointer;
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--el-fill-color-light);
  }

  &.active {
    background-color: var(--el-color-primary-light-9);
    .theme-label {
      color: var(--el-color-primary);
    }
  }
}

.theme-preview {
  width: 120px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
  margin-bottom: 8px;
}

.light-theme {
  background-color: #ffffff;
  .preview-header {
    background-color: #f5f5f5;
  }
  .preview-line {
    background-color: #e0e0e0;
  }
}

.dark-theme {
  background-color: #1c1c1e;
  .preview-header {
    background-color: #2c2c2e;
  }
  .preview-line {
    background-color: #3a3a3c;
  }
}

.system-theme {
  display: flex;
  .preview-half {
    width: 50%;
    &:first-child {
      border-right: 1px solid var(--el-border-color);
    }
  }
}

.preview-header {
  height: 20%;
  border-bottom: 1px solid var(--el-border-color);
}

.preview-content {
  padding: 8px;
  .preview-line {
    height: 6px;
    border-radius: 3px;
    margin-bottom: 6px;
    &.short {
      width: 60%;
    }
  }
}

.theme-label {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin-top: 4px;
  display: block;
}
</style> 