<script lang="ts" setup>
import HeadSection from '@/components/sections/HeadSection.vue'
import { SunIcon } from '@heroicons/vue/24/outline'
import { useHead } from '@vueuse/head'
import { ref, onMounted } from 'vue'
import TaskService from '@/services/TaskService'

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

// Khởi tạo newTask là object
const newTask = ref({
  title: '',
  status: 'pending',
  user_id: 2, // Giả sử user_id là 1, có thể thay đổi theo logic của bạn
})

const tasks = ref([])
const loading = ref(false);
const error = ref('')
// Lấy danh sách task khi load trang
const fetchTasks = async () => {
  try {
    const response = await TaskService.getTasks()
    tasks.value = response.data.data ?? response.data // tuỳ API trả về
  } catch (error) {
    console.error('Error fetching tasks:', error)
  }
}

onMounted(() => {
  fetchTasks()
})

// Thêm task mới
const addTask = async () => {
  if (!newTask.value.title.trim()) return
  try {
    loading.value = true
    await TaskService.addTask({ title: newTask.value.title, status: 'pending' })
    newTask.value.title = ''
    loading.value = false
    fetchTasks()
  } catch (error) {
    console.error('Error adding task:', error)
  }
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
      <button @click="addTask" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
       {{ loading ? 'Đang thêm...' : 'Thêm' }}
      </button>
    </div>
  </div>

  <!-- Task list -->
  <div class="space-y-4">
    <div v-for="(task, index) in tasks" :key="task.id || index"
      class="bg-white rounded-xl shadow flex items-center justify-between px-4 py-3">
      <!-- Left: Avatar + Name -->
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-blue-200 text-blue-700 font-bold rounded-full flex items-center justify-center">
          {{ task?.title.charAt(0).toUpperCase() }}
        </div>
        <div class="text-gray-700 font-medium">
          {{ task.title }}
        </div>
      </div>

      <!-- Right: Status Switch -->
      <div class="flex items-center space-x-4">
        <div class="flex space-x-2 text-xs font-semibold">
          <span :class="task.status === 'completed' ? 'text-green-600' : 'text-gray-400'">Completed</span>
          <span>/</span>
          <span :class="task.status === 'pending' ? 'text-purple-600' : 'text-gray-400'">Unfinished</span>
        </div>
      </div>
    </div>
  </div>
</template>
