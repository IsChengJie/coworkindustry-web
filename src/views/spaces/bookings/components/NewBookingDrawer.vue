<template>
  <el-drawer
    :model-value="visible"
    :title="currentStep === 1 ? 'New Booking' : 'Select Resource'"
    size="520px"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <!-- 第一步：填写预订信息 -->
    <div v-if="currentStep === 1" class="drawer-content">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="booking-form"
      >
        <!-- Who is booking? -->
        <el-form-item 
          label="Who is booking?" 
          prop="employee"
          required
        >
          <el-input
            v-model="form.employee"
            placeholder="Search employee..."
            clearable
          />
        </el-form-item>

        <!-- What are they booking? -->
        <el-form-item 
          label="What are they booking?" 
          prop="resource"
          required
        >
          <el-select
            v-model="form.resource"
            placeholder="Select resource"
            class="w-full"
            clearable
          >
            <el-option label="Meeting Room" value="meeting_room" />
            <el-option label="Desk" value="desk" />
          </el-select>
        </el-form-item>

        <!-- Location & Space -->
        <div class="form-row">
          <el-form-item 
            label="Location" 
            prop="location"
            required
            class="form-col"
          >
            <el-select
              v-model="form.location"
              placeholder="Select location"
              class="w-full"
              clearable
            >
              <el-option label="Head Office" value="head_office" />
            </el-select>
          </el-form-item>

          <el-form-item 
            label="Space" 
            prop="space"
            required
            class="form-col"
          >
            <el-select
              v-model="form.space"
              placeholder="Select space"
              class="w-full"
              clearable
            >
              <el-option label="Any" value="any" />
            </el-select>
          </el-form-item>
        </div>

        <!-- Start Date & Time -->
        <div class="flex gap-4">
          <el-form-item 
            label="Start Date" 
            prop="startDate"
            required
            class="flex-1"
          >
            <el-date-picker
              v-model="form.startDate"
              type="date"
              placeholder="Select date"
              class="w-full"
            />
          </el-form-item>
          <el-form-item 
            label="Start Time" 
            prop="startTime"
            required
            class="flex-1"
          >
            <el-time-picker
              v-model="form.startTime"
              format="HH:mm"
              placeholder="Select time"
              class="w-full"
            />
          </el-form-item>
        </div>

        <!-- End Date & Time -->
        <div class="flex gap-4">
          <el-form-item 
            label="End Date" 
            prop="endDate"
            required
            class="flex-1"
          >
            <el-date-picker
              v-model="form.endDate"
              type="date"
              placeholder="Select date"
              class="w-full"
            />
          </el-form-item>
          <el-form-item 
            label="End Time" 
            prop="endTime"
            required
            class="flex-1"
          >
            <el-time-picker
              v-model="form.endTime"
              format="HH:mm"
              placeholder="Select time"
              class="w-full"
            />
          </el-form-item>
        </div>

        <!-- Features 字段改为下拉多选 -->
        <el-form-item label="Features" prop="features">
          <el-select
            v-model="form.features"
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="Select features"
            class="w-full"
            clearable
          >
            <el-option
              v-for="feature in availableFeatures"
              :key="feature.value"
              :label="feature.label"
              :value="feature.value"
            >
              <div class="feature-option">                
                <div class="feature-info">
                  <span class="feature-name">{{ feature.label }}</span>
                  <span class="feature-description">{{ feature.description }}</span>
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 底部按钮 -->
      <div class="drawer-footer">
        <div class="action-buttons">
          <el-button @click="handleClose">Cancel</el-button>
          <el-button 
            type="primary" 
            class="available-resources-btn"
            :disabled="availableResourcesCount === 0"
            @click="handleNext"
          >
            {{ availableResourcesCount }} available resources
          </el-button>
        </div>
      </div>
    </div>

    <!-- 第二步：选择资源 -->
    <div v-else class="drawer-content">
      <!-- 头部信息展示 -->
      <div class="resource-header">
        <div class="location-time">
          <div class="location">{{ form.location }}</div>
          <div class="time-range">{{ formatDateRange() }}</div>
        </div>
      </div>

      <!-- 资源列表 -->
      <div class="resource-list">
        <el-radio-group v-model="selectedResource" class="resource-options">
          <div 
            v-for="resource in availableResources" 
            :key="resource.id"
            class="resource-item"
            :class="{ 'is-selected': selectedResource === resource.id }"
          >
            <el-radio :label="resource.id" class="resource-radio">
              <div class="resource-info">
                <div class="resource-main">
                  <div class="resource-name">{{ resource.name }}</div>
                  <div class="resource-meta">
                    <span class="capacity">
                      <el-icon><User /></el-icon>
                      {{ resource.capacity }} capacity
                    </span>
                  </div>
                </div>
                <div class="resource-features">
                  <el-tag 
                    v-for="feature in resource.features" 
                    :key="feature"
                    size="small"
                    effect="plain"
                    class="feature-tag"
                  >
                    {{ feature }}
                  </el-tag>
                </div>
              </div>
            </el-radio>
          </div>
        </el-radio-group>
      </div>

      <!-- 底部按钮 -->
      <div class="drawer-footer">
        <div class="action-buttons">
          <el-button @click="currentStep = 1">
            <el-icon class="el-icon--left"><ArrowLeft /></el-icon>
            Back
          </el-button>
          <el-button 
            type="primary"
            :disabled="!selectedResource"
            @click="handleSubmit"
          >
            Confirm Booking
          </el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, defineEmits, computed, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { 
  Monitor, 
  Mic, 
  VideoCamera, 
  Coffee, 
  Printer, 
  Connection, 
  User, 
  ArrowLeft 
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const emit = defineEmits(['update:visible', 'submit'])

const props = defineProps<{
  visible: boolean
}>()

const formRef = ref<FormInstance>()
const form = ref({
  employee: '',
  resource: '',
  location: '',
  space: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  features: [] as string[]
})

const rules: FormRules = {
  employee: [{ required: true, message: 'Please select an employee', trigger: 'change' }],
  resource: [{ required: true, message: 'Please select a resource', trigger: 'change' }],
  location: [{ required: true, message: 'Please select a location', trigger: 'change' }],
  space: [{ required: true, message: 'Please select a space', trigger: 'change' }],
  startDate: [{ required: true, message: 'Please select start date', trigger: 'change' }],
  startTime: [{ required: true, message: 'Please select start time', trigger: 'change' }],
  endDate: [{ required: true, message: 'Please select end date', trigger: 'change' }],
  endTime: [{ required: true, message: 'Please select end time', trigger: 'change' }],
  features: [{ type: 'array', message: 'Please select at least one feature' }]
}

// 步骤控制
const currentStep = ref(1)
const selectedResource = ref('')

// 模拟可用资源数据
const availableResources = ref([
  {
    id: 1,
    name: 'Meeting Room A',
    capacity: 8,
    features: ['Display', 'Whiteboard']
  },
  {
    id: 2,
    name: 'Meeting Room B',
    capacity: 12,
    features: ['Display', 'Video Conference']
  }
])

// 格式化日期范围显示
const formatDateRange = () => {
  const startDate = dayjs(form.value.startDate).format('MMM D, YYYY')
  const startTime = dayjs(form.value.startTime).format('HH:mm')
  const endDate = dayjs(form.value.endDate).format('MMM D, YYYY')
  const endTime = dayjs(form.value.endTime).format('HH:mm')
  
  return `${startDate} ${startTime} - ${endDate} ${endTime}`
}

const handleClose = () => {
  currentStep.value = 1
  selectedResource.value = ''
  emit('update:visible', false)
}

const handleSubmit = () => {
  if (!selectedResource.value) return
  
  emit('submit', {
    ...form.value,
    resourceId: selectedResource.value
  })
  handleClose()
}

// 可用功能列表
const availableFeatures = [
  {
    label: 'Display',
    value: 'display',
    icon: Monitor,
    description: 'External display/TV screen'
  },
  {
    label: 'Microphone',
    value: 'microphone',
    icon: Mic,
    description: 'Conference microphone system'
  },
  {
    label: 'Camera',
    value: 'camera',
    icon: VideoCamera,
    description: 'Video conferencing camera'
  },
  {
    label: 'Coffee',
    value: 'coffee',
    icon: Coffee,
    description: 'Coffee machine access'
  },
  {
    label: 'Printer',
    value: 'printer',
    icon: Printer,
    description: 'Printer/Scanner access'
  },
  {
    label: 'Internet',
    value: 'internet',
    icon: Connection,
    description: 'High-speed internet'
  }
]

// 模拟API调用获取可用资源数量
const getAvailableResourcesCount = async (params: any): Promise<number> => {
  // 这里替换为实际的API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟根据表单数据返回不同的资源数量
      const hasValidDates = params.startDate && params.endDate
      resolve(hasValidDates ? 5 : 0)
    }, 500)
  })
}

