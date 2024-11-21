<template>
  <div class="resource-availability">
    <!-- 搜索和操作区 -->
    <div class="search-bar">
      <div class="left-section">
        <el-input
          v-model="searchQuery"
          placeholder="Search resources..."
          class="search-input"
          :prefix-icon="Search"
        />
        <el-select v-model="statusFilter" placeholder="Status" class="status-select">
          <el-option label="All" value="" />
          <el-option label="Available" value="available" />
          <el-option label="Occupied" value="occupied" />
        </el-select>
        <el-button class="filter-btn" :icon="Filter">Filters</el-button>
      </div>
    </div>

    <!-- 资源列表 -->
    <div class="resource-grid">
      <!-- Resource cards will be added here -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Filter } from '@element-plus/icons-vue'

const searchQuery = ref('')
const statusFilter = ref('')
</script>

<style scoped lang="scss">
.resource-availability {
  background-color: #fff;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;

  .left-section {
    display: flex;
    gap: 12px;
    flex: 1;

    .search-input {
      width: 240px;
    }

    .status-select {
      width: 160px;
    }
  }
}

.resource-grid {
  padding: 24px;
}
</style> 