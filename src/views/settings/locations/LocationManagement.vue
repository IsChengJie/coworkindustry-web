<template>
  <div class="settings-wrapper">
    <div class="settings-section">
      <div class="locations-header">
        <div class="header-title">
          <h2>位置管理</h2>
          <p class="locations-description">管理公司下位置及营业时间</p>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="showAddLocationDialog">
            <el-icon><Plus /></el-icon>添加位置
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table 
          :data="locations" 
          style="width: 100%"
          :header-cell-style="{
            background: '#f5f7fa',
            color: '#606266',
            height: '50px',
            fontWeight: 600
          }">
          <el-table-column 
            prop="name" 
            label="位置名称" 
            min-width="120"
            show-overflow-tooltip>
            <template #default="scope">
              <span class="location-name">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column 
            prop="address" 
            label="地址" 
            min-width="200" 
            show-overflow-tooltip />
          <el-table-column 
            label="设备" 
            min-width="100" 
            align="center">
            <template #default="scope">
              <el-button link type="primary" class="device-count" @click="goToDevices(scope.row)">
                {{ scope.row.devices }} 台设备
              </el-button>
            </template>
          </el-table-column>
          <el-table-column 
            label="营业时间" 
            min-width="160"
            align="center">
            <template #default="scope">
              <span class="business-hours">
                {{ scope.row.openTime || '--' }} 至 {{ scope.row.closeTime || '--' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column 
            label="操作" 
            min-width="80" 
            fixed="right"
            align="center">
            <template #default="scope">
              <el-dropdown trigger="click">
                <el-button link type="primary" class="action-button">
                  操作<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleEdit(scope.row)">
                      <el-icon><Edit /></el-icon>编辑
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleDelete(scope.row)" class="text-danger">
                      <el-icon><Delete /></el-icon>删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加/编辑位置对话框 -->
      <el-dialog
        :title="dialogType === 'add' ? '添加位置' : '编辑位置'"
        v-model="locationDialogVisible"
        width="90%"
        max-width="560px"
        class="location-dialog"
        destroy-on-close>
        <el-form
          :model="locationForm"
          :rules="locationRules"
          ref="locationFormRef"
          label-width="100px"
          class="location-form">
          <el-form-item label="位置名称" prop="name">
            <el-input 
              v-model="locationForm.name" 
              placeholder="请输入位置名称"
              clearable />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input 
              v-model="locationForm.address" 
              type="textarea" 
              :rows="2" 
              placeholder="请输入详细地址"
              resize="none" />
          </el-form-item>
          <el-form-item label="营业时间" class="time-range">
            <div class="time-picker-container">
              <el-time-select
                v-model="locationForm.openTime"
                placeholder="开始时间"
                :start="'00:00'"
                :step="'00:30'"
                :end="'23:30'"
                class="time-picker"
              />
              <span class="time-separator">至</span>
              <el-time-select
                v-model="locationForm.closeTime"
                placeholder="结束时间"
                :start="'00:00'"
                :step="'00:30'"
                :end="'23:30'"
                :min-time="locationForm.openTime"
                class="time-picker"
              />
            </div>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="locationDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleLocationSubmit">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus/es/components/form/src/types'
import { Plus, ArrowDown, Edit, Delete } from '@element-plus/icons-vue'
import { useLocationStore } from '@/store/location'
import type { Location } from '@/store/location'

const router = useRouter()
const locationStore = useLocationStore()

const locations = ref<Location[]>([])
const locationDialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentLocation = ref<Location | null>(null)

const locationForm = reactive({
  name: '',
  address: '',
  openTime: '',
  closeTime: ''
})

const locationRules = {
  name: [
    { required: true, message: '请输入位置名称', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' }
  ]
}

const locationFormRef = ref<FormInstance>()

const showAddLocationDialog = () => {
  dialogType.value = 'add'
  locationForm.name = ''
  locationForm.address = ''
  locationForm.openTime = ''
  locationForm.closeTime = ''
  locationDialogVisible.value = true
}

const handleEdit = (row: Location) => {
  dialogType.value = 'edit'
  currentLocation.value = row
  locationForm.name = row.name
  locationForm.address = row.address
  locationForm.openTime = row.openTime || ''
  locationForm.closeTime = row.closeTime || ''
  locationDialogVisible.value = true
}

const handleDelete = (row: Location) => {
  ElMessageBox.confirm(
    '确定要删除该位置吗？此操作不可恢复。',
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await locationStore.deleteLocation(row.id)
      ElMessage.success('位置已删除')
      await initData()
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }).catch(() => {})
}

const handleLocationSubmit = async () => {
  if (!locationFormRef.value) return

  try {
    await locationFormRef.value.validate()
    
    if (dialogType.value === 'add') {
      await locationStore.addLocation({
        name: locationForm.name,
        address: locationForm.address,
        openTime: locationForm.openTime,
        closeTime: locationForm.closeTime
      })
      ElMessage.success('位置添加成功')
    } else if (currentLocation.value) {
      await locationStore.updateLocation(currentLocation.value.id, {
        name: locationForm.name,
        address: locationForm.address,
        openTime: locationForm.openTime,
        closeTime: locationForm.closeTime
      })
      ElMessage.success('位置更新成功')
    }
    locationDialogVisible.value = false
    await initData()
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 跳转到设备管理页面
const goToDevices = (location: Location) => {
  router.push({
    name: 'settings',
    params: { tab: 'devices' },
    query: { locationId: location.id }
  })
}

// 初始化数据
const initData = async () => {
  try {
    const data = await locationStore.fetchLocations()
    locations.value = data
  } catch (error) {
    console.error('获取位置列表失败:', error)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  initData()
})
</script>

<style scoped>
.settings-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
}

.settings-section {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.locations-header {
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

.locations-description {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

:deep(.el-table) {
  width: 100% !important;
}

:deep(.el-table__header) {
  width: 100% !important;
}

:deep(.el-table__body) {
  width: 100% !important;
}

.location-name {
  font-weight: 500;
  color: #303133;
}

.device-count {
  font-size: 14px;
}

.business-hours {
  color: #606266;
}

.action-button {
  font-size: 14px;
}

.location-dialog {
  :deep(.el-dialog__body) {
    padding: 24px;
  }

  :deep(.el-form-item__content) {
    flex-wrap: nowrap;
  }
}

.location-form {
  .el-form-item {
    margin-bottom: 22px;
  }
}

.time-range {
  .time-picker-container {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .time-picker {
    flex: 1;
    min-width: 120px;
  }

  .time-separator {
    padding: 0 8px;
    color: #909399;
    flex-shrink: 0;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
}

.text-danger {
  color: var(--el-color-danger);
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .settings-wrapper {
    padding: 0 12px;
  }

  .settings-section {
    padding: 16px;
  }

  .time-picker-container {
    flex-direction: column;
    gap: 12px;
  }

  .time-picker {
    width: 100%;
  }

  .time-separator {
    display: none;
  }

  :deep(.el-dialog) {
    width: 90% !important;
    margin: 0 auto;
  }

  :deep(.el-form-item__label) {
    width: 80px !important;
  }
}

/* 确保表格在小屏幕上也能正常显示 */
@media screen and (max-width: 576px) {
  :deep(.el-table) {
    font-size: 13px;
  }

  .location-name {
    font-size: 13px;
  }

  .device-count {
    font-size: 13px;
  }

  .business-hours {
    font-size: 13px;
  }
}

/* 暗色主题适配 */
:root[data-theme='dark'] {
  .settings-section {
    background-color: var(--el-bg-color);
  }

  .locations-header {
    border-bottom-color: var(--el-border-color-light);
  }

  .header-title h2 {
    color: var(--el-text-color-primary);
  }

  .locations-description {
    color: var(--el-text-color-secondary);
  }
}
</style> 