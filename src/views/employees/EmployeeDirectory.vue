<template>
  <div class="employee-directory">
    <!-- 顶部统计 -->
    <div class="stats-header">
      <h2>员工名录 位于 Head Office</h2>
      <div class="stats">
        <div class="stat-item remote">
          <span class="number">{{ remoteCount }}</span>
          <span class="label">远程办公</span>
        </div>
        <div class="stat-item checkin">
          <span class="number">{{ checkedInCount }}</span>
          <span class="label">签到</span>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选区 -->
    <div class="search-bar">
      <!-- 左侧搜索框和按钮组 -->
      <div class="left-section">
        <div class="search-input">
          <el-input
            v-model="searchQuery"
            placeholder="搜索"
            prefix-icon="Search"
          />
        </div>

        <!-- 筛选器按钮 -->
        <el-dropdown trigger="click" @command="handleFilterChange">
          <el-button class="action-button">
            <el-icon><Filter /></el-icon>
            筛选器
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <div class="filter-panel">
                <!-- 状态筛选 -->
                <div class="filter-item">
                  <label>状态</label>
                  <el-select 
                    v-model="filters.status" 
                    placeholder="全部"
                    clearable
                  >
                    <el-option label="全部" value="" />
                    <el-option label="已签到" value="checked_in" />
                    <el-option label="远程办公" value="remote" />
                    <el-option label="已签退" value="checked_out" />
                    <el-option label="待处理" value="pending" />
                  </el-select>
                </div>
                
                <!-- 管理员角色筛选 -->
                <div class="filter-item">
                  <label>管理员角色</label>
                  <el-select 
                    v-model="filters.role" 
                    placeholder="全部"
                    clearable
                  >
                    <el-option label="全部" value="" />
                    <el-option label="公司管理员" value="公司管理员" />
                    <el-option label="位置经理" value="位置经理" />
                    <el-option label="员工" value="员工" />
                  </el-select>
                </div>
                
                <!-- 部门筛选 -->
                <div class="filter-item">
                  <label>部门</label>
                  <el-select 
                    v-model="filters.department" 
                    placeholder="全部"
                    clearable
                  >
                    <el-option label="全部" value="" />
                    <el-option 
                      v-for="dept in departments" 
                      :key="dept"
                      :label="dept" 
                      :value="dept"
                    />
                  </el-select>
                </div>
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- 操作按钮 -->
        <el-dropdown @command="handleBatchOperation">
          <el-button class="action-button">
            <el-icon><More /></el-icon>
            操作
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="export">
                <el-icon><Download /></el-icon>导出
              </el-dropdown-item>
              <el-dropdown-item command="batch-checkout" :disabled="!selectedEmployees.length">
                <el-icon><Switch /></el-icon>批量签退
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 右侧添加员工按钮 -->
      <div class="right-section">
        <el-button class="action-button" @click="handleAddEmployee">
          <el-icon><Plus /></el-icon>
          添加员工
        </el-button>
      </div>
    </div>

    <!-- 表格区域 -->
    <el-table
      :data="filteredEmployees"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column 
        type="selection" 
        width="55"
      />
      <el-table-column 
        v-if="columnSettings.employee"
        label="状态" 
        width="180"
      >
        <template #default="{ row }">
          <div class="status-cell">
            <el-avatar
              v-if="columnSettings.photo"
              :size="32"
              :src="row.photoUrl || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
            />
            <el-dropdown 
              trigger="click"
              @command="(command) => handleEmployeeOperation(command, row)"
            >
              <div class="status-action">
                <el-tag :type="getStatusType(row.status)" class="status-tag">
                  {{ getStatusLabel(row.status) }}
                </el-tag>
                <el-icon class="action-icon"><arrow-down /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="checkin">
                    <div class="status-option">
                      <div class="status-dot success"></div>
                      签到
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item command="checkout">
                    <div class="status-option">
                      <div class="status-dot info"></div>
                      签退
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item command="remote">
                    <div class="status-option">
                      <div class="status-dot primary"></div>
                      远程办公
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="员工" sortable />
      <el-table-column 
        v-if="columnSettings.email"
        prop="email" 
        label="电子邮箱" 
      />
      <el-table-column 
        v-if="columnSettings.role"
        prop="role" 
        label="管理员角色" 
      />
      <el-table-column 
        v-if="columnSettings.department"
        prop="department" 
        label="部门" 
      />
      <el-table-column 
        v-if="columnSettings.statusMessage"
        label="状态消息" 
        width="200"
      >
        <template #default="{ row }">
          <div class="status-message">
            <el-icon><Monitor /></el-icon>
            {{ row.lastActivity }}
          </div>
        </template>
      </el-table-column>
      <el-table-column 
        v-if="columnSettings.location"
        prop="location" 
        label="位置" 
      />
      <el-table-column width="50" fixed="right">
        <template #header>
          <el-dropdown 
            trigger="click" 
            @command="handleColumnSettingChange"
          >
            <el-button class="settings-btn">
              <el-icon><Setting /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-checkbox
                    v-model="columnSettings.employee"
                    label="员工"
                    disabled
                  />
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-checkbox
                    v-model="columnSettings.photo"
                    label="照片"
                  />
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-checkbox
                    v-model="columnSettings.email"
                    label="电子邮箱"
                  />
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-checkbox
                    v-model="columnSettings.role"
                    label="管理员角色"
                  />
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-checkbox
                    v-model="columnSettings.department"
                    label="部门"
                  />
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-checkbox
                    v-model="columnSettings.statusMessage"
                    label="状态消息"
                  />
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-checkbox
                    v-model="columnSettings.lastActivity"
                    label="最新活动"
                  />
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-checkbox
                    v-model="columnSettings.location"
                    label="位置"
                  />
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Filter, Plus, Monitor, ArrowDown, Download, Switch, Edit, Location, Document, Setting, More } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

