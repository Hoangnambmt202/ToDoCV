<script lang="ts" setup>
import {
 
  ArrowTrendingUpIcon,
  ListBulletIcon,
} from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'

defineOptions({ name: 'Sidebar' })

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

const isOpen = ref(false)
const activeItem = ref('dashboard')
const searchQuery = ref('')

const sidebarClasses = computed(() => {
  return isOpen.value ? 'translate-x-0 !w-80' : '-translate-x-full md:translate-x-0 hidden' 
})

const handleItemClick = (itemId: string) => {
  // Close sidebar on mobile after selecting
  if (window.innerWidth < 768) {
    isOpen.value = false
  }

  activeItem.value = itemId
}

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

const addNewTask = () => {
  alert('Thêm tác vụ mới - Tính năng sẽ được phát triển')
}

const openSettings = () => {
  alert('Mở cài đặt - Tính năng sẽ được phát triển')
}
const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const closeSidebar = () => {
  isOpen.value = false
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
      </div>
      <ul class="space-y-2">
        <RouterLink
          :to="item.href"
          v-for="item in menuItems"
          :key="item.id"
          :class="getMenuItemClasses(item.id)"
          @click="handleItemClick(item.id)"
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