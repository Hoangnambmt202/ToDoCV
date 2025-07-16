<script lang="ts" setup>
import HeadSection from '@/components/sections/HeadSection.vue'
import { InformationCircleIcon, SunIcon } from '@heroicons/vue/24/outline'
import { useHead } from '@vueuse/head'
import { ref, onMounted, inject } from 'vue'
import TaskService from '@/services/TaskService'
import { useUIStore } from '@/stores/ui'
import { useTaskStore } from '@/stores/task'

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

const ui = useUIStore();
const taskStore = useTaskStore()


// Khởi tạo newTask là object
const newTask = ref({
  title: '',
  status: 'pending',
  user_id: 2, // Giả sử user_id là 1, có thể thay đổi theo logic của bạn
})



onMounted(() => {
  taskStore.fetchTasks();
})

const toggleShowInfo = (id:string) =>{
 ui.toggleRightSidebar()
 taskStore.fetchTaskById(id);
}  
</script>

<template>
  <!-- Head section -->
  <HeadSection :icon="SunIcon" title="Công việc hôm nay" customClass="text-yellow-500 " />

  <!-- Add task input -->
  <div class="bg-white rounded-xl shadow p-4 mb-6">
    <div class="flex items-center space-x-3">
      <input v-model="newTask.title" placeholder="Thêm tác vụ"
        class="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-400" />
      <button @click="taskStore.addTask(newTask)" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
       {{ taskStore.loading ? 'Đang thêm...' : 'Thêm' }}
      </button>
    </div>
  </div>

  <!-- Task list -->
  <div class="space-y-4 max-h-screen overflow-scroll">
    <div v-for="task in taskStore.tasks" :key="task.id"
      class="bg-white rounded-xl shadow flex items-center justify-between px-4 py-3">
      <!-- Left: Avatar + Name -->
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-blue-200 text-blue-700 font-bold rounded-full flex items-center justify-center">
          {{ task?.title.charAt(0).toUpperCase() }}
        </div>
        <div class="text-gray-700 font-medium">
          {{ task?.title }}
        </div>
      </div>

      <!-- Right: Status Switch -->
      <div class="flex items-center space-x-4">
        <div class="flex space-x-2 text-xs font-semibold">
          <button @click=" toggleShowInfo(task.id)">
            <InformationCircleIcon class="w-6 h-6 text-black"  />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
