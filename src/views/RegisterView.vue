<template>
  <div class="register-container">
    <div class="register-box">
      <div class="logo-section">
        <img src="@/assets/logo.svg" alt="Coworkindustry" class="logo" />
        <p class="subtitle">Start your free 14 day trial</p>
      </div>
      
      <div class="form-container">
        <el-form 
          ref="formRef"
          :model="registerForm"
          :rules="rules"
          label-position="top"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="First name" prop="firstName" required>
                <el-input 
                  v-model="registerForm.firstName"
                  :maxlength="55"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Last name" prop="lastName" required>
                <el-input 
                  v-model="registerForm.lastName"
                  :maxlength="55"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="Email" prop="email" required>
            <el-input v-model="registerForm.email" type="email" />
          </el-form-item>

          <el-form-item label="Password" prop="password" required>
            <el-input v-model="registerForm.password" type="password" show-password />
          </el-form-item>

          <el-form-item label="Confirm Password" prop="confirmPassword" required>
            <el-input v-model="registerForm.confirmPassword" type="password" show-password />
          </el-form-item>

          <el-form-item label="Phone number" prop="phone" required>
            <el-input v-model="registerForm.phone">
              <template #prepend>+1</template>
            </el-input>
          </el-form-item>

          <el-form-item label="Company" prop="company" required>
            <el-input 
              v-model="registerForm.company"
              :maxlength="100"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="Street address" prop="address" required>
            <el-input 
              v-model="registerForm.address"
              :maxlength="100"
              show-word-limit
            />
          </el-form-item>

          <div class="agreement">
            <el-checkbox v-model="registerForm.agreement">
              I agree to the <el-link type="primary">Terms of Service</el-link> and <el-link type="primary">Privacy Policy</el-link>
            </el-checkbox>
          </div>

          <el-button 
            type="primary"
            class="register-button"
            size="large"
            :loading="loading"
            @click="handleRegister"
          >
            Start my trial
          </el-button>

          <div class="login-link">
            Already have an account? <el-link type="primary" @click="goToLogin">Back to Login</el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const authStore = useAuthStore()

const registerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  company: '',
  address: '',
  agreement: false
})

const validatePass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('Please enter your password'))
  } else {
    if (registerForm.confirmPassword !== '') {
      if (formRef.value) {
        formRef.value.validateField('confirmPassword')
      }
    }
    callback()
  }
}

const validatePass2 = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('Please confirm your password'))
  } else if (value !== registerForm.password) {
    callback(new Error('Passwords do not match!'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  firstName: [
    { required: true, message: 'Please enter your first name', trigger: 'blur' },
    { min: 2, message: 'First name must be at least 2 characters', trigger: 'blur' }
  ],
  lastName: [
    { required: true, message: 'Please enter your last name', trigger: 'blur' },
    { min: 2, message: 'Last name must be at least 2 characters', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Please enter your phone number', trigger: 'blur' },
    { pattern: /^\d{10}$/, message: 'Please enter a valid phone number', trigger: 'blur' }
  ],
  company: [
    { required: true, message: 'Please enter your company name', trigger: 'blur' }
  ],
  address: [
    { required: true, message: 'Please enter your street address', trigger: 'blur' }
  ],
  password: [
    { required: true, validator: validatePass, trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass2, trigger: 'blur' }
  ]
})

const handleRegister = async () => {
  if (!formRef.value) return
  
  
  try {
    await formRef.value.validate()
    
    if (!registerForm.agreement) {
      ElMessage.warning('Please agree to the Terms of Service and Privacy Policy')
      return
    }
    
    loading.value = true
    
    await authStore.register({
      email: registerForm.email,
      password: registerForm.password,
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
      phone: registerForm.phone,
      company: registerForm.company,
      address: registerForm.address
    })
    
    ElMessage.success('Registration successful! Please check your email to verify your account.')
    router.push('/login')
  } catch (error: any) {
    console.error('Registration failed:', error)
    ElMessage.error(error.message || 'Registration failed')
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  padding: 20px;
}

.register-box {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 640px;
  overflow: hidden;
}

.logo-section {
  padding: 40px 20px;
  text-align: center;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.logo-section h1 {
  margin: 0;
  color: #1f2937;
  font-size: 28px;
  font-weight: 600;
}

.subtitle {
  margin: 12px 0 0;
  color: #6b7280;
  font-size: 16px;
}

.form-container {
  padding: 32px 40px 40px;
}

:deep(.el-form-item__label) {
  color: #374151;
  font-weight: 500;
  font-size: 14px;
}

.agreement {
  margin: 24px 0;
}

.register-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  margin-top: 16px;
}

.login-link {
  text-align: center;
  margin-top: 24px;
  color: #6b7280;
}

@media (max-width: 640px) {
  .register-box {
    max-width: 100%;
    border-radius: 0;
  }
  
  .form-container {
    padding: 24px 20px 32px;
  }
}

.logo {
  height: 40px;
  margin-bottom: 16px;
}
</style> 