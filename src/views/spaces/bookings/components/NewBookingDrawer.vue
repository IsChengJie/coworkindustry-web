<template>
  <el-drawer
    :model-value="visible"
    title="New Booking"
    size="520px"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <div class="drawer-content">
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
        <div class="selected-resources">
          0 resources selected
        </div>
        <div class="action-buttons">
          <el-button @click="handleClose">Cancel</el-button>
          <el-button type="primary" @click="handleSubmit">Submit</el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { 
  Monitor, 
  Mic, 
  VideoCamera, 
  Coffee, 
  Printer, 
  Connection 
} from '@element-plus/icons-vue'

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

const handleClose = () => {
  emit('update:visible', false)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      emit('submit', form.value)
      handleClose()
    }
  })
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

  .selected-resources {
    color: #6b7280;
    font-size: 14px;
    margin-bottom: 16px;
  }

  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
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
</style> 