interface Employee {
  id: number
  name: string
  email: string
  role: string
  department: string
  status: 'checked_in' | 'remote' | 'checked_out' | 'pending'
  lastActivity: string
  location: string
  photoUrl?: string
}

const searchQuery = ref('')
const employees = ref<Employee[]>([
  {
    id: 1,
    name: '11111',
    email: '11@qq.com',
    role: '位置经理',
    department: '—',
    status: 'checked_out',
    lastActivity: '于11月21日 11:51签退',
    location: 'Head Office',
    photoUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
  },
  {
    id: 2,
    name: 'weimeijuan',
    email: 'meijuan.wei@item.com',
    role: '员工',
    department: '—',
    status: 'pending',
    lastActivity: '—',
    location: 'Head Office'
  },
  {
    id: 3,
    name: 'Devtest',
    email: 'qian.liu@item.com',
    role: '公司管理员',
    department: '—',
    status: 'checked_in',
    lastActivity: '于11月21日 11:41签到',
    location: 'Head Office'
  }
])

// 筛选器状态
const filters = ref({
  status: '',
  role: '',
  department: ''
})

// 部门列表
const departments = ref(['市场部', '技术部', '人事部', '财务部'])

// 添加选中员工的状态
const selectedEmployees = ref<Employee[]>([])

// 更新过滤后的员工列表计算属性
const filteredEmployees = computed(() => {
  return employees.value.filter(emp => {
    // 搜索过滤
    const searchMatch = 
      emp.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // 状态过滤
    const statusMatch = !filters.value.status || emp.status === filters.value.status
    
    // 角色过滤
    const roleMatch = !filters.value.role || emp.role === filters.value.role
    
    // 部门过滤
    const departmentMatch = !filters.value.department || emp.department === filters.value.department
    
    return searchMatch && statusMatch && roleMatch && departmentMatch
  })
})

// 更新选择变化处理函数
const handleSelectionChange = (selection: Employee[]) => {
  selectedEmployees.value = selection
}

