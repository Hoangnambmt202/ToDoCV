import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Task } from '@/types/task'

export const useSearchStore = defineStore('search', () => {
  const searchQuery = ref('')
  const searchResults = ref<Task[]>([])
  const isSearching = ref(false)
  const hasResults = ref(false)

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const setSearchResults = (results: Task[]) => {
    searchResults.value = results
    hasResults.value = results.length > 0
  }

  const setSearching = (searching: boolean) => {
    isSearching.value = searching
  }

  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
    hasResults.value = false
    isSearching.value = false
  }

  return {
    searchQuery,
    searchResults,
    isSearching,
    hasResults,
    setSearchQuery,
    setSearchResults,
    setSearching,
    clearSearch
  }
})
