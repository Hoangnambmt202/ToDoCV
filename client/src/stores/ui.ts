// uiStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const showRightSidebar = ref(false)

  const toggleRightSidebar = () => {
    showRightSidebar.value = !showRightSidebar.value
  }

  const setRightSidebar = (value: boolean) => {
    showRightSidebar.value = value
  }

  return {
    showRightSidebar,
    toggleRightSidebar,
    setRightSidebar,
  }
})
