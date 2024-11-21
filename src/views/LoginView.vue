<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo-section">
        <img src="@/assets/logo.svg" alt="Coworkindustry" class="logo" />
        <p class="subtitle">Sign in to your account</p>
      </div>
      
      

      
      <div class="form-container">
        <el-form 
          ref="formRef"
          :model="loginForm"
          :rules="rules"
          label-position="top"
        >
          <el-form-item label="Email" prop="email" required>
            <el-input 
              v-model="loginForm.email"
              type="email"
              size="large"
            />
          </el-form-item>
          
          <el-form-item label="Password" prop="password" required>
            <el-input
              v-model="loginForm.password"
              type="password"
              size="large"
              show-password
            />
          </el-form-item>
          
          <div class="remember-forgot">
            <el-checkbox v-model="loginForm.rememberMe">Remember me</el-checkbox>
            <el-link type="primary">Forgot password?</el-link>
          </div>
          
          <el-button 
            type="primary"
            class="login-button"
            size="large"
            :loading="loading"
            @click="handleLogin"
          >
            Sign in
          </el-button>
          
          <div class="register-link">
            Don't have an account? <el-link type="primary" @click="goToRegister">Start a free trial</el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus/es/components/form'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const rules = reactive<FormRules>({
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ]
})

const handleLogin = async () => {
  if (!formRef.value) return
  
  try {
    loading.value = true
    await formRef.value.validate()
    
    await authStore.login({
      email: loginForm.email,
      password: loginForm.password
    })

    ElMessage.success('Login successful')
    const redirectPath = (route.query.redirect as string) || '/'
    router.push(redirectPath)

  } catch (error: any) {
    console.error('Login failed:', error)
    ElMessage.error(error.message || 'Invalid email or password')
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  padding: 20px;
}

.login-box {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 440px;
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

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0 24px;
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
}

.register-link {
  text-align: center;
  margin-top: 24px;
  color: #6b7280;
}

@media (max-width: 640px) {
  .login-box {
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