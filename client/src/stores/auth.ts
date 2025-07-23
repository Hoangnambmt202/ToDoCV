// src/stores/auth.ts
import { defineStore } from 'pinia'

interface User {
  name: string
  email: string
  token: string
  avatar:string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | User,
    loading: false,
  }),

  actions: {
    setUser(userData: any) {
      this.loading = true
      this.user = userData
    },
    logout() {
      this.loading = true
      this.user = null
    },
  },

  // ✅ Chỉ cần true, không cần paths
  persist: true,
})
