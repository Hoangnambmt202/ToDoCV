<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- Total Tasks -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-blue-100 text-blue-500">
          <ClipboardDocumentListIcon class="h-6 w-6" />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500">Tổng số công việc</p>
          <p class="text-2xl font-bold text-gray-900">{{ summary.total }}</p>
        </div>
      </div>
    </div>
    <!-- Completed Tasks -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-green-100 text-green-500">
          <CheckCircleIcon class="h-6 w-6" />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500">Đã hoàn thành</p>
          <p class="text-2xl font-bold text-gray-900">{{ summary.completed }}</p>
        </div>
      </div>
    </div>
    <!-- Pending Tasks -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-yellow-100 text-yellow-500">
          <ClockIcon class="h-6 w-6" />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-500">Việc cần làm</p>
          <p class="text-2xl font-bold text-gray-900">{{ summary.todo }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClipboardDocumentListIcon, CheckCircleIcon, ClockIcon } from '@heroicons/vue/24/outline';

defineProps<{
  summary: {
    total: number;
    completed: number;
    todo: number;
  }
}>();
</script>
