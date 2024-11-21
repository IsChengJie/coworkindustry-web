<template>
  <div class="settings-section">
    <div class="devices-header">
      <div class="header-title">
        <h2>Device Management</h2>
        <p class="devices-description">Manage your iPads, Android tablets, or smart TVs</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="showAddDeviceDialog">
          <el-icon><Plus /></el-icon>Add Device
        </el-button>
      </div>
    </div>

    <el-table :data="devices" style="width: 100%; margin-top: 20px">
      <el-table-column prop="deviceName" label="Device Name" min-width="150" show-overflow-tooltip />
      <el-table-column label="Device ID" min-width="120">
        <template #default="scope">
          <el-button link type="primary" @click="showDeviceDetails(scope.row)">
            {{ scope.row.deviceId }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="locationName" label="Location" min-width="150">
        <template #default="scope">
          {{ scope.row.locationName || 'Not Assigned' }}
        </template>
      </el-table-column>
      <el-table-column label="App Version" min-width="120">
        <template #default="scope">
          <el-tag size="small" :type="getVersionTagType(scope.row.appVersion)">
            {{ scope.row.appVersion || 'Not Installed' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Device Status" min-width="200">
        <template #default="scope">
          <div class="device-status">
            <el-tag size="small" :type="scope.row.isOnline ? 'success' : 'info'">
              {{ scope.row.isOnline ? 'Online' : 'Offline' }}
            </el-tag>
            <template v-if="scope.row.isOnline">
              <span class="status-item">
                <el-icon><DeviceIcon /></el-icon>
                {{ scope.row.batteryLevel }}%
              </span>
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Last Activity" min-width="180">
        <template #default="scope">
          {{ formatDateTime(scope.row.lastActivity) }}
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="120" fixed="right">
        <template #default="scope">
          <el-dropdown>
            <el-button link type="primary">
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

    <!-- Add/Edit Device Dialog -->
    <el-dialog
      :title="dialogType === 'add' ? 'Add Device' : 'Edit Device'"
      v-model="deviceDialogVisible"
      width="500px">
      <el-form
        :model="deviceForm"
        :rules="deviceRules"
        ref="deviceFormRef"
        label-width="120px">
        <el-form-item label="Device Name" prop="deviceName">
          <el-input v-model="deviceForm.deviceName" placeholder="Enter device name" />
        </el-form-item>
        <el-form-item label="Device ID" prop="deviceId">
          <el-input 
            v-model="deviceForm.deviceId" 
            :disabled="dialogType === 'edit'"
            placeholder="Enter device ID" />
        </el-form-item>
        <el-form-item label="Location" prop="locationId">
          <el-select 
            v-model="deviceForm.locationId" 
            placeholder="Select location"
            style="width: 100%">
            <el-option
              v-for="location in locations"
              :key="location.id"
              :label="location.name"
              :value="location.id"
            />
            <div v-if="!locations.length" class="no-locations">
              <p>No locations available</p>
              <el-button type="primary" link @click="goToLocationManagement">
                Add Location
              </el-button>
            </div>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deviceDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleDeviceSubmit">Confirm</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Device Details Dialog -->
    <el-dialog
      title="Device Details"
      v-model="detailsDialogVisible"
      width="600px">
      <div v-if="selectedDevice" class="device-details">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="Device Name">{{ selectedDevice.deviceName }}</el-descriptions-item>
          <el-descriptions-item label="Device ID">{{ selectedDevice.deviceId }}</el-descriptions-item>
          <el-descriptions-item label="Serial Number">{{ selectedDevice.serialNumber || 'N/A' }}</el-descriptions-item>
          <el-descriptions-item label="Model">{{ selectedDevice.model || 'N/A' }}</el-descriptions-item>
          <el-descriptions-item label="OS Version">{{ selectedDevice.osVersion || 'N/A' }}</el-descriptions-item>
          <el-descriptions-item label="App Version">{{ selectedDevice.appVersion || 'Not Installed' }}</el-descriptions-item>
          <el-descriptions-item label="Battery Level">{{ selectedDevice.batteryLevel || 'N/A' }}%</el-descriptions-item>
          <el-descriptions-item label="Location">{{ selectedDevice.locationName }}</el-descriptions-item>
          <el-descriptions-item label="Status">
            <el-tag :type="selectedDevice.isOnline ? 'success' : 'info'">
              {{ selectedDevice.isOnline ? 'Online' : 'Offline' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Last Activity">
            {{ formatDateTime(selectedDevice.lastActivity) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from '@/types'
import { 
  Plus,
  Location as LocationIcon,
  ArrowDown,
  Edit,
  Delete,
  Cellphone as DeviceIcon
} from '@element-plus/icons-vue'
import { useDeviceStore } from '@/store/device'
import { useLocationStore } from '@/store/location'
import type { Device, Location } from '@/types'

const route = useRoute()
const router = useRouter()
const deviceStore = useDeviceStore()
const locationStore = useLocationStore()

// 状态管理
const devices = ref<Device[]>([])
const locations = ref<Location[]>([])
const deviceDialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentDevice = ref<Device | null>(null)
const selectedDevice = ref<Device | null>(null)
const detailsDialogVisible = ref(false)

// 表单状态
const deviceForm = reactive({
  deviceName: '',
  deviceId: '',
  locationId: ''
})

// 表单验证规则
const deviceRules = {
  deviceName: [
    { required: true, message: 'Please enter device name', trigger: 'blur' }
  ],
  deviceId: [
    { required: true, message: 'Please enter device ID', trigger: 'blur' }
  ],
  locationId: [
    { required: true, message: 'Please select location', trigger: 'change' }
  ]
}

const deviceFormRef = ref<FormInstance>()

// 初始化数据
const initData = async () => {
  try {
    // 获取位置列表
    const locationData = await locationStore.fetchLocations()
    locations.value = locationData

    // 获取设备列表
    const locationId = route.query.locationId as string
    const deviceData = await deviceStore.fetchDevices(locationId)
    devices.value = deviceData || []
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

// 添加路由监听
watch(
  () => route.query.locationId,
  () => {
    initData()
  }
)

// 显示设备详情
const showDeviceDetails = (device: Device) => {
  selectedDevice.value = device
  detailsDialogVisible.value = true
}

// 添加设备
const showAddDeviceDialog = () => {
  if (!locations.value.length) {
    ElMessageBox.confirm(
      'No locations available. Would you like to add a location first?',
      'Add Location',
      {
        confirmButtonText: 'Go to Locations',
        cancelButtonText: 'Cancel',
        type: 'info'
      }
    ).then(() => {
      router.push({ name: 'settings-locations' })
    })
    return
  }

  dialogType.value = 'add'
  deviceForm.deviceName = ''
  deviceForm.deviceId = ''
  deviceForm.locationId = route.query.locationId as string || ''
  deviceDialogVisible.value = true
}

// 编辑设备
const handleEdit = (device: Device) => {
  dialogType.value = 'edit'
  currentDevice.value = device
  deviceForm.deviceName = device.deviceName
  deviceForm.deviceId = device.deviceId
  deviceForm.locationId = device.locationId
  deviceDialogVisible.value = true
}

// 删除设备
const handleDelete = (device: Device) => {
  ElMessageBox.confirm(
    'Are you sure to delete this device?',
    'Confirm Delete',
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deviceStore.deleteDevice(device.id)
      ElMessage.success('Device deleted successfully')
      await initData()
    } catch (error) {
      console.error('Delete failed:', error)
      ElMessage.error('Failed to delete device')
    }
  })
}

// 提交设备表单
const handleDeviceSubmit = async () => {
  if (!deviceFormRef.value) return

  try {
    await deviceFormRef.value.validate()
    
    if (dialogType.value === 'add') {
      await deviceStore.addDevice({
        deviceName: deviceForm.deviceName,
        deviceId: deviceForm.deviceId,
        locationId: deviceForm.locationId
      })
      ElMessage.success('Device added successfully')
    } else if (currentDevice.value) {
      await deviceStore.updateDevice(currentDevice.value.id, {
        deviceName: deviceForm.deviceName,
        locationId: deviceForm.locationId
      })
      ElMessage.success('Device updated successfully')
    }
    deviceDialogVisible.value = false
    await initData()
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      ElMessage.error(error.message)
    } else {
      console.error('Operation failed:', error)
      ElMessage.error('Operation failed')
    }
  }
}

// 格式化时间
const formatDateTime = (dateTime?: string) => {
  if (!dateTime) return '--'
  return new Date(dateTime).toLocaleString()
}

// 获取版本标签类型
const getVersionTagType = (version?: string) => {
  if (!version) return 'info'
  return 'success'
}

// 跳转到位置管理
const goToLocationManagement = () => {
  router.push({ name: 'settings-locations' })
}

// 组件挂载时初始化数据
onMounted(() => {
  initData()
})

// 修改设备状态的样式
const getBatteryColor = (level: number) => {
  if (level >= 70) return 'success'
  if (level >= 30) return 'warning'
  return 'danger'
}
</script>

<style scoped>
.device-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #606266;
  font-size: 13px;
  padding: 0 8px;
  border-left: 1px solid #dcdfe6;
}

.status-item:first-child {
  border-left: none;
}

.no-locations {
  padding: 12px;
  text-align: center;
  color: #909399;
}

.no-locations p {
  margin: 0 0 8px;
}

.device-details {
  padding: 0 12px;
}

:deep(.el-descriptions__label) {
  width: 120px;
}

.devices-header {
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

.devices-description {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.header-actions {
  display: flex;
  gap: 12px;
}
</style> 