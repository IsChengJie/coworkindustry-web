<template>
  <div class="settings-section">
    <div class="devices-header">
      <h2>设备管理</h2>
      <p class="devices-description">管理您的 iPads、Android 平板电脑或智能电视设备</p>
      <el-button type="primary" @click="showAddDeviceDialog">
        <el-icon><Plus /></el-icon>添加设备
      </el-button>
    </div>

    <el-table :data="devices" style="width: 100%; margin-top: 20px">
      <el-table-column prop="deviceName" label="设备名称" />
      <el-table-column prop="deviceId" label="设备ID" />
      <el-table-column prop="location" label="位置" />
      <el-table-column prop="appVersion" label="应用版本" />
      <el-table-column prop="lastActivity" label="最后活动时间" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑设备对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '添加设备' : '编辑设备'"
      v-model="deviceDialogVisible"
      width="500px">
      <el-form
        :model="deviceForm"
        :rules="deviceRules"
        ref="deviceFormRef"
        label-width="100px">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="deviceForm.deviceName" />
        </el-form-item>
        <el-form-item label="设备ID" prop="deviceId">
          <el-input v-model="deviceForm.deviceId" :disabled="dialogType === 'edit'" />
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-input v-model="deviceForm.location" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deviceDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleDeviceSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog
      title="确认删除"
      v-model="deleteDialogVisible"
      width="300px">
      <p>确定要删除该设备吗？此操作不可恢复。</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

interface Device {
  deviceName: string
  deviceId: string
  location: string
  appVersion?: string
  lastActivity?: string
}

const devices = ref<Device[]>([
  {
    deviceName: 'Reception',
    deviceId: '2mkkqw',
    location: 'Head Office',
    appVersion: '1.0.0',
    lastActivity: '2024-02-20'
  }
])

const deviceDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentDevice = ref<Device | null>(null)

const deviceForm = reactive({
  deviceName: '',
  deviceId: '',
  location: ''
})

const deviceRules = {
  deviceName: [
    { required: true, message: '请输入设备名称', trigger: 'blur' }
  ],
  deviceId: [
    { required: true, message: '请输入设备ID', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '请输入设备位置', trigger: 'blur' }
  ]
}

const deviceFormRef = ref<FormInstance>()

const showAddDeviceDialog = () => {
  dialogType.value = 'add'
  deviceForm.deviceName = ''
  deviceForm.deviceId = ''
  deviceForm.location = ''
  deviceDialogVisible.value = true
}

const handleEdit = (row: Device) => {
  dialogType.value = 'edit'
  currentDevice.value = row
  deviceForm.deviceName = row.deviceName
  deviceForm.deviceId = row.deviceId
  deviceForm.location = row.location
  deviceDialogVisible.value = true
}

const handleDelete = (row: Device) => {
  currentDevice.value = row
  deleteDialogVisible.value = true
}

const handleDeviceSubmit = async () => {
  if (!deviceFormRef.value) return

  try {
    await deviceFormRef.value.validate()
    
    if (dialogType.value === 'add') {
      devices.value.push({
        ...deviceForm,
        appVersion: '1.0.0',
        lastActivity: new Date().toISOString().split('T')[0]
      })
      ElMessage.success('设备添加成功')
    } else {
      const index = devices.value.findIndex(d => d.deviceId === currentDevice.value?.deviceId)
      if (index !== -1) {
        devices.value[index] = {
          ...devices.value[index],
          deviceName: deviceForm.deviceName,
          location: deviceForm.location
        }
        ElMessage.success('设备更新成功')
      }
    }
    deviceDialogVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const confirmDelete = () => {
  if (currentDevice.value) {
    const index = devices.value.findIndex(d => d.deviceId === currentDevice.value?.deviceId)
    if (index !== -1) {
      devices.value.splice(index, 1)
      ElMessage.success('设备已删除')
    }
    deleteDialogVisible.value = false
  }
}
</script>

<style scoped>
.devices-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.devices-description {
  color: #666;
  margin: 0;
  flex: 1;
  margin-left: 20px;
  margin-right: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 