// 监听表单变化并更新可用资源数量
const availableResourcesCount = ref(0)
const updateAvailableResources = async () => {
  const params = {
    location: form.value.location,
    space: form.value.space,
    startDate: form.value.startDate,
    startTime: form.value.startTime,
    endDate: form.value.endDate,
    endTime: form.value.endTime,
    features: form.value.features
  }
  
  availableResourcesCount.value = await getAvailableResourcesCount(params)
}

// 监听关键字段变化
watch(
  () => ({
    location: form.value.location,
    space: form.value.space,
    startDate: form.value.startDate,
    startTime: form.value.startTime,
    endDate: form.value.endDate,
    endTime: form.value.endTime,
    features: form.value.features
  }),
  async () => {
    await updateAvailableResources()
  },
  { deep: true }
)

// 处理下一步
const handleNext = async () => {
  if (!formRef.value) return
  
  // 验证表单
  const valid = await formRef.value.validate()
  if (valid && availableResourcesCount.value > 0) {
    currentStep.value = 2
  }
}
</script>

<style scoped lang="scss">
.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.booking-form {
  flex: 1;
  overflow-y: auto;
  padding: 20px 20px 0 20px;

  .form-row {
    display: flex;
    margin: 0 -8px;
    width: calc(100% + 16px);
    
    .form-col {
      flex: 1;
      padding: 0 8px;
      min-width: 0;
      width: 50%;

      :deep(.el-form-item__content) {
        width: 100%;
      }
    }
  }

  :deep(.el-form-item) {
    margin-bottom: 24px;
    width: 100%;
    border: none;

    .el-form-item__content {
      width: 100%;
    }

    // 修复输入框样式
    .el-input__wrapper,
    .el-select .el-input__wrapper,
    .el-date-editor.el-input__wrapper,
    .el-time-picker .el-input__wrapper {
      width: 100%;
      box-shadow: 0 0 0 1px #dcdfe6 inset;
      
      &:hover {
        box-shadow: 0 0 0 1px #c0c4cc inset;
      }
      
      &.is-focus {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset;
      }
    }
  }

  // 优化两列布局的间距
  .flex.gap-4 {
    gap: 12px;
    margin: 0 -6px;
    
    .el-form-item {
      padding: 0 6px;
      margin-bottom: 24px;
      flex: 1;
      min-width: 0;
    }
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
    
    &:hover {
      background: #999;
    }
  }
}

