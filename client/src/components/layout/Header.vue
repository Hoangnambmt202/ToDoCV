<script lang="ts" setup>
import { BellIcon, Cog6ToothIcon, UserIcon } from '@heroicons/vue/24/outline'

defineOptions({
  name: 'HeaderComponent',
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
        <input
          type="text"
          placeholder="Tìm kiếm..."
          class="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <svg
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
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
      <button class="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer">
        <UserIcon class="w-6 h-6 text-black" />
      </button>
    </div>
  </header>
</template>
