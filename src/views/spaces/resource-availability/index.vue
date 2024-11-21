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
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="to"
          start-placeholder="Start Date"
          end-placeholder="End Date"
          class="date-picker"
        />
        <el-button class="filter-btn" :icon="Filter">Filters</el-button>
      </div>
    </div>

    <!-- 资源列表 -->
    <div class="resource-table">
      <el-table :data="resources" style="width: 100%">
        <el-table-column width="50">
          <template #default>
            <el-checkbox />
          </template>
        </el-table-column>
        
        <el-table-column label="Resource" min-width="200">
          <template #default="{ row }">
            <div class="resource-info">
              <el-icon class="resource-icon"><OfficeBuilding /></el-icon>
              <div>
                <div class="resource-name">{{ row.name }}</div>
                <div class="resource-type">{{ row.type }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column 
          v-for="day in weekDays" 
          :key="day.date"
          :label="day.label"
          align="center"
        >
          <template #default="{ row }">
            <div class="availability-cell">
              <el-tag 
                :type="getAvailabilityType(row.availability[day.date])"
                effect="plain"
                size="small"
              >
                {{ row.availability[day.date] }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Filter, OfficeBuilding } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import type { ElTag } from 'element-plus'

interface Resource {
  id: number
  name: string
  type: string
  availability: Record<string, AvailabilityStatus>
}

type AvailabilityStatus = 'Available' | 'Occupied' | 'Maintenance'
type TagType = 'success' | 'warning' | 'info'

const searchQuery = ref<string>('')
const dateRange = ref<[Date | null, Date | null]>([null, null])

// 生成一周的日期
const weekDays = computed(() => {
  const days = []
  const startDate = dayjs('2024-02-17') // 从周日开始
  
  for (let i = 0; i < 7; i++) {
    const currentDate = startDate.add(i, 'day')
    days.push({
      date: currentDate.format('YYYY-MM-DD'),
      label: currentDate.format('ddd DD MMM')
    })
  }
  
  return days
})

// 模拟资源数据
const resources = ref<Resource[]>([
  {
    id: 222,
    name: 'Desk',
    type: 'Workspace',
    availability: {
      '2024-02-17': 'Available',
      '2024-02-18': 'Available',
      '2024-02-19': 'Available',
      '2024-02-20': 'Available',
      '2024-02-21': 'Available',
      '2024-02-22': 'Available',
      '2024-02-23': 'Available'
    }
  }
])

// 获取可用性状态对应的标签类型
function getAvailabilityType(status: AvailabilityStatus): TagType {
  const types: Record<AvailabilityStatus, TagType> = {
    'Available': 'success',
    'Occupied': 'warning',
    'Maintenance': 'info'
  }
  return types[status] || 'info'
}
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
  }
}

.resource-table {
  :deep(.el-table) {
    --el-table-border-color: #f0f0f0;
    --el-table-header-bg-color: #f9fafb;
    
    th {
      font-weight: 600;
      color: #374151;
      padding: 12px 8px;
    }

    td {
      padding: 12px 8px;
    }
  }
}

.resource-info {
  display: flex;
  align-items: center;
  gap: 12px;

  .resource-icon {
    font-size: 24px;
    color: #6b7280;
  }

  .resource-name {
    font-weight: 500;
    color: #111827;
  }

  .resource-type {
    font-size: 12px;
    color: #6b7280;
  }
}

.availability-cell {
  :deep(.el-tag) {
    width: 100%;
    text-align: center;
    border: 1px solid transparent;
    
    &.el-tag--success {
      background-color: #ecfdf5;
      color: #059669;
    }
    
    &.el-tag--warning {
      background-color: #fffbeb;
      color: #d97706;
    }
    
    &.el-tag--info {
      background-color: #f3f4f6;
      color: #6b7280;
    }
  }
}
</style> 