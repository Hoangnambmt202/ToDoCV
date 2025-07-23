<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <h3 class="font-semibold text-gray-800 mb-4">Công việc gần đây</h3>
    <ul class="space-y-3">
      <li v-for="task in tasks" :key="task.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div>
          <p class="font-medium text-gray-800">{{ task.title }}</p>
          <p class="text-sm text-gray-500">Hạn chót: {{ task?.due_date || 'Chưa đặt thời gian đến hạn' }}</p>
        </div>
        <span :class="statusBadgeClass(task.status)" class="px-2 py-1 text-xs font-semibold rounded-full">
          {{ task.status }}
        </span>
      </li>
       <li v-if="tasks.length === 0">
        <p class="text-center text-gray-500 py-4">Không có công việc nào gần đây.</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/types/task';

defineProps<{
  tasks: Task[];
}>();

const statusBadgeClass = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'To Do':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
</script>
