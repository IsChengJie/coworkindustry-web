<template>
  <div class="settings-section">
    <div class="spaces-header">
      <div class="header-title">
        <h2>Spaces Settings</h2>
        <p class="spaces-description">Manage your spaces, resources and categories</p>
      </div>
    </div>

    <div class="spaces-tabs">
      <el-tabs v-model="activeTab" class="demo-tabs">
        <el-tab-pane name="spaces">
          <template #label>
            <span class="tab-label">
              <el-icon><Grid /></el-icon>
              Spaces
            </span>
          </template>
          <router-view />
        </el-tab-pane>
        <el-tab-pane name="resources">
          <template #label>
            <span class="tab-label">
              <el-icon><Box /></el-icon>
              Resources
            </span>
          </template>
          <ResourceList />
        </el-tab-pane>
        <el-tab-pane name="categories">
          <template #label>
            <span class="tab-label">
              <el-icon><Files /></el-icon>
              Categories
            </span>
          </template>
          <CategoryList />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Grid, Box, Files } from '@element-plus/icons-vue'
import ResourceList from './resources/ResourceList.vue'
import CategoryList from './categories/CategoryList.vue'

const router = useRouter()
const activeTab = ref('spaces')

// 监听标签页变化，更新路由
watch(activeTab, (newTab) => {
  switch (newTab) {
    case 'spaces':
      router.push({ name: 'settings-spaces-list' })
      break
    case 'resources':
      router.push({ name: 'settings-spaces-resources' })
      break
    case 'categories':
      router.push({ name: 'settings-spaces-categories' })
      break
  }
})
</script>

<style scoped>
.spaces-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 0 0 20px;
  border-bottom: 1px solid #ebeef5;
}

.header-title h2 {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.spaces-description {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.spaces-tabs {
  margin-top: 20px;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-tabs__nav) {
  border-radius: 8px;
  padding: 4px;
  background-color: var(--el-fill-color-light);
}

:deep(.el-tabs__item) {
  padding: 8px 24px;
  height: auto;
  border-radius: 6px;
}

:deep(.el-tabs__item.is-active) {
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

/* 暗色主题适配 */
:root[data-theme='dark'] {
  :deep(.el-tabs__item.is-active) {
    background-color: var(--el-bg-color);
  }
}
</style> 