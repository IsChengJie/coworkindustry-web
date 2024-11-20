<template>
  <div class="quick-signin">
    <el-card class="signin-card">
      <template #header>
        <div class="card-header">
          <h2>快速签到</h2>
        </div>
      </template>
      
      <el-form 
        ref="formRef"
        :model="visitorForm"
        :rules="rules"
        label-position="top"
      >
        <!-- 访客类型选择 -->
        <div class="visitor-types">
          <el-radio-group v-model="visitorForm.type" size="large">
            <el-radio-button 
              v-for="type in visitorTypes" 
              :key="type.id"
              :label="type.id"
            >
              <el-icon :style="{ color: type.color }">
                <component :is="type.icon" />
              </el-icon>
              {{ type.name }}
            </el-radio-button>
          </el-radio-group>
        </div>

        <!-- 访客信息 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name" required>
              <el-input v-model="visitorForm.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司" prop="company" required>
              <el-input v-model="visitorForm.company" placeholder="请输入公司名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 接待人选择 -->
        <el-form-item label="接待人" prop="host" required>
          <el-select
            v-model="visitorForm.host"
            filterable
            remote
            :remote-method="searchHosts"
            :loading="hostSearchLoading"
            placeholder="搜索接待人"
          >
            <el-option
              v-for="host in hostOptions"
              :key="host.id"
              :label="host.name"
              :value="host.id"
            >
              <div class="host-option">
                <span>{{ host.name }}</span>
                <small>{{ host.department }}</small>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 访客数量 -->
        <el-form-item label="访客数量" prop="groupSize">
          <el-input-number 
            v-model="visitorForm.groupSize"
            :min="1"
            :max="20"
            controls-position="right"
          />
        </el-form-item>

        <!-- 健康声明 -->
        <div class="health-declaration">
          <el-checkbox v-model="visitorForm.healthDeclaration">
            我声明我和我的团队成员目前没有任何流感症状
          </el-checkbox>
        </div>

        <!-- 签到按钮 -->
        <el-button 
          type="primary"
          class="signin-button"
          size="large"
          :loading="loading"
          @click="handleQuickSignIn"
        >
          快速签到
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { Host } from '@/types/visitor'
import {
  Briefcase,
  User,
  Van,
  Tools
} from '@element-plus/icons-vue'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const hostSearchLoading = ref(false)

// 访客类型
const visitorTypes = [
  { id: 'business', name: '商务访客', color: '#409EFF', icon: 'Briefcase' },
  { id: 'interview', name: '面试者', color: '#67C23A', icon: 'User' },
  { id: 'delivery', name: '送货', color: '#E6A23C', icon: 'Van' },
  { id: 'contractor', name: '承包商', color: '#F56C6C', icon: 'Tools' }
]

const visitorForm = reactive({
  type: 'business',
  name: '',
  company: '',
  host: '',
  groupSize: 1,
  healthDeclaration: false
})

const hostOptions = ref<Host[]>([])

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, message: '姓名长度不能小于2个字符', trigger: 'blur' }
  ],
  company: [
    { required: true, message: '请输入公司名称', trigger: 'blur' }
  ],
  host: [
    { required: true, message: '请选择接待人', trigger: 'change' }
  ]
})

// 搜索接待人
const searchHosts = async (query: string) => {
  if (query) {
    hostSearchLoading.value = true
    try {
      // TODO: 实现接待人搜索API
      await new Promise(resolve => setTimeout(resolve, 1000))
      hostOptions.value = [
        { id: '1', name: '张三', department: '技术部', email: 'zhangsan@example.com' },
        { id: '2', name: '李四', department: '市场部', email: 'lisi@example.com' }
      ].filter(host => host.name.includes(query))
    } finally {
      hostSearchLoading.value = false
    }
  } else {
    hostOptions.value = []
  }
}

// 处理快速签到
const handleQuickSignIn = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (!visitorForm.healthDeclaration) {
      ElMessage.warning('请确认健康声明')
      return
    }
    
    loading.value = true
    // TODO: 实现签到API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('签到成功')
    router.push('/visitors')
    
  } catch (error) {
    console.error('签到失败:', error)
    ElMessage.error('签到失败，请检查表单信息')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.quick-signin {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.signin-card {
  border-radius: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.visitor-types {
  margin-bottom: 24px;
  text-align: center;
}

.visitor-types :deep(.el-radio-button__inner) {
  padding: 12px 24px;
}

.visitor-types .el-icon {
  margin-right: 8px;
  font-size: 18px;
}

.host-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.host-option small {
  color: #909399;
}

.health-declaration {
  margin: 24px 0;
}

.signin-button {
  width: 100%;
  height: 44px;
  margin-top: 24px;
  font-size: 16px;
}
</style> 