.drawer-footer {
  flex-shrink: 0;
  margin-top: auto;
  padding: 16px 20px;
  background-color: #fff;
  border-top: 1px solid #f0f0f0;

  .action-buttons {
    display: flex;
    justify-content: space-between; // 改为两端对齐
    gap: 12px;
  }

  .available-resources-btn {
    flex: 1; // 让按钮占据剩余空间
    max-width: 200px; // 限制最大宽度
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}

:deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  margin-right: 0;
}

:deep(.el-drawer__body) {
  padding: 0;
  overflow: hidden;
}

// 优化表单控件样式
:deep {
  .el-input__wrapper,
  .el-select .el-input__wrapper,
  .el-date-editor.el-input__wrapper {
    box-shadow: 0 0 0 1px #dcdfe6 inset !important;
    
    &:hover {
      box-shadow: 0 0 0 1px #c0c4cc inset !important;
    }
    
    &.is-focus {
      box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
    }
  }

  .el-form-item__label {
    padding-bottom: 8px;
    font-weight: 500;
    color: #374151;
  }

  .el-form-item__content {
    width: 100%;
  }

  // 确保所有输入框宽度一致
  .el-input,
  .el-select,
  .el-date-editor,
  .el-time-picker {
    width: 100%;
  }

  .el-select__wrapper {
    width: 100%;
  }
}

