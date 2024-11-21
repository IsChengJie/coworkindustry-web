<template>
  <div class="space-list">
    <div class="list-header">
      <el-input
        v-model="searchQuery"
        placeholder="Search by space name"
        prefix-icon="Search"
        clearable
        class="search-input"
      />
      <el-button type="primary" @click="showAddSpaceDialog">
        <el-icon><Plus /></el-icon>Add Space
      </el-button>
    </div>

    <el-table :data="filteredSpaces" style="width: 100%; margin-top: 20px">
      <el-table-column prop="name" label="Space Name" min-width="150" show-overflow-tooltip />
      <el-table-column prop="locationName" label="Location" min-width="150" show-overflow-tooltip />
      <el-table-column label="Resources" width="120" align="center">
        <template #default="scope">
          <el-tag size="small" type="info">{{ scope.row.resourceCount }} Resources</el-tag>
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

    <!-- Add/Edit Space Dialog -->
    <el-dialog
      :title="dialogType === 'add' ? 'Add Space' : 'Edit Space'"
      v-model="spaceDialogVisible"
      width="460px">
      <el-form
        :model="spaceForm"
        :rules="spaceRules"
        ref="spaceFormRef"
        label-width="100px">
        <el-form-item label="Space Name" prop="name">
          <el-input v-model="spaceForm.name" placeholder="Enter space name" />
        </el-form-item>
        <el-form-item label="Location" prop="locationId">
          <el-select 
            v-model="spaceForm.locationId" 
            placeholder="Select location"
            style="width: 100%">
            <el-option
              v-for="location in locations"
              :key="location.id"
              :label="location.name"
              :value="location.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="spaceDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleSpaceSubmit">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { Plus, ArrowDown, Edit, Delete, Search } from '@element-plus/icons-vue'
import { useLocationStore } from '@/store/location'
import { useSpaceStore } from '@/store/space'
import type { Space } from '@/types'

const router = useRouter()
const locationStore = useLocationStore()
const spaceStore = useSpaceStore()

// 状态管理
const locations = ref(await locationStore.fetchLocations())
const spaces = ref<Space[]>([])
const searchQuery = ref('')
const spaceDialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentSpace = ref<Space | null>(null)

// 表单状态
const spaceForm = reactive({
  name: '',
  locationId: ''
})

// 表单验证规则
const spaceRules = {
  name: [
    { required: true, message: 'Please enter space name', trigger: 'blur' },
    { validator: validateSpaceName, trigger: 'blur' }
  ],
  locationId: [
    { required: true, message: 'Please select location', trigger: 'change' }
  ]
}

const spaceFormRef = ref<FormInstance>()

// 验证空间名称是否重复
async function validateSpaceName(rule: any, value: string, callback: any) {
  if (dialogType.value === 'add' || 
      (dialogType.value === 'edit' && value !== currentSpace.value?.name)) {
    const exists = spaces.value.some(space => space.name === value)
    if (exists) {
      callback(new Error('Space name already exists'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 过滤空间列表
const filteredSpaces = computed(() => {
  if (!searchQuery.value) return spaces.value
  const query = searchQuery.value.toLowerCase()
  return spaces.value.filter(space => 
    space.name.toLowerCase().includes(query) ||
    space.locationName.toLowerCase().includes(query)
  )
})

// 添加空间
const showAddSpaceDialog = () => {
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
  spaceForm.name = ''
  spaceForm.locationId = ''
  spaceDialogVisible.value = true
}

// 编辑空间
const handleEdit = (space: Space) => {
  dialogType.value = 'edit'
  currentSpace.value = space
  spaceForm.name = space.name
  spaceForm.locationId = space.locationId
  spaceDialogVisible.value = true
}

// 删除空间
const handleDelete = (space: Space) => {
  ElMessageBox.confirm(
    'Are you sure to delete this space?',
    'Confirm Delete',
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await spaceStore.deleteSpace(space.id)
      ElMessage.success('Space deleted successfully')
      await initData()
    } catch (error: any) {
      ElMessage.error(error.message || 'Delete failed')
    }
  }).catch(() => {})
}

// 提交表单
const handleSpaceSubmit = async () => {
  if (!spaceFormRef.value) return

  try {
    await spaceFormRef.value.validate()
    
    if (dialogType.value === 'add') {
      await spaceStore.addSpace({
        name: spaceForm.name,
        locationId: spaceForm.locationId,
        locationName: ''  // 会在 store 中自动设置
      })
      ElMessage.success('Space added successfully')
    } else if (currentSpace.value) {
      await spaceStore.updateSpace(currentSpace.value.id, {
        name: spaceForm.name,
        locationId: spaceForm.locationId
      })
      ElMessage.success('Space updated successfully')
    }
    spaceDialogVisible.value = false
    await initData()
  } catch (error: any) {
    ElMessage.error(error.message || 'Operation failed')
  }
}

// 初始化数据
const initData = async () => {
  try {
    // 先获取位置列表
    const locationData = await locationStore.fetchLocations()
    locations.value = locationData

    // 再获取空间列表
    const data = await spaceStore.fetchSpaces()
    spaces.value = data
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  initData()
})
</script>

<style scoped>
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.search-input {
  max-width: 300px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.text-danger {
  color: var(--el-color-danger);
}
</style> 