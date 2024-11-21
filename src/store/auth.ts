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
      const { data, error } = await supabase.auth.signUp({
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

      if (error) {
        throw error
      }

      return data
    },

    async logout() {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
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