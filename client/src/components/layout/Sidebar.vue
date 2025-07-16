<script lang="ts" setup>
import {
  Bars3Icon,
  SunIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ListBulletIcon,
} from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'

defineOptions({ name: 'AppSidebar' })

const user = ref({
  name: 'Người dùng',
  email: 'example@gmail.com',
})
const menuItems = ref([
  {
    id: 'today',
    label: 'Hôm nay',
    icon: SunIcon,
    href: '/dashboard',
    count: 5,
    color: 'text-yellow-500',
  },
  {
    id: 'planned',
    label: 'Đã lập kế hoạch',
    icon: CalendarDaysIcon,
    href: '/planned',
    count: 8,
    color: 'text-blue-600',
  },
  {
    id: 'completed',
    label: 'Đã hoàn thành',
    icon: CheckCircleIcon,
    href: '/completed',
    count: 12,
    color: 'text-green-600',
  },
  {
    id: 'tasks',
    label: 'Tác vụ',
    icon: ListBulletIcon,
    href: '/tasks',
    count: 15,
    color: 'text-purple-600',
  },
])

const isOpen = ref(false)
const activeItem = ref('today')
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
    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 shadow-sm'
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
  <button
    @click="toggleSidebar"
    class="fixed top-20 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:shadow-xl transition-all duration-200"
  >
    <Bars3Icon class="w-7 h-7 text-gray-700" />
  </button>

  <!-- Overlay for mobile -->
  <div
    v-if="isOpen"
    @click="closeSidebar"
    class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
  ></div>
  <aside
    :class="sidebarClasses"
    class="fixed md:relative z-40 h-full bg-white shadow-2xl transition-all duration-300 ease-in-out w-80 flex flex-col"
  >
    <!-- Header -->
    <div class="p-6 border-b border-gray-100">
      <div class="flex items-center space-x-3 mb-6">
        <div
          class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
        >
          <i data-lucide="list" class="text-white w-5 h-5"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900">TaskFlow</h1>
          <p class="text-sm text-gray-500">Quản lý công việc</p>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="relative">
        <i
          data-lucide="search"
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
        ></i>
        <input
          type="text"
          placeholder="Tìm kiếm tác vụ..."
          v-model="searchQuery"
          class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Menu Items -->
    <nav class="flex-1 px-4 py-6 space-y-2">
      <router-link
        :to="item.href"
        :key="item.id"
        @click="handleItemClick(item.id)"
        v-for="item in menuItems"
        :class="getMenuItemClasses(item.id)"
        class="w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group"
      >
        <div class="flex items-center space-x-3">
          <component :is="item.icon" :class="['w-8 h-8', getIconClasses(item.id, item.color)]" />

          <span :class="getLabelClasses(item.id)" class="font-medium">
            {{ item.label }}
          </span>
        </div>
        <span
          :class="getCountClasses(item.id)"
          class="px-2 py-1 text-xs font-semibold rounded-full"
        >
          {{ item.count }}
        </span>
      </router-link>
    </nav>

    <!-- Add Task Button -->
    <div class="p-4 border-t border-gray-100">
      <button
        @click="addNewTask"
        class="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <i data-lucide="plus" class="w-5 h-5"></i>
        <span class="font-medium">Thêm tác vụ mới</span>
      </button>
    </div>

    <!-- User Profile -->
    <div class="p-4 border-t border-gray-100">
      <div class="flex items-center space-x-3 mb-3">
        <div
          class="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center"
        >
          <i data-lucide="user" class="text-white w-4 h-4"></i>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
          <p class="text-xs text-gray-500">{{ user.email }}</p>
        </div>
        <button @click="openSettings" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <i data-lucide="settings" class="text-gray-400 w-4 h-4"></i>
        </button>
      </div>
    </div>
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
