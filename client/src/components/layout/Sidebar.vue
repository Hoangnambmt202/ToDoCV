<script lang="ts" setup>
import {
  ArrowTrendingUpIcon,
  ListBulletIcon,
  Bars3Icon,
} from '@heroicons/vue/24/outline'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSearchStore } from '@/stores/search'
import SearchService from '@/services/SearchService'
import { storeToRefs } from 'pinia'

defineOptions({ name: 'Sidebar' })

const route = useRoute()

const searchStore = useSearchStore()
const { searchQuery, searchResults, isSearching, hasResults } = storeToRefs(searchStore)

const menuItems = ref([
  {
    id: 'dashboard',
    label: 'Bảng điều khiển',
    icon: ArrowTrendingUpIcon,
    href: '/dashboard',
    count: 0,
    color: 'text-yellow-600',
  },
  {
    id: 'tasks',
    label: 'Công việc của tôi',
    icon: ListBulletIcon,
    href: '/tasks',
    count: 15,
    color: 'text-blue-600',
  },
])

// Active item dựa theo URL
const activeItem = computed(() => {
  const path = route.path
  const match = menuItems.value.find(item => path.startsWith(item.href))
  return match?.id ?? ''
})

const filteredMenuItems = ref([...menuItems.value])

// Xử lý tìm kiếm
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const handleSearch = async (query: string) => {
  if (!query.trim()) {
    searchStore.clearSearch()
    return
  }

  try {
    searchStore.setSearching(true)
    const response = await SearchService.searchTasks(query)
    searchStore.setSearchResults(response.data.data)
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    searchStore.setSearching(false)
  }
}

watch(searchQuery, (newQuery) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    handleSearch(newQuery)
  }, 300)
})

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

// Dummy buttons
const addNewTask = () => {
  alert('Thêm tác vụ mới - Tính năng sẽ được phát triển')
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
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <!-- Search Results Dropdown -->
        <div v-if="searchQuery" class="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-[400px] overflow-y-auto z-50">
          <!-- Loading State -->
          <div v-if="isSearching" class="p-4 text-center text-gray-500">
            <span class="inline-block animate-spin mr-2">⌛</span>
            Đang tìm kiếm...
          </div>

          <!-- No Results -->
          <div v-else-if="!hasResults && searchQuery" class="p-4 text-center text-gray-500">
            Không tìm thấy kết quả cho "{{ searchQuery }}"
          </div>

          <!-- Results List -->
          <ul v-else-if="hasResults">
            <li v-for="result in searchResults" 
                :key="result.id"
                class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0">
              <div class="flex items-center space-x-3">
                <!-- Status Indicator -->
                <div :class="[
                  'w-2 h-2 rounded-full',
                  result.completed ? 'bg-green-400' : 'bg-yellow-400'
                ]"></div>
                
                <!-- Task Info -->
                <div class="flex-1">
                  <div class="font-medium text-gray-900">{{ result.name }}</div>
                  <div class="text-sm text-gray-500">
                    {{ result.completed ? 'Hoàn thành' : 'Đang thực hiện' }}
                  </div>
                </div>

                <!-- Priority Badge -->
                <div v-if="result.priority" :class="[
                  'px-2 py-1 text-xs rounded-full',
                  result.priority === 'high' ? 'bg-red-100 text-red-800' :
                  result.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                ]">
                  {{ result.priority }}
                </div>
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
          v-if="item.count > 0"
          :class="getCountClasses(item.id)"
          class="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full"
        >
          {{ item.count }}
        </span>

        
        </RouterLink>
        <li class="mt-4">
          <button
            @click="addNewTask"
            class="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Bars3Icon class="h-5 w-5 mr-2" />
            Thêm tác vụ mới
          </button>
        </li>
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