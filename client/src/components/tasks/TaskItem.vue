<template>
  <div class="bg-white w-full rounded-lg shadow-md p-4 flex justify-between">
    <div>
      <div class="flex justify-between items-start">
        <h3 class="font-bold text-lg text-gray-800"  :class="{ 'line-through text-gray-500': task.status === 'completed' }">{{ task.title }}</h3>
      </div>
      <div class="flex items-end gap-2">
        <p class="text-gray-600 text-sm " :class="{ 'line-through text-gray-400': task.status === 'completed' }">{{ task.description }}</p>
        <span class="flex items-center text-gray-500 ">
          <CalendarIcon class="h-4 w-4 mr-1" />
          <span class="text-sm">{{ task.due_date }}</span>
        </span>
        <span v-for="category in categoryStore.getCategoriesForTask(task.id)" :key="category"
          :class="`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getCategoryColorClass(category)}`">
          <span><TagIcon :class="`w-4 h-4 text-gray-500`"/></span>
          {{ category }}
        </span>
      </div>
    </div>
    <div class="mt-4 flex justify-between items-center gap-2">

      <div class="flex space-x-2">
        <button @click="showDetail(task.id)" class="text-gray-400 hover:text-blue-500 cursor-pointer">
          <InformationCircleIcon class="h-6 w-6" />
        </button>

        <button @click="toggleImportant(task.id)" class="cursor-pointer"
          :class="task.important ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'"
          v-tippy="{ content: task.important ? 'Bỏ đánh dấu quan trọng' : 'Đánh dấu là quan trọng' }">
          <StarIcon class="h-6 w-6" />

        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarIcon, InformationCircleIcon, StarIcon, TagIcon, TrashIcon } from '@heroicons/vue/24/outline';
import TaskService from '@/services/TaskService';
import { onMounted } from 'vue';
import { tippy } from 'vue-tippy';

import { useUIStore } from '@/stores/ui';
import { useTaskStore } from '@/stores/task';
import { useCategoryStore } from '@/stores/category';
defineOptions({
  name: 'TaskItem'
});
const uiStore = useUIStore();
const taskStore = useTaskStore();
const categoryStore = useCategoryStore();
const props = defineProps<{
  task: {
    id: number;
    title: string;
    description: string;
    due_date: Date | null;
    important: boolean;
    status: string;
  };
}>();

const getCategoryColorClass = (category: string) => {
  const colorMap: Record<string, string> = {
    Work: 'bg-blue-100 text-blue-700',
    Personal: 'bg-pink-100 text-pink-700',
    Urgent: 'bg-red-100 text-red-700',
    Important: 'bg-yellow-100 text-yellow-700',
    'Low Priority': 'bg-gray-100 text-gray-700',
    'High Priority': 'bg-purple-100 text-purple-700',
    Later: 'bg-green-100 text-green-700',
  };

  return colorMap[category] || 'bg-gray-100 text-gray-700'; // mặc định nếu không có
};

onMounted(() => {
  tippy('[v-tippy]', {
    placement: 'top',
    animation: 'shift-away',
    duration: 150,
  });
});
const showDetail = async (id: number) => {
  const response = taskStore.getTaskById(id);
  if (response) {
    uiStore.toggleRightSidebar();
    taskStore.setSelectedTask(response);
  } else {
    console.error('Task not found');
  }
};
const toggleImportant = async (id: number) => {
  try {
    taskStore.toggleImportant(id);
    await TaskService.toggleImportant(id);
  } catch (error) {
    console.error('Đánh dấu thất bại:', error);
  }
};
</script>
