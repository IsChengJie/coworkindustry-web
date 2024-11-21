<template>
  <div class="settings-wrapper">
    <div class="settings-section">
      <div class="locations-header">
        <div class="header-title">
          <h2>Location Management</h2>
          <p class="locations-description">Manage company locations and their business hours</p>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="showAddLocationDialog">
            <el-icon><Plus /></el-icon>Add Location
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
            label="Location Name" 
            min-width="120"
            show-overflow-tooltip>
            <template #default="scope">
              <span class="location-name">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column 
            prop="address" 
            label="Address" 
            min-width="200" 
            show-overflow-tooltip />
          <el-table-column 
            label="Devices" 
            min-width="100" 
            align="center">
            <template #default="scope">
              <el-button link type="primary" class="device-count" @click="goToDevices(scope.row)">
                {{ scope.row.devices }} Device<span v-if="scope.row.devices !== 1">s</span>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column 
            label="Business Hours" 
            min-width="160"
            align="center">
            <template #default="scope">
              <span class="business-hours">
                {{ scope.row.openTime || '--' }} to {{ scope.row.closeTime || '--' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column 
            label="Actions" 
            min-width="80" 
            fixed="right"
            align="center">
            <template #default="scope">
              <el-dropdown trigger="click">
                <el-button link type="primary" class="action-button">
                  Actions<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleEdit(scope.row)">
                      <el-icon><Edit /></el-icon>Edit
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleDelete(scope.row)" class="text-danger">
                      <el-icon><Delete /></el-icon>Delete
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
        :title="dialogType === 'add' ? 'Add Location' : 'Edit Location'"
        v-model="locationDialogVisible"
        width="460px"
        class="location-dialog"
        destroy-on-close
        :close-on-click-modal="false">
        <el-form
          :model="locationForm"
          :rules="locationRules"
          ref="locationFormRef"
          label-width="120px"
          class="location-form">
          <el-form-item label="Location Name" prop="name">
            <el-input 
              v-model="locationForm.name" 
              placeholder="Enter location name"
              clearable />
          </el-form-item>
          <el-form-item label="Address" prop="address">
            <el-input 
              v-model="locationForm.address" 
              type="textarea" 
              :rows="2" 
              placeholder="Enter address"
              resize="none" />
          </el-form-item>
          <el-form-item label="Business Hours">
            <div class="time-picker-group">
              <el-time-select
                v-model="locationForm.openTime"
                placeholder="Start Time"
                :start="'00:00'"
                :step="'00:30'"
                :end="'23:30'"
                style="width: 140px"
              />
              <span class="time-separator">to</span>
              <el-time-select
                v-model="locationForm.closeTime"
                placeholder="End Time"
                :start="'00:00'"
                :step="'00:30'"
                :end="'23:30'"
                :min-time="locationForm.openTime"
                style="width: 140px"
              />
            </div>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="locationDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="handleLocationSubmit">Confirm</el-button>
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
    { required: true, message: 'Please enter the location name', trigger: 'blur' }
  ],
  address: [
    { required: true, message: 'Please enter the address', trigger: 'blur' }
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
    'Are you sure to delete this location?',
    'Confirm Delete',
    {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await locationStore.deleteLocation(row.id)
      ElMessage.success('Location deleted successfully')
      await initData()
    } catch (error) {
      console.error('Delete failed:', error)
      ElMessage.error('Delete failed, please try again')
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
      ElMessage.success('Location added successfully')
    } else if (currentLocation.value) {
      await locationStore.updateLocation(currentLocation.value.id, {
        name: locationForm.name,
        address: locationForm.address,
        openTime: locationForm.openTime,
        closeTime: locationForm.closeTime
      })
      ElMessage.success('Location updated successfully')
    }
    locationDialogVisible.value = false
    await initData()
  } catch (error) {
    console.error('Operation failed:', error)
    ElMessage.error('Operation failed, please try again')
  }
}

// 跳转到设备管理页面
const goToDevices = (location: Location) => {
  router.push({
    name: 'settings-devices',
    query: { 
      locationId: location.id,
      locationName: location.name
    }
  })
}

// 初始化数据
const initData = async () => {
  try {
    const data = await locationStore.fetchLocations()
    locations.value = data
  } catch (error) {
    console.error('Get location list failed:', error)
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
    padding: 20px 24px;
  }

  :deep(.el-form-item:last-child) {
    margin-bottom: 0;
  }
}

.location-form {
  .el-form-item {
    margin-bottom: 22px;
  }
}

.time-picker-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-separator {
  color: var(--el-text-color-secondary);
  padding: 0 4px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
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