<template>
  <div class="space-bookings">
    <!-- 搜索和操作区 -->
    <div class="search-bar">
      <div class="left-section">
        <el-input
          v-model="searchQuery"
          placeholder="Search employees or resources..."
          class="search-input"
          :prefix-icon="Search"
        />
        <el-select v-model="statusFilter" placeholder="Status" class="status-select">
          <el-option label="All" value="" />
          <el-option label="Available" value="available" />
          <el-option label="Occupied" value="occupied" />
        </el-select>
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
      <div class="right-section">
        <el-button type="primary" class="export-btn">
          Export <span class="count">0</span>
        </el-button>
        <el-button 
          type="primary" 
          class="new-booking-btn"
          @click="showNewBookingDrawer"
        >
          New Booking
        </el-button>
      </div>
    </div>

    <!-- 表格区域 -->
    <el-card class="table-card" shadow="never">
      <el-table :data="bookings" style="width: 100%">
        <el-table-column prop="employee" label="Employee" min-width="120" />
        <el-table-column prop="resource" label="Resource" min-width="120" />
        <el-table-column prop="category" label="Category" min-width="120" />
        <el-table-column prop="start" label="Start" min-width="150" />
        <el-table-column prop="end" label="End" min-width="150" />
        <el-table-column prop="repeat" label="Repeat" min-width="100" />
        <el-table-column prop="location" label="Location" min-width="120" />
        <el-table-column prop="space" label="Space" min-width="120" />
        <el-table-column prop="checkedIn" label="Checked In" min-width="120" />
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <span class="total-text">Total {{ total }}</span>
        <el-select v-model="pageSize" class="page-size-select">
          <el-option
            v-for="size in [10, 20, 50, 100]"
            :key="size"
            :label="`${size}/page`"
            :value="size"
          />
        </el-select>
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
        />
      </div>
    </el-card>

    <!-- 新增预订抽屉 -->
    <NewBookingDrawer
      :visible="drawerVisible"
      @update:visible="drawerVisible = $event"
      @submit="handleNewBooking"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Filter } from '@element-plus/icons-vue'
import NewBookingDrawer from './components/NewBookingDrawer.vue'

// 搜索和筛选
const searchQuery = ref('')
const statusFilter = ref('')
const dateRange = ref([])

// 表格数据
interface Booking {
  id: number
  employee: string
  resource: string
  category: string
  start: string
  end: string
  repeat: string
  location: string
  space: string
  checkedIn: boolean
}

const bookings = ref<Booking[]>([
  {
    id: 1,
    employee: 'John Doe',
    resource: 'Meeting Room A',
    category: 'Meeting',
    start: '2024-02-21 09:00',
    end: '2024-02-21 10:00',
    repeat: 'None',
    location: 'Floor 1',
    space: 'Room 101',
    checkedIn: true
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 初始化为 false
const drawerVisible = ref(false)

const showNewBookingDrawer = () => {
  drawerVisible.value = true
}

const handleNewBooking = (formData: any) => {
  console.log('New booking:', formData)
  // 处理新预订的逻辑
}
</script>

<style scoped lang="scss">
.space-bookings {
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

    .date-picker {
      width: 320px;
    }
  }

  .right-section {
    display: flex;
    gap: 12px;

    .count {
      background: rgba(0, 0, 0, 0.1);
      padding: 2px 8px;
      border-radius: 10px;
      margin-left: 8px;
    }
  }
}

.table-card {
  margin: 0;
  border: none;
  box-shadow: none;

  :deep(.el-card__body) {
    padding: 0;
  }
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;

  .total-text {
    color: #6b7280;
    margin-right: auto;
  }

  .page-size-select {
    width: 120px;
    margin: 0 16px;
  }
}

:deep(.el-table) {
  --el-table-border-color: #f0f0f0;
  --el-table-header-bg-color: #f9fafb;
  
  th {
    font-weight: 600;
    color: #374151;
  }
}
</style> 