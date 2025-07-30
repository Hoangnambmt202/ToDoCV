<template>
  <div class="relative w-full">
    <!-- Search Input -->
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tìm kiếm công việc..."
        class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @focus="showResults = true"
      />
      <!-- Search Icon/Loading Indicator -->
      <div class="absolute right-3 top-1/2 -translate-y-1/2">
        <svg
          v-if="isLoading"
          class="animate-spin h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <svg
          v-else
          class="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>

    <!-- Advanced Search Filters -->
    <div v-if="showAdvancedSearch" class="mt-2 p-4 bg-white border rounded-lg shadow-lg">
      <div class="grid grid-cols-2 gap-4">
        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <select
            v-model="filters.status"
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả</option>
            <option value="completed">Hoàn thành</option>
            <option value="incomplete">Chưa hoàn thành</option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Độ ưu tiên</label>
          <select
            v-model="filters.priority"
            class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            <option value="high">Cao</option>
            <option value="medium">Trung bình</option>
            <option value="low">Thấp</option>
          </select>
        </div>

        <!-- Date Range -->
        <div class="col-span-2 grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
            <input
              v-model="filters.startDate"
              type="date"
              class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
            <input
              v-model="filters.endDate"
              type="date"
              class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Filter Actions -->
      <div class="mt-4 flex justify-end space-x-2">
        <button
          @click="resetFilters"
          class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Đặt lại
        </button>
        <button
          @click="applyFilters"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Áp dụng
        </button>
      </div>
    </div>

    <!-- Search Results -->
    <div
      v-if="showResults && (searchResults.length > 0 || searchHistory.length > 0)"
      class="absolute left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
    >
      <!-- Recent Searches -->
      <div v-if="searchHistory.length > 0 && !searchQuery" class="p-2">
        <div class="flex items-center justify-between px-3 py-2">
          <span class="text-sm font-medium text-gray-500">Tìm kiếm gần đây</span>
          <button
            @click="clearHistory"
            class="text-xs text-blue-600 hover:text-blue-800"
          >
            Xóa lịch sử
          </button>
        </div>
        <div
          v-for="item in searchHistory"
          :key="item"
          class="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
          @click="applyHistoryItem(item)"
        >
          <svg
            class="h-4 w-4 text-gray-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{{ item }}</span>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="searchResults.length > 0" class="border-t">
        <div
          v-for="result in searchResults"
          :key="result.id"
          class="px-4 py-3 hover:bg-gray-50 cursor-pointer"
          @click="selectResult(result)"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium">{{ result.name }}</div>
              <div class="text-sm text-gray-500">
                {{ result.completed ? 'Hoàn thành' : 'Đang thực hiện' }}
              </div>
            </div>
            <div
              :class="[
                'px-2 py-1 text-xs rounded-full',
                result.priority === 'high'
                  ? 'bg-red-100 text-red-800'
                  : result.priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              ]"
            >
              {{ result.priority }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import SearchService from '@/services/SearchService'

const router = useRouter()
const searchQuery = ref('')
const searchResults = ref([])
const searchHistory = ref([])
const isLoading = ref(false)
const showResults = ref(false)
const showAdvancedSearch = ref(false)
const filters = ref({
  status: 'all',
  priority: '',
  startDate: '',
  endDate: ''
})

let debounceTimer: NodeJS.Timeout | null = null

// Load search history when component mounts
const loadSearchHistory = async () => {
  try {
    const response = await SearchService.getSearchHistory()
    searchHistory.value = response.data
  } catch (error) {
    console.error('Error loading search history:', error)
  }
}

// Watch for changes in search query
watch(searchQuery, (newQuery) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  
  if (!newQuery.trim()) {
    searchResults.value = []
    return
  }

  debounceTimer = setTimeout(async () => {
    isLoading.value = true
    try {
      const response = await SearchService.searchTasks(newQuery)
      searchResults.value = response.data
      // Save to search history if there are results
      if (response.data.length > 0) {
        await SearchService.saveSearchHistory(newQuery)
        loadSearchHistory()
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      isLoading.value = false
    }
  }, 300)
})

// Apply advanced search filters
const applyFilters = async () => {
  isLoading.value = true
  try {
    const response = await SearchService.advancedSearch({
      query: searchQuery.value,
      ...filters.value
    })
    searchResults.value = response.data
  } catch (error) {
    console.error('Advanced search error:', error)
  } finally {
    isLoading.value = false
  }
}

// Reset all filters
const resetFilters = () => {
  filters.value = {
    status: 'all',
    priority: '',
    startDate: '',
    endDate: ''
  }
}

// Clear search history
const clearHistory = async () => {
  try {
    await SearchService.clearSearchHistory()
    searchHistory.value = []
  } catch (error) {
    console.error('Error clearing search history:', error)
  }
}

// Apply history item to search
const applyHistoryItem = (query: string) => {
  searchQuery.value = query
}

// Select a search result
const selectResult = (result: any) => {
  showResults.value = false
  router.push(`/tasks/${result.id}`)
}

// Close results when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (!(event.target as Element).closest('.search-container')) {
    showResults.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  loadSearchHistory()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
