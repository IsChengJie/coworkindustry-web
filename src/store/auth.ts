import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { ElMessage } from 'element-plus'

interface UserInfo {
  email: string;
  token?: string;
}

interface State {
  user: User | null;
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    user: null,
    userInfo: null,
    isLoggedIn: false,
    error: null
  }),

  getters: {
    getUserInfo: (state) => state.userInfo,
    getIsLoggedIn: (state) => state.isLoggedIn
  },

  actions: {
    async login(credentials: { email: string; password: string }) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password
        })

        if (error) throw error

        if (data.user) {
          this.user = data.user
          this.userInfo = {
            email: data.user.email!,
            token: data.session?.access_token
          }
          this.isLoggedIn = true
        }

        return this.userInfo
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async register(credentials: { 
      email: string; 
      password: string;
      firstName: string;
      lastName: string;
      phone: string;
      company: string;
      address: string;
    }) {
      try {
        // 检查用户是否已存在
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', credentials.email)
          .maybeSingle()

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

        // 注册新用户
        const { error: signUpError } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password || '123456',
          options: {
            data: {
              first_name: credentials.firstName,
              last_name: credentials.lastName,
              phone: credentials.phone,
              company: credentials.company,
              address: credentials.address,
            }
          }
        })

        if (signUpError) throw signUpError

        // 插入新用户数据
        const { data: newUser, error: insertError } = await supabase
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

        if (!newUser) {
          ElMessage({
            message: '注册失败，请重试',
            type: 'error',
            duration: 3000,
            showClose: true,
            position: 'top',
          })
          throw new Error('注册失败，请重试')
        }

        console.log('Registration successful:', newUser)
        ElMessage({
          message: '注册成功！',
          type: 'success',
          duration: 3000,
          showClose: true,
          position: 'top',
        })
        
        return newUser

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
      }
    },

    logout() {
      this.user = null
      this.userInfo = null
      this.isLoggedIn = false
      localStorage.removeItem('userProfile')
    },

    async checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        this.user = session.user
        this.userInfo = {
          email: session.user.email!,
          token: session.access_token
        }
        this.isLoggedIn = true
      }
    },

    async resetPassword(email: string) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        throw error
      }
    }
  }
}) 