// 获取操作按钮文本
const getActionButtonText = (status: Employee['status']) => {
  const textMap = {
    'checked_in': '签退',
    'remote': '签退',
    'checked_out': '签到',
    'pending': '签到'
  }
  return textMap[status] || '操作'
}

// 处理批量操作
const handleBatchOperation = async (command: string) => {
  if (!selectedEmployees.value.length) {
    ElMessage.warning('请先选择员工')
    return
  }

  const currentTime = new Date()
  const timeStr = `${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, '0')}`

  switch (command) {
    case 'export':
      ElMessage.success('正在导出员工数据...')
      break
      
    case 'batch-checkout':
      try {
        // 过滤出可以签退的员工（已签到或远程办公状态）
        const validEmployees = selectedEmployees.value.filter(
          emp => emp.status === 'checked_in' || emp.status === 'remote'
        )

        if (validEmployees.length === 0) {
          ElMessage.warning('所选员工中没有���以签退的员工')
          return
        }

        await ElMessageBox.confirm(
          `确定要将选中的 ${validEmployees.length} 名员工签退吗？`,
          '批量签退',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        // 只更新可以签退的员工状态
        employees.value = employees.value.map(emp => {
          if (validEmployees.some(selected => selected.id === emp.id)) {
            return {
              ...emp,
              status: 'checked_out',
              lastActivity: `于${timeStr}签退`
            }
          }
          return emp
        })

        // 清空选择
        selectedEmployees.value = []
        
        ElMessage.success('批量签退成功')
        
      } catch (error) {
        console.log('用户取消了批量签退操作')
      }
      break
  }
}

// 处理单个员工操作
const handleEmployeeOperation = async (command: string, employee: Employee) => {
  const currentTime = new Date()
  const timeStr = `${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, '0')}`
  
  // 找到当前员工在数组中的索引
  const employeeIndex = employees.value.findIndex(emp => emp.id === employee.id)
  if (employeeIndex === -1) return

  switch (command) {
    case 'checkin':
      // 更新员工状态和状态消息
      employees.value[employeeIndex] = {
        ...employee,
        status: 'checked_in',
        lastActivity: `于${timeStr}签到`
      }
      ElMessage.success(`${employee.name} 已签到`)
      break

    case 'checkout':
      employees.value[employeeIndex] = {
        ...employee,
        status: 'checked_out',
        lastActivity: `于${timeStr}签退`
      }
      ElMessage.success(`${employee.name} 已签退`)
      break

    case 'remote':
      employees.value[employeeIndex] = {
        ...employee,
        status: 'remote',
        lastActivity: `于${timeStr}切换至远程办公`
      }
      ElMessage.success(`${employee.name} 已切换至远程办公`)
      break
  }

  // 更新顶部统计数据
  updateStats()
}

// 添加顶部统计数据的计算
const remoteCount = computed(() => {
  return employees.value.filter(emp => emp.status === 'remote').length
})

const checkedInCount = computed(() => {
  return employees.value.filter(emp => emp.status === 'checked_in').length
})

// 更新顶部统计的函数
const updateStats = () => {
  // 由于使用了计算属性，统计会自动更新
  // 这里可以添加其他需要更新的逻辑
}

// 处理筛选器变化
const handleFilterChange = () => {
  // 这里可以添加额外的筛选逻辑
  console.log('筛选条件已更新:', filters.value)
}

// 添加状态标签显示和类型的辅助函数
const getStatusLabel = (status: string) => {
  const statusMap = {
    checked_in: '已签到',
    remote: '远程办公',
    checked_out: '已签退',
    pending: '待处理'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getStatusType = (status: string) => {
  const typeMap = {
    checked_in: 'success',
    remote: 'primary',
    checked_out: 'info',
    pending: 'warning'
  }
  return typeMap[status as keyof typeof typeMap] || 'info'
}

// 添加 router 导入
const router = useRouter()

// 修改列设置相关的状态
const columnSettings = ref({
  employee: true,     // 员工和状态列始终显示
  photo: true,
  email: true,
  role: true,
  department: true,
  statusMessage: true,
  lastActivity: true,
  location: true
})

// 处理列设置变化
const handleColumnSettingChange = () => {
  // 保存设置到本地存储
  localStorage.setItem('employeeColumnSettings', JSON.stringify(columnSettings.value))
}

// 初始化列设置
onMounted(() => {
  // 从本地存储加载列设置
  const savedSettings = localStorage.getItem('employeeColumnSettings')
  if (savedSettings) {
    columnSettings.value = {
      ...columnSettings.value,
      ...JSON.parse(savedSettings)
    }
  }
})
</script>

<style scoped>
.employee-directory {
  padding: 20px;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  background: #f5f7fa;
}

.stat-item.remote {
  color: #409eff;
}

.stat-item.checkin {
  color: #67c23a;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-input {
  width: 300px;
}

.right-section {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.status-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
}

:deep(.el-table) {
  margin-top: 16px;
}

.filter-panel {
  padding: 16px;
  min-width: 280px;
}

.filter-item {
  margin-bottom: 16px;
}

.filter-item:last-child {
  margin-bottom: 0;
}

.filter-item label {
  display: block;
  margin-bottom: 8px;
  color: #606266;
  font-size: 14px;
}

.filter-item :deep(.el-select) {
  width: 100%;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
}

:deep(.el-dropdown-menu__item .el-icon) {
  margin-right: 4px;
}

:deep(.el-button--text) {
  display: flex;
  align-items: center;
}

.status-action {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.status-tag {
  cursor: pointer;
}

.action-icon {
  font-size: 12px;
  color: #909399;
}

.status-action:hover .action-icon {
  transform: none;
}

.status-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.success {
  background-color: var(--el-color-success);
}

.status-dot.info {
  background-color: var(--el-color-info);
}

.status-dot.primary {
  background-color: var(--el-color-primary);
}

:deep(.el-dropdown-menu__item) {
  padding: 8px 16px;
}

.status-tag {
  cursor: pointer;
  min-width: 70px;
  text-align: center;
}

/* 添加状态变化的过渡效果 */
.status-tag {
  transition: background-color 0.3s ease;
}

.status-message {
  transition: opacity 0.3s ease;
}

/* 修改下拉菜单中复选框的样式 */
:deep(.el-dropdown-menu .el-checkbox) {
  width: 100%;
  margin: 0;
  padding: 5px 0;
}

:deep(.el-dropdown-menu__item) {
  padding: 0 16px;
  
  &:hover {
    background-color: transparent;
  }
}

/* 修改设置按钮样式 */
.settings-btn {
  padding: 8px;
  height: 32px;
  width: 32px;
  border: none;
  background: transparent;
}

.settings-btn:hover {
  background-color: var(--el-fill-color-light);
}

.settings-btn :deep(.el-icon) {
  font-size: 16px;
  color: var(--el-text-color-regular);
}

.status-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

:deep(.el-avatar) {
  flex-shrink: 0;
}

/* 修改按钮样式 */
.action-button {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid var(--el-border-color);
  background: transparent;
  color: var(--el-text-color-regular);
  font-size: 14px;
  
  &:hover {
    background-color: var(--el-fill-color-light);
    border-color: var(--el-border-color-darker);
  }
  
  &:focus {
    background-color: var(--el-fill-color-light);
  }
}

.action-button :deep(.el-icon) {
  font-size: 16px;
}

/* 修改右侧操作区域的样式 */
.right-section {
  display: flex;
  gap: 8px;  /* 减小按钮之间的间距 */
}

/* 修改搜索栏样式 */
.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-input {
  width: 300px;
}

/* 右侧区域样式 */
.right-section {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

/* 删除原来的 right-actions 样式 */
</style>
