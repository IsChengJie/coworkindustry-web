<template>
  <div class="report-list">
    <h2>Reports</h2>
    <!-- Toolbar -->
    <div class="toolbar">
      <el-input
        v-model="searchQuery"
        placeholder="Search reports..."
        class="search-input"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      
      <el-select v-model="filterType" placeholder="Type" clearable>
        <el-option label="Daily" value="daily" />
        <el-option label="Weekly" value="weekly" />
        <el-option label="Monthly" value="monthly" />
      </el-select>
      
      <el-button type="primary" @click="handleExport">
        <el-icon><Download /></el-icon>Export
      </el-button>
    </div>

    <!-- Report Table -->
    <el-table
      :data="filteredReports"
      style="width: 100%"
      :loading="loading"
    >
      <el-table-column prop="title" label="Title" />
      <el-table-column prop="date" label="Date">
        <template #default="{ row }">
          {{ formatDate(row.date) }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="Type" />
      <el-table-column prop="status" label="Status">
        <template #default="{ row }">
          <el-tag :type="row.status === 'completed' ? 'success' : 'info'">
            {{ row.status === 'completed' ? 'Completed' : 'Pending' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="150">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 'completed'"
            type="primary"
            size="small"
            @click="handleDownload(row)"
          >
            Download
          </el-button>
          <el-button
            type="info"
            size="small"
            @click="handleViewDetails(row)"
          >
            Details
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Search, Download } from '@element-plus/icons-vue'
import type { Report } from '@/types/report'

const loading = ref(false)
const searchQuery = ref('')
const filterType = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// Mock report data
const reports = ref<Report[]>([
  {
    id: '1',
    title: 'Daily Report - 2024-01-21',
    date: '2024-01-21',
    type: 'daily',
    status: 'completed',
    downloadUrl: '/reports/daily-2024-01-21.pdf'
  },
  {
    id: '2',
    title: 'Weekly Report - Week 3, 2024',
    date: '2024-01-20',
    type: 'weekly',
    status: 'pending'
  }
])

// Filtered report list
const filteredReports = computed(() => {
  return reports.value.filter(report => {
    const matchQuery = searchQuery.value
      ? report.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      : true
      
    const matchType = filterType.value
      ? report.type === filterType.value
      : true
      
    return matchQuery && matchType
  })
})

// Handle export
const handleExport = () => {
  // TODO: Implement export functionality
}

// Handle download
const handleDownload = (report: Report) => {
  if (report.downloadUrl) {
    window.open(report.downloadUrl, '_blank')
  } else {
    ElMessage.error('Download link not available')
  }
}

// Handle view details
const handleViewDetails = (report: Report) => {
  // TODO: Implement view details functionality
}

// Handle pagination
const handleSizeChange = (val: number) => {
  pageSize.value = val
  // TODO: Reload data
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // TODO: Reload data
}

// Date formatting utility
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}
</script>

<style scoped>
.report-list {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.search-input {
  width: 300px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 