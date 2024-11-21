<template>
  <div class="employee-timeline">
    <div class="header">
      <h2>员工时间线 位于 Head Office</h2>
      <div class="header-stats">
        <div class="stat-item remote">
          <span class="number">{{ stats.remote }}</span>
          <span class="label">远程办公</span>
        </div>
        <div class="stat-item checkin">
          <span class="number">{{ stats.checkin }}</span>
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
      
      <div class="filter-btn">
        <el-dropdown 
          trigger="click" 
          @command="handleStatusFilter"
          v-model:visible="dropdownVisible"
        >
          <el-button>
            <template #icon>
              <el-icon><Filter /></el-icon>
            </template>
            筛选器
            <span v-if="filters.status.current !== 'all'" class="filter-label">
              ({{ getFilterLabel(filters.status.current) }})
            </span>
          </el-button>
          
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="all">
                <el-radio 
                  v-model="filters.status.current" 
                  label="all"
                  @click.stop
                >全部</el-radio>
              </el-dropdown-item>
              <el-dropdown-item command="remote">
                <el-radio 
                  v-model="filters.status.current" 
                  label="remote"
                  @click.stop
                >远程办公</el-radio>
              </el-dropdown-item>
              <el-dropdown-item command="pending">
                <el-radio 
                  v-model="filters.status.current" 
                  label="pending"
                  @click.stop
                >待处理</el-radio>
              </el-dropdown-item>
              <el-dropdown-item command="rejected">
                <el-radio 
                  v-model="filters.status.current" 
                  label="rejected"
                  @click.stop
                >被拒绝</el-radio>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div class="actions">
        <el-dropdown trigger="click">
          <el-button>
            <template #icon>
              <el-icon><More /></el-icon>
            </template>
            操作
          </el-button>
          
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleExportAll">
                <el-icon><Download /></el-icon>
                全部导出
              </el-dropdown-item>
              <el-dropdown-item @click="handleCheckoutAll">
                <el-icon><CircleClose /></el-icon>
                全部签退
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div class="settings">
        <el-dropdown trigger="click" @command="handleColumnToggle">
          <el-button>
            <template #icon>
              <el-icon><Setting /></el-icon>
            </template>
            设置
          </el-button>
          
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item 
                v-for="col in columns" 
                :key="col.prop"
                :command="col.prop"
              >
                <el-checkbox 
                  v-model="col.visible"
                  @click.stop
                >
                  {{ col.label }}
                </el-checkbox>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <el-table 
      :data="filteredTimelineData" 
      style="width: 100%"
      @row-click="handleRowClick"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column 
        v-if="getColumnVisible('employee')"
        label="员工" 
        min-width="150"
        sortable
      >
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column 
        v-if="getColumnVisible('photo')"
        label="照片" 
        width="100"
      >
        <template #default="scope">
          <el-avatar :size="32" :src="scope.row.avatar">
            {{ scope.row.name?.[0] }}
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column 
        v-if="getColumnVisible('checkin')"
        label="已签到" 
        width="150"
      >
        <template #default="scope">
          {{ scope.row.checkinTime }}
        </template>
      </el-table-column>
      <el-table-column 
        v-if="getColumnVisible('checkout')"
        label="已签退" 
        width="150"
      >
        <template #default="scope">
          {{ scope.row.checkoutTime }}
        </template>
      </el-table-column>
      <el-table-column 
        v-if="getColumnVisible('duration')"
        label="期间" 
        width="120"
      >
        <template #default="scope">
          {{ scope.row.duration }}
        </template>
      </el-table-column>
      <el-table-column 
        v-if="getColumnVisible('location')"
        label="位置" 
        width="150"
      >
        <template #default="scope">
          {{ scope.row.location }}
        </template>
      </el-table-column>
      <el-table-column 
        v-if="getColumnVisible('checkinIssue')"
        label="签到问题" 
        width="150"
      >
        <template #default="scope">
          {{ scope.row.checkinIssue }}
        </template>
      </el-table-column>
      <el-table-column 
        v-if="getColumnVisible('statusMessage')"
        label="状态消息" 
        min-width="150"
      >
        <template #default="scope">
          {{ scope.row.statusMessage }}
        </template>
      </el-table-column>
    </el-table>

    <el-drawer
      v-model="drawerVisible"
      direction="rtl"
      size="500px"
      :show-close="false"
    >
      <template #header>
        <div class="drawer-header">
          <div class="user-info">
            <h3>{{ selectedEmployee?.name }}</h3>
            <p>于{{ selectedEmployee?.checkoutTime }}签退</p>
          </div>
          <div class="drawer-controls">
            <div class="control-buttons">
              <el-button class="control-btn">
                <el-icon><ArrowUp /></el-icon>
              </el-button>
              <el-button class="control-btn">
                <el-icon><ArrowDown /></el-icon>
              </el-button>
              <el-button class="control-btn" @click="drawerVisible = false">
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
            <el-button type="default" class="checkout-btn">签退</el-button>
          </div>
        </div>
      </template>

      <div class="drawer-content">
        <div class="info-section">
          <div class="info-item">
            <div class="label">电子邮箱</div>
            <div class="value">{{ selectedEmployee?.email || '11@qq.com' }}</div>
          </div>
          <div class="info-item">
            <div class="label">电话</div>
            <div class="value">{{ selectedEmployee?.phone || '-' }}</div>
          </div>
          <div class="info-item">
            <div class="label">位置</div>
            <div class="value">{{ selectedEmployee?.location || 'Head Office' }}</div>
          </div>
        </div>

        <div class="action-links">
          <el-button type="text" class="action-link">
            <el-icon><User /></el-icon>
            查看个人资料
          </el-button>
          <el-button type="text" class="action-link">
            <el-icon><Timer /></el-icon>
            查看{{ selectedEmployee?.name }}的时间线
          </el-button>
          <el-button type="text" class="action-link">
            <el-icon><Document /></el-icon>
            联系人追踪
          </el-button>
        </div>

        <div class="checkin-section">
          <h4>签到详情</h4>
          <div class="checkin-info">
            <div class="checkin-item">
              <div class="label">签到时间</div>
              <div class="time">{{ selectedEmployee?.checkinTime }}</div>
              <div class="detail">
                <div>设备：{{ selectedEmployee?.device }}</div>
                <div>位置：{{ selectedEmployee?.location }}</div>
                <div v-if="selectedEmployee?.isRemote">IP：{{ selectedEmployee?.ip }}</div>
                <div v-if="selectedEmployee?.temperature">体温：{{ selectedEmployee?.temperature }}℃</div>
              </div>
            </div>
            <div class="checkin-item" v-if="selectedEmployee?.checkoutTime !== '-'">
              <div class="label">签退时间</div>
              <div class="time">{{ selectedEmployee?.checkoutTime }}</div>
            </div>
            <div class="checkin-item">
              <div class="label">在线时长</div>
              <div class="time">{{ selectedEmployee?.duration }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { 
  Search, 
  Filter, 
  More, 
  Monitor, 
  Setting, 
  Download, 
  CircleClose,
  User,
  Timer,
  Document,
  ArrowUp,
  ArrowDown,
  Close
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchQuery = ref('')

// 筛选器状态
const filters = reactive({
  status: {
    current: 'all'
  },
  checkinType: {
    current: 'all' // 'all' | 'remote' | 'office'
  }
})

// 添加下拉框可见性控制变量
const dropdownVisible = ref(false)

// 处理状态筛选
const handleStatusFilter = (command: string) => {
  filters.status.current = command
  dropdownVisible.value = false  // 选择后关闭下拉框
}

// 根据筛选条件过滤数据
const filteredTimelineData = computed(() => {
  // 搜索过滤
  let result = timelineData.value.filter(item => {
    if (!searchQuery.value) return true
    return item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  })

  // 根据当前选中的状态过滤
  switch (filters.status.current) {
    case 'all':
      return result
    case 'remote':
      return result.filter(item => item.isRemote)
    case 'pending':
      return result.filter(item => item.status === 'pending')
    case 'rejected':
      return result.filter(item => item.status === 'rejected')
    default:
      return result
  }
})

// 列配置
const columns = ref([
  { prop: 'employee', label: '员工', visible: true },
  { prop: 'photo', label: '照片', visible: true },
  { prop: 'checkin', label: '已签到', visible: true },
  { prop: 'checkout', label: '已签退', visible: true },
  { prop: 'duration', label: '期间', visible: true },
  { prop: 'location', label: '位置', visible: true },
  { prop: 'checkinIssue', label: '签到问题', visible: true },
  { prop: 'statusMessage', label: '状态消息', visible: true }
])

const getColumnVisible = (prop: string) => {
  return columns.value.find(col => col.prop === prop)?.visible
}

const handleColumnToggle = (prop: string) => {
  const column = columns.value.find(col => col.prop === prop)
  if (column) {
    column.visible = !column.visible
  }
}

// 示例数据添加状态字段
const timelineData = ref([
  {
    id: '1',
    name: '张三',
    status: 'active',
    isRemote: true,
    checkinTime: '11月21日 09:00',
    checkoutTime: '-',
    duration: '进行中',
    location: 'Remote',
    checkinIssue: '-',
    statusMessage: '远程办公中',
    checkinType: 'remote', // 签到类型：远程
    device: 'Web', // 签到设备
    ip: '192.168.1.100' // 签到IP
  },
  {
    id: '2',
    name: '李四',
    status: 'active',
    isRemote: false,
    checkinTime: '11月21日 08:30',
    checkoutTime: '-',
    duration: '进行中',
    location: 'Head Office',
    checkinIssue: '-',
    statusMessage: '办公中',
    checkinType: 'office', // 签到类型：办公室
    device: 'Kiosk', // 签到设备：前台终端
    temperature: '36.5' // 体温（如果需要）
  },
  {
    id: '3',
    name: '王五',
    status: 'rejected',
    isRemote: false,
    checkinTime: '11月21日 10:00',
    checkoutTime: '-',
    duration: '-',
    location: 'Branch Office',
    checkinIssue: '迟到',
    statusMessage: '迟到申请被拒绝'
  },
  {
    id: '4',
    name: '赵六',
    status: 'active',
    isRemote: true,
    checkinTime: '11月21日 09:15',
    checkoutTime: '-',
    duration: '进行中',
    location: 'Remote',
    checkinIssue: '-',
    statusMessage: '远程办公中'
  },
  {
    id: '5',
    name: '钱七',
    status: 'pending',
    isRemote: false,
    checkinTime: '11月21日 09:30',
    checkoutTime: '-',
    duration: '-',
    location: 'Head Office',
    checkinIssue: '待确认',
    statusMessage: '位置异常待确认'
  },
  {
    id: '6',
    name: '孙八',
    status: 'rejected',
    isRemote: false,
    checkinTime: '-',
    checkoutTime: '-',
    duration: '-',
    location: '-',
    checkinIssue: '未提供位置信息',
    statusMessage: '签到申请被拒绝'
  },
  {
    id: '7',
    name: '周九',
    status: 'active',
    isRemote: true,
    checkinTime: '11月21日 08:45',
    checkoutTime: '-',
    duration: '进行中',
    location: 'Remote',
    checkinIssue: '-',
    statusMessage: '远程办公中'
  },
  {
    id: '8',
    name: '吴十',
    status: 'active',
    isRemote: false,
    checkinTime: '11月21日 09:00',
    checkoutTime: '-',
    duration: '进行中',
    location: 'Head Office',
    checkinIssue: '-',
    statusMessage: '正常办公中'
  },
  {
    id: '9',
    name: '郑十一',
    status: 'pending',
    isRemote: true,
    checkinTime: '11月21日 08:50',
    checkoutTime: '-',
    duration: '-',
    location: 'Remote',
    checkinIssue: '待审批',
    statusMessage: '远程办公申请待审批'
  },
  {
    id: '10',
    name: '王十二',
    status: 'rejected',
    isRemote: false,
    checkinTime: '-',
    checkoutTime: '-',
    duration: '-',
    location: '-',
    checkinIssue: '无效签到',
    statusMessage: '非工作时间签到被拒绝'
  }
])

const handleExportAll = () => {
  // TODO: 实现导出功能
  ElMessage.success('开始导出所有记录')
}

const handleCheckoutAll = () => {
  ElMessageBox.confirm(
    '确定要为所有在线员工执行签退操作吗？',
    '批量签退确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现批量签退功能
    ElMessage.success('批量签退成功')
  }).catch(() => {
    // 用户取消操作
  })
}

const drawerVisible = ref(false)
const selectedEmployee = ref<any>(null)

const handleRowClick = (row: any) => {
  selectedEmployee.value = row
  drawerVisible.value = true
}

const getFilterLabel = (status: string) => {
  const labels = {
    remote: '远程办公',
    pending: '待处理',
    rejected: '被拒绝',
    all: '全部'
  }
  return labels[status as keyof typeof labels] || ''
}

// 修改统计数据的计算属性
const stats = computed(() => {
  const now = new Date()
  return {
    // 远程办公人数统计 - 当前在线的远程办公人数
    remote: timelineData.value.filter(item => 
      item.status === 'active' && // 状态为激活
      item.isRemote && // 是远程办公
      item.checkinTime !== '-' && // 已签到
      item.checkoutTime === '-' // 未签退
    ).length,
    // 已签到人数统计 - 当前在线的所有人数（包括远程和现场）
    checkin: timelineData.value.filter(item => 
      item.status === 'active' && // 状态为激活
      item.checkinTime !== '-' && // 已签到
      item.checkoutTime === '-' // 未签退
    ).length
  }
})
</script>

<style scoped lang="scss">
.employee-timeline {
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

.employee-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkin-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.settings-icon {
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #409EFF;
  }
}

:deep(.el-table) {
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #f8f9fa;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  
  .el-icon {
    margin-right: 4px;
  }
}

.settings {
  margin-left: auto;
}

:deep(.el-dropdown-menu__item .el-checkbox) {
  width: 100%;
  padding: 0;
  margin: 0;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;

  .user-info {
    h3 {
      margin: 0 0 4px;
      font-size: 18px;
      font-weight: 500;
    }
    p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
  }

  .drawer-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;

    .control-buttons {
      display: flex;
      gap: 4px;

      .control-btn {
        padding: 4px;
        height: auto;
        border: none;
        
        &:hover {
          background-color: #f5f5f5;
        }

        .el-icon {
          font-size: 16px;
        }
      }
    }

    .checkout-btn {
      font-size: 14px;
    }
  }
}

.drawer-content {
  padding: 20px;
}

.info-section {
  margin-bottom: 24px;

  .info-item {
    margin-bottom: 16px;

    .label {
      color: #666;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .value {
      color: #333;
      font-size: 14px;
    }
  }
}

.action-links {
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 24px;

  .action-link {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    color: #1677ff;
    padding: 0;
    height: auto;
    
    &:last-child {
      margin-bottom: 0;
    }

    .el-icon {
      font-size: 16px;
    }
  }
}

.checkin-section {
  h4 {
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }

  .checkin-info {
    .checkin-item {
      margin-bottom: 16px;

      .label {
        color: #666;
        font-size: 14px;
        margin-bottom: 8px;
      }

      .time {
        color: #333;
        font-size: 14px;
        margin-bottom: 4px;
      }

      .detail {
        color: #666;
        font-size: 14px;

        div {
          margin-bottom: 4px;
        }
      }
    }
  }
}

:deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 0;
}

:deep(.el-drawer__body) {
  padding: 0;
}
</style> 