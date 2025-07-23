<template>
  <div class="bg-white rounded-lg shadow-md p-4 flex justify-between">
    <div>
      <div class="flex justify-between items-start">
        <h3 class="font-bold text-lg text-gray-800">{{ task.title }}</h3>
      </div>
      <p class="text-gray-600 text-sm mt-2">{{ task.description }}</p>
    </div>
    <div class="mt-4 flex justify-between items-center">
      <div class="flex items-center text-sm text-gray-500">
        <CalendarIcon class="h-4 w-4 mr-1" />
        <span>{{ task.due_date }}</span>
      </div>
      <div class="flex space-x-2">
        <button @click="showDetail(task.id)" class="text-gray-400 hover:text-blue-500">
          <InformationCircleIcon class="h-6 w-6" />
        </button>
        <button class="text-gray-400 hover:text-red-500">
          <StarIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarIcon, InformationCircleIcon, StarIcon, TrashIcon } from '@heroicons/vue/24/outline';
import type { Task } from '@/types/task';
import { useUIStore } from '@/stores/ui';

defineOptions({
  name: 'TaskItem'
});
const props = defineProps<{
  task: Task;
}>();
const uiStore = useUIStore();
const showDetail = (id:string) => {
  
 uiStore.toggleRightSidebar();

};
</script>
