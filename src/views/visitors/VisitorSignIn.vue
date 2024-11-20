<template>
  <div class="visitor-signin">
    <el-card class="signin-card">
      <template #header>
        <div class="card-header">
          <h2>访客签到</h2>
        </div>
      </template>
      
      <el-form 
        ref="formRef"
        :model="visitorForm"
        :rules="rules"
        label-position="top"
      >
        <!-- 访客信息 -->
        <el-form-item label="访客姓名" prop="name" required>
          <el-input v-model="visitorForm.name" placeholder="请输入姓名" />
        </el-form-item>
        
        <el-form-item label="公司名称" prop="company" required>
          <el-input v-model="visitorForm.company" placeholder="请输入公司名称" />
        </el-form-item>
        
        <el-form-item label="电子邮箱" prop="email" required>
          <el-input v-model="visitorForm.email" placeholder="请输入电子邮箱" />
        </el-form-item>
        
        <el-form-item label="手机号码" prop="phone" required>
          <el-input v-model="visitorForm.phone" placeholder="请输入手机号码" />
        </el-form-item>
        
        <!-- 访问目的 -->
        <el-form-item label="访问目的" prop="purpose" required>
          <el-select v-model="visitorForm.purpose" placeholder="请选择访问目的" style="width: 100%">
            <el-option label="商务会议" value="business" />
            <el-option label="面试" value="interview" />
            <el-option label="送货" value="delivery" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        
        <!-- 接待人 -->
        <el-form-item label="接待人" prop="host" required>
          <el-select
            v-model="visitorForm.host"
            filterable
            placeholder="请选择接待人"
            style="width: 100%"
          >
            <el-option
              v-for="host in hosts"
              :key="host.id"
              :label="host.name"
              :value="host.id"
            />
          </el-select>
        </el-form-item>
        
        <!-- 健康声明 -->
        <div class="health-declaration">
          <h3>健康声明</h3>
          <el-checkbox v-model="visitorForm.healthDeclaration">
            我声明我目前没有任何流感症状，且在过去14天内未接触过COVID-19确诊病例
          </el-checkbox>
        </div>
        
        <!-- 隐私政策 -->
        <div class="privacy-policy">
          <el-checkbox v-model="visitorForm.privacyAgreement">
            我同意 <el-link type="primary">隐私政策</el-link> 中规定的数据收集和使用条款
          </el-checkbox>
        </div>
        
        <!-- 签到按钮 -->
        <el-button 
          type="primary"
          class="signin-button"
          :loading="loading"
          @click="handleSignIn"
        >
          签到
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const formRef = ref<FormInstance>()
const loading = ref(false)

// 模拟接待人数据
const hosts = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' }
]

const visitorForm = reactive({
  name: '',
  company: '',
  email: '',
  phone: '',
  purpose: '',
  host: '',
  healthDeclaration: false,
  privacyAgreement: false
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入访客姓名', trigger: 'blur' },
    { min: 2, message: '姓名长度不能小于2个字符', trigger: 'blur' }
  ],
  company: [
    { required: true, message: '请输入公司名称', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入电子邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的电子邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  purpose: [
    { required: true, message: '请选择访问目的', trigger: 'change' }
  ],
  host: [
    { required: true, message: '请选择接待人', trigger: 'change' }
  ]
})

const handleSignIn = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (!visitorForm.healthDeclaration) {
      ElMessage.warning('请确认健康声明')
      return
    }
    
    if (!visitorForm.privacyAgreement) {
      ElMessage.warning('请同意隐私政策')
      return
    }
    
    loading.value = true
    // TODO: 实现签到逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('签到成功')
    // 重置表单
    formRef.value.resetFields()
    visitorForm.healthDeclaration = false
    visitorForm.privacyAgreement = false
    
  } catch (error) {
    console.error('签到失败:', error)
    ElMessage.error('签到失败，请检查表单信息')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.visitor-signin {
  max-width: 600px;
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

.health-declaration,
.privacy-policy {
  margin: 24px 0;
}

.health-declaration h3 {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 500;
}

.signin-button {
  width: 100%;
  height: 44px;
  margin-top: 24px;
  font-size: 16px;
}
</style> 