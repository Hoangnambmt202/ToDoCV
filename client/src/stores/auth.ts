import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
  }),
  actions: {
    setUser(userData: any) {
      this.user = userData
    },
    logout() {
      this.user = null
    }
  },
})