.feature-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.feature-icon {
  font-size: 20px;
  color: #6b7280;
}

.feature-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.feature-name {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.feature-description {
  font-size: 12px;
  color: #6b7280;
}

:deep(.el-select-dropdown__item) {
  padding: 0 12px;

  &.selected {
    .feature-icon {
      color: var(--el-color-primary);
    }
  }
}

:deep(.el-select) {
  width: 100%;
  
  .el-select__tags {
    margin: 3px 0;
  }
}

.resource-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.resource-header {
  padding: 20px 24px;
  background-color: #f9fafb;
  border-bottom: 1px solid #f0f0f0;

  .location-time {
    .location {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 4px;
    }

    .time-range {
      font-size: 14px;
      color: #6b7280;
    }
  }
}

.resource-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.resource-item {
  width: 100%;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }

  &.is-selected {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
    
    .resource-name {
      color: var(--el-color-primary);
    }
  }
}

.resource-radio {
  width: 100%;
  padding: 16px;
  margin: 0;
  height: auto;

  :deep(.el-radio__input) {
    align-self: flex-start;
    margin-top: 4px;
  }

  :deep(.el-radio__label) {
    padding: 0 0 0 12px;
    width: calc(100% - 24px); // 减去单选框的宽度
  }
}

.resource-info {
  width: 100%;
}

.resource-main {
  margin-bottom: 12px;
}

.resource-name {
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
  font-size: 15px;
}

.resource-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #6b7280;
  font-size: 13px;

  .capacity {
    display: flex;
    align-items: center;
    gap: 4px;

    .el-icon {
      font-size: 14px;
    }
  }
}

.resource-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .feature-tag {
    font-size: 12px;
    padding: 0 8px;
    height: 24px;
    line-height: 22px;
    background-color: #f3f4f6;
    border-color: transparent;
    color: #374151;
  }
}

// 优化单选框组件的样式
:deep(.el-radio-group) {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

:deep(.el-radio) {
  display: flex;
  margin-right: 0;
  
  .el-radio__label {
    flex: 1;
  }
}

.drawer-footer {
  flex-shrink: 0;
  margin-top: auto;
  padding: 16px 24px;
  background-color: #fff;
  border-top: 1px solid #f0f0f0;

  .action-buttons {
    display: flex;
    justify-content: space-between;
    gap: 12px;

    .el-button {
      min-width: 100px;
    }
  }
}

// 优化滚动条样式
.resource-list {
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
    
    &:hover {
      background: #9ca3af;
    }
  }
}

// 添加选择动画
.resource-item {
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--el-color-primary);
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  &.is-selected::before {
    opacity: 0.05;
  }

  // 添加点击涟漪效果
  &:active::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  }
}

@keyframes ripple {
  to {
    transform: translate(-50%, -50%) scale(4);
    opacity: 0;
  }
}
</style> 