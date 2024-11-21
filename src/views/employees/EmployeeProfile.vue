<template>
  <div class="employee-profile">
    <div class="header">
      <h2>员工档案 位于 Head Office</h2>
      <div class="header-stats">
        <div class="stat-item remote">
          <span class="number">1</span>
          <span class="label">远程办公</span>
        </div>
        <div class="stat-item checkin">
          <span class="number">0</span>
          <span class="label">签到</span>
        </div>
      </div>
    </div>

    <div class="toolbar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索"
        prefix-icon="Search"
        class="search-input"
      />

      <div class="actions">
        <el-button>
          <template #icon>
            <el-icon><More /></el-icon>
          </template>
          操作
        </el-button>
      </div>
    </div>

    <el-table :data="profiles" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column label="名字" min-width="150" sortable>
        <template #default="scope">
          {{ scope.row.first_name }} {{ scope.row.last_name }}
        </template>
      </el-table-column>
      <el-table-column 
        prop="created_at" 
        label="存档日期" 
        min-width="150" 
        sortable
        :formatter="formatDate"
      />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, More } from '@element-plus/icons-vue'
import { supabase } from '@/lib/supabase'
import { ElMessage } from 'element-plus'

const searchQuery = ref('')
const profiles = ref([
  {
    id: '1',
    first_name: '刚测试1',
    last_name: '',
    created_at: '2024-11-21 14:50'
  }
])

const formatDate = (row: any, column: any) => {
  const date = new Date(row[column.property])
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

const fetchProfiles = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    profiles.value = data
  } catch (error) {
    console.error('Error fetching profiles:', error)
    ElMessage.error('获取档案列表失败')
  }
}

onMounted(() => {
  fetchProfiles()
})
</script>

<style scoped lang="scss">
.employee-profile {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    font-size: 24px;
    font-weight: 500;
    color: #333;
    margin: 0;
  }
}

.header-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 20px;
  
  &.remote {
    background-color: #e6f4ff;
    .number { color: #1677ff; }
  }
  
  &.checkin {
    background-color: #f6ffed;
    .number { color: #52c41a; }
  }

  .number {
    font-size: 16px;
    font-weight: 500;
  }

  .label {
    font-size: 14px;
    color: #666;
  }
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;

  .search-input {
    width: 240px;
  }
}

:deep(.el-table) {
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #f8f9fa;
}
</style> 