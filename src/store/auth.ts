import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import { ElMessage } from 'element-plus'

interface Profile {
  id?: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  company?: string
  address?: string
  created_at?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    profile: null as Profile | null,
    isLoggedIn: false,
    loading: false,
    error: null as string | null
  }),

  getters: {
    userProfile: (state) => state.profile,
    getIsLoggedIn: (state) => state.isLoggedIn
  },

  actions: {
    async login(email: string, password: string) {
      try {
        this.loading = true
        this.error = null
        
        if (!email) {
          ElMessage({
            message: '请输入邮箱',
            type: 'error',
            duration: 3000,
            showClose: true,
            position: 'top',
          })
          throw new Error('请输入邮箱')
        }
        
        const normalizedEmail = String(email).toLowerCase().trim()
        
        console.log('Attempting login with normalized email:', normalizedEmail)
        
        const { data: matchedUser, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', normalizedEmail)
          .maybeSingle()

        console.log('Query result:', { matchedUser, error })

        if (error) {
          console.error('Login query error:', error)
          ElMessage({
            message: '登录失败，请重试',
            type: 'error',
            duration: 3000,
            showClose: true,
            position: 'top',
          })
          throw error
        }
        
        if (!matchedUser) {
          console.log('No user found with email:', normalizedEmail)
          ElMessage({
            message: '用户不存在',
            type: 'error',
            duration: 3000,
            showClose: true,
            position: 'top',
          })
          throw new Error('用户不存在')
        }

        if (matchedUser.password !== password) {
          ElMessage({
            message: '密码错误',
            type: 'error',
            duration: 3000,
            showClose: true,
            position: 'top',
          })
          throw new Error('密码错误')
        }

        console.log('Login successful:', matchedUser)

        this.profile = {
          id: matchedUser.id,
          email: matchedUser.email,
          first_name: matchedUser.first_name,
          last_name: matchedUser.last_name,
          phone: matchedUser.phone,
          company: matchedUser.company,
          address: matchedUser.address,
          created_at: matchedUser.created_at
        }
        
        this.isLoggedIn = true
        localStorage.setItem('userProfile', JSON.stringify(this.profile))
        
        return this.profile

      } catch (error: any) {
        console.error('Login error:', error)
        this.error = error.message
        ElMessage({
          message: this.error || '登录失败',
          type: 'error',
          duration: 3000,
          showClose: true,
          position: 'top',
        })
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(credentials: { 
      email: string
      password: string
      firstName: string
      lastName: string
      phone?: string
      company?: string
      address?: string
    }) {
      try {
        this.loading = true
        this.error = null

        // 检查邮箱是否已存在
        const { data: existingUser, error: checkError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', credentials.email)
          .maybeSingle()

        if (checkError) {
          console.error('Check existing user error:', checkError)
          ElMessage({
            message: '检查邮箱时出错，请重试',
            type: 'error',
            duration: 3000,
            showClose: true,
            position: 'top',
          })
          throw checkError
        }

        if (existingUser) {
          ElMessage({
            message: '该邮箱已被注册',
            type: 'error',
            duration: 3000,
            showClose: true,
            position: 'top',
          })
          throw new Error('该邮箱已被注册')
        }

        // 插入新用户数据
        const { data, error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              email: credentials.email,
              password: credentials.password,
              first_name: credentials.firstName,
              last_name: credentials.lastName,
              phone: credentials.phone,
              company: credentials.company,
              address: credentials.address
            }
          ])
          .select()
          .maybeSingle()

        if (insertError) {
          console.error('Insert user error:', insertError)
          ElMessage({
            message: '注册失败，请重试',
            type: 'error',
            duration: 3000,
            showClose: true,
            position: 'top',
          })
          throw insertError
        }

        if (!data) {
          ElMessage({
            message: '注册失败，请重试',
            type: 'error',
            duration: 3000,
            showClose: true,
            position: 'top',
          })
          throw new Error('注册失败，请重试')
        }

        console.log('Registration successful:', data)
        ElMessage({
          message: '注册成功！',
          type: 'success',
          duration: 3000,
          showClose: true,
          position: 'top',
        })
        return data

      } catch (error: any) {
        console.error('Registration error:', error)
        this.error = error.message
        ElMessage({
          message: this.error || '注册失败',
          type: 'error',
          duration: 3000,
          showClose: true,
          position: 'top',
        })
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.profile = null
      this.isLoggedIn = false
      localStorage.removeItem('userProfile')
    },

    async checkAuth() {
      const savedProfile = localStorage.getItem('userProfile')
      if (savedProfile) {
        this.profile = JSON.parse(savedProfile)
        this.isLoggedIn = true
      }
    }
  }
}) 