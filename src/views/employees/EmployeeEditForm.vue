<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isNew ? 'Add Employee' : 'Edit Employee'"
    width="60%"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="First Name" prop="first_name">
            <el-input v-model="form.first_name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Last Name" prop="last_name">
            <el-input v-model="form.last_name" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Email" prop="email">
            <el-input v-model="form.email" type="email" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Phone" prop="phone">
            <el-input v-model="form.phone" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Department" prop="department">
            <el-input v-model="form.department" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Position" prop="position">
            <el-input v-model="form.position" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Start Date" prop="start_date">
            <el-date-picker
              v-model="form.start_date"
              type="date"
              placeholder="Select date"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Status" prop="status">
            <el-select v-model="form.status" style="width: 100%">
              <el-option label="Active" value="active" />
              <el-option label="Inactive" value="inactive" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="Address" prop="address">
        <el-input v-model="form.address" type="textarea" />
      </el-form-item>

      <el-form-item label="Notes" prop="notes">
        <el-input v-model="form.notes" type="textarea" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isNew ? 'Create' : 'Update' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { supabase } from '@/lib/supabase'

const props = defineProps<{
  visible: boolean
  employeeId?: string
}>()

const emit = defineEmits(['update:visible', 'saved'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const isNew = computed(() => !props.employeeId)
const loading = ref(false)
const formRef = ref<FormInstance>()

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  start_date: '',
  status: 'active',
  address: '',
  notes: ''
})

const rules = reactive<FormRules>({
  first_name: [{ required: true, message: 'Please input first name', trigger: 'blur' }],
  last_name: [{ required: true, message: 'Please input last name', trigger: 'blur' }],
  email: [
    { required: true, message: 'Please input email', trigger: 'blur' },
    { type: 'email', message: 'Please input correct email address', trigger: 'blur' }
  ],
  department: [{ required: true, message: 'Please input department', trigger: 'blur' }],
  position: [{ required: true, message: 'Please input position', trigger: 'blur' }]
})

// 获取员工信息
const fetchEmployee = async () => {
  if (!props.employeeId) return
  
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', props.employeeId)
      .single()

    if (error) throw error
    if (data) Object.assign(form, data)
  } catch (error) {
    console.error('Error fetching employee:', error)
    ElMessage.error('Failed to fetch employee data')
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true

    const employeeData = { ...form }
    let result

    if (isNew.value) {
      result = await supabase
        .from('employees')
        .insert([employeeData])
        .select()
        .single()
    } else {
      result = await supabase
        .from('employees')
        .update(employeeData)
        .eq('id', props.employeeId)
        .select()
        .single()
    }

    if (result.error) throw result.error

    ElMessage.success(`Employee ${isNew.value ? 'created' : 'updated'} successfully`)
    emit('saved')
    dialogVisible.value = false
  } catch (error) {
    console.error('Error saving employee:', error)
    ElMessage.error(`Failed to ${isNew.value ? 'create' : 'update'} employee`)
  } finally {
    loading.value = false
  }
}

// 监听对话框显示状态
watch(() => props.visible, (newVal) => {
  if (newVal && props.employeeId) {
    fetchEmployee()
  }
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style> 