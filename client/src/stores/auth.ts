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
  }),

  actions: {
    setUser(userData: any) {
      this.user = userData
    },
    logout() {
      this.user = null
    },
  },

  // ✅ Chỉ cần true, không cần paths
  persist: true,
})
