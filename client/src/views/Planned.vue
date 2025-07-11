<script lang="ts" setup>
import HeadSection from '@/components/sections/HeadSection.vue'
import { CalendarDaysIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

defineOptions({
  name: 'PlannedView',
})
const tasks = ref([
  { name: 'Lên kế hoạch cho tuần tới', deadline: '20/6/2025', completed: false },
  { name: 'Chuẩn bị tài liệu cho cuộc họp', deadline: '20/6/2025', completed: false },
  { name: 'Gửi email nhắc nhở', deadline: '20/6/2025', completed: true },
])
</script>

<template>
  <!-- Head section -->
   <HeadSection
    :icon="CalendarDaysIcon"
    title="Công việc đã lập kế hoạch"
    customClass="text-blue-500"
  />
  <!-- Add task input -->
  <div class="bg-white rounded-xl shadow p-4 mb-6">
    <div class="flex items-center space-x-3">
      <input
        placeholder="Thêm tác vụ"
        class="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-400"
      />
      <button class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Thêm</button>
    </div>
  </div>
  <div class="bg-white rounded-xl shadow p-4">
    <h2 class="text-xl font-semibold mb-4">Danh sách tác vụ đã lập kế hoạch</h2>
    <ul class="space-y-3">
      <li
        v-for="(task, index) in tasks"
        :key="index"
        class="flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <span :class="{ 'line-through': task.completed }">{{ task.name }}</span>
        <input
          type="checkbox"
          v-model="task.completed"
          class="form-checkbox h-5 w-5 text-blue-600"
        />
      </li>
    </ul>
  </div>
</template>
<style lang=""></style>
