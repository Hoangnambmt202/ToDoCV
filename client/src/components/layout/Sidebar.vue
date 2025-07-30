<script lang="ts" setup>
import {
  ArrowTrendingUpIcon,
  ListBulletIcon,
  Bars3Icon,
  StarIcon,
} from '@heroicons/vue/24/outline'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import debounce from 'lodash.debounce'

import { useSearchStore } from '@/stores/search'
import SearchService from '@/services/SearchService'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/stores/task'

defineOptions({ name: 'Sidebar' })

const route = useRoute();
const taskStore = useTaskStore();
const searchStore = useSearchStore();
const { searchQuery, searchResults, isSearching, hasResults } = storeToRefs(searchStore)

const menuItems = computed(()=>[
  {
    id: 'dashboard',
    label: 'Bảng điều khiển',
    icon: ArrowTrendingUpIcon,
    href: '/dashboard',
    color: 'text-yellow-600',
  },
  {
    id: 'tasks',
    label: 'Công việc của tôi',
    icon: ListBulletIcon,
    href: '/tasks',
    count: taskStore.tasks.filter(t => t.status !== 'completed').length,
    color: 'text-blue-600',
  },
])

// Active item dựa theo URL
const activeItem = computed(() => {
  const path = route.path
  const match = menuItems.value.find(item => path.startsWith(item.href))
  return match?.id ?? ''
})


// const handleSearch = async (query: string) => {
//   if (!query.trim()) {
//     searchStore.clearSearch()
//     return
//   }

//   try {
//     searchStore.setSearching(true)
//     const response = await SearchService.searchTasks(query)
//     searchStore.setSearchResults(response.data)
//   } catch (error) {
//     console.error('Search error:', error)
//   } finally {
//     searchStore.setSearching(false)
//   }
// }
const handleSearch = async (query: string) => {
  if (!query.trim()) {
    searchStore.clearSearch()
    return
  }

  try {
    searchStore.setSearching(true)

    // 1. Gọi API tìm kiếm bình thường
    const response = await SearchService.searchTasks(query)
    const results = response.data || []

    if (results.length > 0) {
      searchStore.setSearchResults(results)
    } else {
      // 2. Không có kết quả -> gọi advanced search
      const advancedResponse = await SearchService.advancedSearch({query})
      const advancedResults = advancedResponse.data.tasks || []

      searchStore.setSearchResults(advancedResults)
    }
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    searchStore.setSearching(false)
  }
}
// Bọc debounce một lần
const debouncedSearch = debounce((query: string) => {
  handleSearch(query)
}, 1000)

watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery)
})
const sortedTasks = computed(() => {
  return [...taskStore.tasks].sort((a, b) => {
    // Quan trọng lên đầu
    if (a.important === b.important) return 0;
    return a.important ? -1 : 1;
  });
});

// Class utils
const getMenuItemClasses = (itemId: string) => {
  const isActive = activeItem.value === itemId
  return isActive
    ? 'bg-white border-l-4 border-blue-500 shadow-sm'
    : 'hover:bg-gray-50 hover:shadow-sm'
}

const getIconClasses = (itemId: string, color: string) => {
  const isActive = activeItem.value === itemId
  return isActive ? color : 'text-gray-500 group-hover:text-gray-700'
}

const getLabelClasses = (itemId: string) => {
  const isActive = activeItem.value === itemId
  return isActive ? 'text-gray-900' : 'text-gray-600'
}

const getCountClasses = (itemId: string) => {
  const isActive = activeItem.value === itemId
  return isActive
    ? 'bg-blue-100 text-blue-800'
    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
}


const openSettings = () => {
  alert('Mở cài đặt - Tính năng sẽ được phát triển')
}
</script>


<template>
  <aside class="w-64 bg-white p-4 border-r border-gray-200">
    <nav class="flex flex-col space-y-2">
      <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bộ lọc</h3>
      <div class="relative mb-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm công việc..."
            class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <!-- Search Icon -->
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <!-- Loading Spinner -->
          <div v-if="isSearching" class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>

        <!-- Search Results Dropdown -->
        <div v-if="searchQuery" 
             class="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-[400px] overflow-y-auto z-50">
          <!-- No Results -->
          <div v-if="!isSearching && !hasResults && searchQuery" class="p-4 text-center text-gray-500">
            <div class="flex flex-col items-center">
              <svg class="h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Không tìm thấy kết quả cho "{{ searchQuery }}"</p>
            </div>
          </div>

          <!-- Results List -->
          <ul v-else-if="hasResults && !isSearching" class="divide-y divide-gray-100">
            <li v-for="result in sortedTasks" 
                :key="result.id"
                class="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                @click="selectTask(result)">
              <div class="flex items-center space-x-3">
                <!-- Status Indicator -->
                <div :class="[
                  'w-3 h-3 rounded-full flex-shrink-0',
                  result.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
                ]"></div>
                
                <!-- Task Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2">
                    <h4 class="font-medium text-gray-900 truncate">{{ result.title }}</h4>
                    <StarIcon v-if="result.important" 
                            class="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  </div>
                  <p class="text-sm text-gray-500 truncate">
                    {{ result.status === 'completed' ? 'Hoàn thành' : 'Đang thực hiện' }}
                  </p>
                </div>

                <!-- Right Arrow -->
                <svg class="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <ul class="space-y-2">
        <RouterLink
          :to="item.href"
          v-for="item in menuItems"
          :key="item.id"
          :class="getMenuItemClasses(item.id)"
          class="group flex items-center bg-gray-50 p-2 rounded-md cursor-pointer transition-colors duration-200"
        > 
       
        <component
          :is="item.icon"
          :class="getIconClasses(item.id, item.color)"
          class="h-6 w-6 mr-3"
        />
        <span :class="getLabelClasses(item.id)" class="flex-1">
          {{ item.label }}
        </span>
        <span
          v-if="item.count"
          :class="getCountClasses(item.id)"
          class="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full"
        >
          {{ item.count }}
        </span>

        
        </RouterLink>

        <li>
          <button
            @click="openSettings"
            class="w-full flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <Bars3Icon class="h-5 w-5 mr-2" />
            Cài đặt
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
/* Hide sidebar on mobile by default, show on md+ */
@media (min-width: 768px) {
  aside {
    transform: translateX(0) !important;
    position: static !important;
    width: 16rem !important;
  }
  button[aria-label='Open sidebar'] {
    display: none;
  }
}
</style>