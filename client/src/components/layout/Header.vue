<script lang="ts" setup>
import { BellIcon, Cog6ToothIcon, UserIcon } from '@heroicons/vue/24/outline'

defineOptions({
  name: 'HeaderComponent',
})
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'
const isOpen = ref(false)
const authStore = useAuthStore();

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

// Optional: Đóng dropdown khi click bên ngoài
function handleClickOutside(event) {
  const avatar = document.getElementById('avatarButton')
  if (!avatar?.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="flex items-center justify-between px-6 py-3 bg-blue-500 shadow-md">
    <!-- Logo -->
    <div class="flex items-center rounded-lg overflow-hidden">
      <img src="@/assets/imgs/Logo.png" alt="Logo" class="h-10 w-auto" />
      <!-- <span class="ml-2 text-xl font-bold text-gray-800">ToDoCV</span> -->
    </div>

    <!-- Search -->
    <div class="flex-1 mx-15">
      <div class="relative">
        <input type="text" placeholder="Tìm kiếm..."
          class="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none"
          stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
    </div>

    <!-- Icons -->
    <div class="flex items-center space-x-4">
      <!-- Settings -->
      <button class="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer">
        <Cog6ToothIcon class="w-6 h-6 text-black" />
      </button>
      <!-- Notification -->
      <button class="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer">
        <BellIcon class="w-6 h-6 text-black" />
      </button>
      <!-- Account -->
      <!-- <button class="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer">
        <UserIcon class="w-6 h-6 text-black" />
         
      </button> -->
      <div v-if="authStore.user">
        <div class="relative flex items-center gap-2 text-left">

          <img 
            id="avatarButton" 
            type="button" 
            class="w-10 h-10 rounded-full cursor-pointer "
            :src="authStore.user?.avatar || '@/assets/imgs/Logo.png'" 
            alt="User dropdown" 
            @click="toggleDropdown" />
          {{ authStore.user.name }}
          <div v-if="isOpen"
            class="absolute z-10 top-full right-0 mt-2 p-4 bg-white divide-y divide-gray-100 rounded-lg shadow-sm  dark:bg-gray-700 dark:divide-gray-600 space-y-2">
            <div class="text-sm text-gray-900 dark:text-white">
              <div>{{ authStore.user.name }}</div>
              <div class="font-medium truncate">{{ authStore.user.email }}</div>
            </div>
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li><a href="#"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
              </li>
              <li><a href="#"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
              </li>
              <li><a href="#"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
              </li>
            </ul>
            <div class="py-1">
              <a href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign
                out</a>
            </div>
          </div>

      </div>
      </div>
      <div v-else>
        <img id="avatarButton" type="button" class="w-10 h-10 rounded-full cursor-pointer "
          src="@/assets/imgs/Logo.png" alt="User dropdown" @click="toggleDropdown" />
      </div>
      


    </div>
  </header>
</template>
