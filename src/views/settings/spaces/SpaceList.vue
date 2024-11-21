<template>
  <div class="space-list">
    <div class="list-description">
      A space defines an open plan area such as a level, site or building
    </div>

    <div class="list-header">
      <el-input
        v-model="searchQuery"
        placeholder="Search by space"
        prefix-icon="Search"
        clearable
        class="search-input"
      />
      <el-button type="primary" @click="showAddSpaceDialog">
        <el-icon><Plus /></el-icon>Add Space
      </el-button>
    </div>

    <!-- 空间卡片列表 -->
    <div class="space-cards">
      <el-card 
        v-for="space in filteredSpaces" 
        :key="space.id" 
        class="space-card"
        shadow="hover">
        <div class="space-card-content">
          <div class="space-icon">
            <el-icon :size="24"><Grid /></el-icon>
          </div>
          <div class="space-info">
            <h3>{{ space.name }}</h3>
            <p class="location">{{ space.locationName }}</p>
            <div class="resource-count">
              {{ space.resourceCount }} resources
              <el-button 
                type="primary" 
                link 
                @click="manageResources(space)"
                v-if="space.resourceCount === 0">
                Manage
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 添加/编辑空间对话框 -->
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
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from '@/types'
import { Plus, Grid } from '@element-plus/icons-vue'
import { useLocationStore } from '@/store/location'
import { useSpaceStore } from '@/store/space'
import type { Space } from '@/types'

const locationStore = useLocationStore()
const spaceStore = useSpaceStore()

const locations = ref(await locationStore.fetchLocations())
const spaces = ref<Space[]>([])
const searchQuery = ref('')
const spaceDialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const currentSpace = ref<Space | null>(null)

const spaceForm = reactive({
  name: '',
  locationId: ''
})

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

const filteredSpaces = computed(() => {
  if (!searchQuery.value) return spaces.value
  const query = searchQuery.value.toLowerCase()
  return spaces.value.filter(space => 
    space.name.toLowerCase().includes(query) ||
    space.locationName.toLowerCase().includes(query)
  )
})

const showAddSpaceDialog = () => {
  dialogType.value = 'add'
  spaceForm.name = ''
  spaceForm.locationId = ''
  spaceDialogVisible.value = true
}

const handleSpaceSubmit = async () => {
  if (!spaceFormRef.value) return

  try {
    await spaceFormRef.value.validate()
    const location = locations.value.find(loc => loc.id === spaceForm.locationId)
    
    if (dialogType.value === 'add') {
      const newSpace: Space = {
        id: Date.now().toString(),
        name: spaceForm.name,
        locationId: spaceForm.locationId,
        locationName: location?.name || '',
        resourceCount: 0
      }
      spaces.value.unshift(newSpace)
      ElMessage.success('Space added successfully')
    } else if (currentSpace.value) {
      const index = spaces.value.findIndex(s => s.id === currentSpace.value?.id)
      if (index !== -1) {
        spaces.value[index] = {
          ...spaces.value[index],
          name: spaceForm.name,
          locationId: spaceForm.locationId,
          locationName: location?.name || ''
        }
      }
      ElMessage.success('Space updated successfully')
    }
    spaceDialogVisible.value = false
  } catch (error) {
    console.error('Operation failed:', error)
  }
}

const manageResources = (space: Space) => {
  // 切换到资源管理标签页，并传递当前空间信息
  emit('update:modelValue', 'resources')
  // 可以通过 pinia store 或其他方式传递选中的空间信息
}

// 初始化数据
const initData = async () => {
  try {
    const data = await spaceStore.fetchSpaces()
    spaces.value = data || []
    console.log('Spaces loaded:', spaces.value)
  } catch (error) {
    console.error('Failed to load spaces:', error)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  console.log('SpaceList mounted')
  initData()
})

// 添加 emit 定义
const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
.list-description {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 24px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.search-input {
  max-width: 300px;
}

.space-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.space-card {
  border: 1px solid var(--el-border-color-light);
  transition: all 0.3s ease;
}

.space-card-content {
  display: flex;
  gap: 16px;
  padding: 16px;
}

.space-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: var(--el-color-primary-light-9);
  border-radius: 8px;
  color: var(--el-color-primary);
}

.space-info {
  flex: 1;
}

.space-info h3 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.location {
  margin: 0 0 8px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.resource-count {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .space-cards {
    grid-template-columns: 1fr;
  }
}
</style> 