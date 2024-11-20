<template>
  <div class="visitor-list">
    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="searchQuery"
          placeholder="Search visitors..."
          class="search-input"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-select v-model="filterStatus" placeholder="Status" clearable>
          <el-option label="Present" value="active" />
          <el-option label="Signed Out" value="checked_out" />
          <el-option label="Pre-registered" value="pre_registered" />
        </el-select>
        
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="to"
          start-placeholder="Start Date"
          end-placeholder="End Date"
          format="MM/DD/YYYY"
          value-format="YYYY-MM-DD"
        />
      </div>
      
      <div class="toolbar-right">
        <el-button type="primary" @click="handleQuickSignIn">
          <el-icon><Plus /></el-icon>Quick Sign In
        </el-button>
        <el-button @click="handlePreRegister">
          <el-icon><Calendar /></el-icon>Pre-register
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>Export
        </el-button>
      </div>
    </div>

    <!-- Visitor List -->
    <el-table
      :data="filteredVisitors"
      style="width: 100%"
      :loading="loading"
    >
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="visitor-details">
            <el-descriptions :column="3" border>
              <el-descriptions-item label="Email">
                {{ row.email }}
              </el-descriptions-item>
              <el-descriptions-item label="Phone">
                {{ formatPhoneNumber(row.phone) }}
              </el-descriptions-item>
              <el-descriptions-item label="Purpose">
                {{ row.purpose }}
              </el-descriptions-item>
              <el-descriptions-item label="Sign In">
                {{ formatDateTime(row.checkIn) }}
              </el-descriptions-item>
              <el-descriptions-item label="Sign Out">
                {{ row.checkOut ? formatDateTime(row.checkOut) : '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="Badge">
                {{ row.badge?.number || '-' }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="company" label="Company" />
      <el-table-column prop="host" label="Host" />
      <el-table-column prop="checkIn" label="Sign In Time">
        <template #default="{ row }">
          {{ formatDateTime(row.checkIn) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Status">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="200">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 'active'"
            type="primary"
            size="small"
            @click="handleCheckOut(row)"
          >
            Sign Out
          </el-button>
          <el-button
            v-if="row.status === 'pre_registered'"
            type="success"
            size="small"
            @click="handleCheckIn(row)"
          >
            Sign In
          </el-button>
          <el-button
            type="info"
            size="small"
            @click="handleViewDetails(row)"
          >
            Details
          </el-button>
          <el-dropdown>
            <el-button size="small">
              More<el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handlePrint(row)">
                  Print Badge
                </el-dropdown-item>
                <el-dropdown-item @click="handleResendEmail(row)">
                  Resend Email
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleDelete(row)">
                  Delete
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  Search,
  Plus,
  Calendar,
  Download,
  ArrowDown
} from '@element-plus/icons-vue'
import type { DateRangeValue } from 'element-plus'
import type { Visitor } from '@/types/visitor'

const router = useRouter()
const loading = ref(false)
const searchQuery = ref('')
const filterStatus = ref('')
const dateRange = ref<DateRangeValue>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 模拟访客数据
const visitors = ref<Visitor[]>([
  {
    id: '1',
    name: '张三',
    company: '科技有限公司',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    purpose: '商务会议',
    host: '李四',
    checkIn: '2024-01-21 09:30',
    status: 'active',
    badge: {
      id: '1',
      number: 'V001'
    }
  },
  {
    id: '2',
    name: '王五',
    company: '贸易有限公司',
    email: 'wangwu@example.com',
    phone: '13900139000',
    purpose: '面试',
    host: '赵六',
    checkIn: '2024-01-21 10:15',
    checkOut: '2024-01-21 11:30',
    status: 'checked_out'
  }
])

// 状态处理
const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    active: 'success',
    checked_out: 'info',
    pre_registered: 'warning'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    active: 'Present',
    checked_out: 'Signed Out',
    pre_registered: 'Pre-registered'
  }
  return texts[status] || status
}

// 过滤访客列表
const filteredVisitors = computed(() => {
  return visitors.value.filter(visitor => {
    const matchQuery = searchQuery.value
      ? visitor.name.includes(searchQuery.value) ||
        visitor.company.includes(searchQuery.value)
      : true
      
    const matchStatus = filterStatus.value
      ? visitor.status === filterStatus.value
      : true
      
    return matchQuery && matchStatus
  })
})

// 处理签出
const handleCheckOut = async (visitor: Visitor) => {
  try {
    await ElMessageBox.confirm(
      `确定要为访客 ${visitor.name} 签出吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    loading.value = true
    // TODO: 实现签出API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    visitor.status = 'checked_out'
    visitor.checkOut = new Date().toLocaleString()
    ElMessage.success('签出成功')
    
  } catch {
    // 用户取消操作
  } finally {
    loading.value = false
  }
}

// 其他功能处理方法
const handleQuickSignIn = () => {
  router.push('/visitors/quick-signin')
}

const handlePreRegister = () => {
  router.push('/visitors/pre-register')
}

const handleExport = () => {
  // TODO: 实现导出功能
}

const handleCheckIn = (visitor: Visitor) => {
  // TODO: 实现预约访客签到
}

const handleViewDetails = (visitor: Visitor) => {
  // TODO: 显示访客详情
}

const handlePrint = (visitor: Visitor) => {
  // TODO: 实现打印访客证
}

const handleResendEmail = (visitor: Visitor) => {
  // TODO: 实现重发邮件
}

const handleDelete = async (visitor: Visitor) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除此访客记录吗？此操作不可恢复。',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // TODO: 实现删除API
    ElMessage.success('删除成功')
    
  } catch {
    // 用户取消操作
  }
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  // TODO: 重新加载数据
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // TODO: 重新加载数据
}

// Add date formatting utilities
const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date)
}

const formatPhoneNumber = (phone: string) => {
  // Format phone number to US style: (XXX) XXX-XXXX
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }
  return phone
}
</script>

<style scoped>
.visitor-list {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.toolbar-left {
  display: flex;
  gap: 16px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.search-input {
  width: 300px;
}

.visitor-details {
  padding: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 