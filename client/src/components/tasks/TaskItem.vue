<template>
  <button @click="showDetail(task.id)" class="bg-white w-full rounded-lg shadow-md p-4 flex justify-between">
    <div>
      <div class="flex justify-between items-start">
        <h3 class="font-bold text-lg text-gray-800">{{ task.title }}</h3>
      </div>
      <div class="flex items-end gap-2">
        <p class="text-gray-600 text-sm ">{{ task.description }}</p>
        <span class="flex items-center text-gray-500 ">
        <CalendarIcon class="h-4 w-4 mr-1" />
        <span class="text-sm">{{ task.due_date }}</span>
      </span>
      </div>
    </div>
    <div class="mt-4 flex justify-between items-center gap-2">
      
      <div class="flex space-x-2">
        <button @click="showDetail(task.id)" class="text-gray-400 hover:text-blue-500 cursor-pointer">
          <InformationCircleIcon class="h-6 w-6" />
        </button>

        <button @click="toggleImportant(task.id)" class="cursor-pointer" :class="task.important ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'" v-tippy="{ content: task.important ? 'Bỏ đánh dấu quan trọng' : 'Đánh dấu là quan trọng' }">
          <StarIcon class="h-6 w-6" />
           
        </button>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { CalendarIcon, InformationCircleIcon, StarIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { useUIStore } from '@/stores/ui';
import { useTaskStore } from '@/stores/task';
import TaskService from '@/services/TaskService';
import { onMounted } from 'vue';
import { tippy } from 'vue-tippy';

defineOptions({
  name: 'TaskItem'
});
const taskStore = useTaskStore();
const props = defineProps<{
  task: {
    id: number;
    title: string;
    description: string;
    due_date: string;
    important: boolean;
  };
}>();
onMounted(() => {
  tippy('[v-tippy]', {
    placement: 'top',
    animation: 'shift-away',
    duration: 150,
  });
});
const uiStore = useUIStore();
const showDetail = async (id:number) => {
  const response =  taskStore.getTaskById(id);
  if (response) {
    uiStore.toggleRightSidebar();
    taskStore.setSelectedTask(response);
  } else {
    console.error('Task not found');
  }
};
const toggleImportant = async (id:number) => {
  try {
    await TaskService.toggleImportant(id);
    taskStore.toggleImportant(id);
  } catch (error) {
    console.error('Đánh dấu thất bại:', error);
  }
};
</script>
