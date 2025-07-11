<script lang="ts" setup>
import HeadSection from '@/components/sections/HeadSection.vue'
import { SunIcon } from '@heroicons/vue/24/outline'
import { useHead } from '@vueuse/head'
import { ref } from 'vue'
defineOptions({
  name: 'DashboardView',
})
useHead({
  title: 'Dashboard | ToDoCV',
  meta: [
    { name: 'description', content: 'Dashboard page for managing tasks' },
    {
      property: 'og:title',
      content: 'Todo Dashboard',
    },
    {
      property: 'og:description',
      content: 'Ứng dụng quản lý task đơn giản, hiệu quả',
    },
  ],
})

const newTask = ref('')
const tasks = ref([
  { name: 'công việc trong ngày', completed: true },
  { name: 'ex', completed: false },
  { name: 'ex', completed: true },
])

const addTask = () => {
  if (newTask.value.trim() !== '') {
    tasks.value.push({
      name: newTask.value,
      completed: false,
    })
    newTask.value = ''
  }
}
</script>

<template>
  <!-- Head section -->
  <HeadSection :icon="SunIcon" title="Công việc hôm nay" customClass="text-yellow-500 " />

  <!-- Add task input -->
  <div class="bg-white rounded-xl shadow p-4 mb-6">
    <div class="flex items-center space-x-3">
      <input v-model="newTask" placeholder="Thêm tác vụ"
        class="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-400" />
     
      <div class="max-w-sm">
        <select data-select='{
    "placeholder": "Select option...",
    "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
    "toggleClasses": "advance-select-toggle select-disabled:pointer-events-none select-disabled:opacity-40",
    "dropdownClasses": "advance-select-menu",
    "optionClasses": "advance-select-option selected:select-active",
    "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"icon-[tabler--check] shrink-0 size-4 text-primary hidden selected:block \"></span></div>",
    "extraMarkup": "<span class=\"icon-[tabler--caret-up-down] shrink-0 size-4 text-base-content absolute top-1/2 end-3 -translate-y-1/2 \"></span>"
    }' class="">
          <!-- <option value="">Choose</option> -->
          <option value="name">Full Name</option>
          <option value="email">Email Address</option>
          <option value="description">Project Description</option>
          <option value="user_id">User Identification Number</option>
        </select>
      </div>
      <button @click="addTask" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
        Thêm
      </button>
    </div>
  </div>

  <!-- Task list -->
  <div class="space-y-4">
    <div v-for="(task, index) in tasks" :key="index"
      class="bg-white rounded-xl shadow flex items-center justify-between px-4 py-3">
      <!-- Left: Avatar + Name -->
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-blue-200 text-blue-700 font-bold rounded-full flex items-center justify-center">
          A
        </div>
        <div class="text-gray-700 font-medium">
          {{ task.name }}
        </div>
      </div>

      <!-- Right: Status Switch -->
      <div class="flex items-center space-x-4">
        <div class="flex space-x-2 text-xs font-semibold">
          <span :class="task.completed ? 'text-green-600' : 'text-gray-400'">Completed</span>
          <span>/</span>
          <span :class="!task.completed ? 'text-purple-600' : 'text-gray-400'">Unfinished</span>
        </div>

        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" value="" class="sr-only peer" />
          <div
            class="group peer ring-0 bg-gradient-to-bl from-neutral-800 via-neutral-700 to-neutral-600 rounded-full outline-none duration-1000 after:duration-300 w-24 h-12 shadow-md peer-focus:outline-none after:content-[''] after:rounded-full after:absolute after:[background:#0D2B39] peer-checked:after:rotate-180 after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)] after:outline-none after:h-10 after:w-10 after:top-1 after:left-1 peer-checked:after:translate-x-12 peer-hover:after:scale-95 peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-900">
          </div>
        </label>

        <input type="checkbox" class="accent-blue-500 w-4 h-4" />
      </div>
    </div>
  </div>

  <!-- Burger menu button for mobile -->
  <!-- <button
    @click="toggleSidebar"
    class="fixed top-4 left-4 z-40 md:hidden bg-white rounded-full shadow p-2 transition-transform duration-300"
    v-if="!sidebarOpen"
  >
    <Bars3Icon class="w-7 h-7 text-gray-700" />
  </button> -->
</template>
