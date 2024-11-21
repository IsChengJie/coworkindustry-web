import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface UserInfo {
  email: string;
  token?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    userInfo: null as UserInfo | null,
    isLoggedIn: false
  }),

  getters: {
    getUserInfo: (state) => state.userInfo,
    getIsLoggedIn: (state) => state.isLoggedIn
  },

  actions: {
    async login(credentials: { email: string; password: string }) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) {
        throw error
      }

      if (data.user) {
        this.user = data.user
        this.userInfo = {
          email: data.user.email!,
          token: data.session?.access_token
        }
        this.isLoggedIn = true
      }

      return this.userInfo
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
        // ���ȼ���û��Ƿ��Ѵ���
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', credentials.email)
          .maybeSingle()

        if (existingUser) {
          ElMessage({
            message: '�������ѱ�ע��',
            type: 'error',
            duration: 3000,
            showClose: true,
            position: 'top',
          })
          throw new Error('�������ѱ�ע��')
        }

        // ע�����û�
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

        // �������û�����
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
            message: 'ע��ʧ�ܣ�������',
            type: 'error',
            duration: 3000,
            showClose: true,
            position: 'top',
          })
          throw insertError
        }

        if (!newUser) {
          ElMessage({
            message: 'ע��ʧ�ܣ�������',
            type: 'error',
            duration: 3000,
            showClose: true,
            position: 'top',
          })
          throw new Error('ע��ʧ�ܣ�������')
        }
        }
        console.log('Registration successful:', newUser)
        ElMessage({
          message: 'ע��ɹ���',
          type: 'success',
          duration: 3000,
          showClose: true,
          position: 'top',
        })
        return newUser

      } catch (error: any) {
        console.error('Registration error:', error)
        console.log('Registration successful:', data)
        ElMessage({
          message: 'ע��ɹ���',
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
          message: this.error || 'ע��ʧ��',
          type: 'error',
          duration: 3000,
          showClose: true,
          position: 'top',
        })
        throw error
      }

      this.user = null
      this.userInfo = null
      this.isLoggedIn = false
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