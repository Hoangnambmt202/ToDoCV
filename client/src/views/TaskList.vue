<template>
  <HeadSection :icon="ListBulletIcon" title="Công việc của tôi" customClassIcon="text-blue-600" />

  <div class="bg-white rounded-lg shadow">

    <!-- Bộ lọc -->
    <div class="p-4 ">
      <div class="flex justify-end items-center">
        <div class="flex items-center gap-4">
          <!-- Nút bật/tắt bộ lọc -->
          <button @click="showFilter = !showFilter"
            class="text-sm text-blue-500 flex items-center gap-1 hover:underline">
            <FunnelIcon class="w-5 h-5" />
           
          </button>

          <!-- Nút lọc nâng cao -->
          <button @click="showAdvanced = !showAdvanced" v-if="showFilter"
            class="text-sm text-blue-500 flex items-center gap-1 hover:underline">
            <AdjustmentsVerticalIcon class="w-5 h-5" />
            <span>{{ showAdvanced ? 'Ẩn lọc nâng cao' : 'Lọc nâng cao' }}</span>
          </button>
        </div>

      </div>

      <transition name="fade">
        <div v-show="showFilter">
          <TaskFilter :show-advanced="showAdvanced" @filter="applyFilter" />
        </div>
      </transition>
    </div>


    <!-- Task List -->
    <div class="p-4 min-h-[300px]">
      <!-- Task chưa hoàn thành -->
      <div v-if="uncompletedTasks.length > 0" class="space-y-2">
        <div
          class=" cursor-default select-none bg-white w-full rounded-lg shadow-md p-4 border border-gray-400 hover:bg-gray-50">
          <h2 class="font-semibold text-gray-700 mb-2 flex gap-2 items-center">📌 Đang thực hiện
            <span class="rounded-full flex justify-center items-center w-6 h-6 bg-gray-300">{{ uncompletedTasks.length
            }}</span>
          </h2>
        </div>
        <TaskItem v-for="task in uncompletedTasks" :key="task.id" :task="task" @edit="openTaskModal"
          @delete="handleDelTask" />
      </div>

      <!-- Task đã hoàn thành -->
      <div v-if="completedTasks.length > 0" class="space-y-2 mt-6 border-t pt-4 border-gray-200">
        <div
          class="flex justify-between items-center cursor-pointer select-none bg-white w-full rounded-lg shadow-md p-4 border border-gray-400 hover:bg-gray-50"
          @click="showCompleted = !showCompleted">
          <h2 class="font-semibold text-gray-700 flex gap-2 items-center">
            ✅ Đã hoàn thành
            <span class="rounded-full flex justify-center items-center w-6 h-6 bg-gray-300">{{ completedTasks.length
            }}</span>
          </h2>
          <span class="text-sm text-blue-500 underline hover:text-blue-700">
            {{ showCompleted ? 'Ẩn' : 'Hiện' }}
          </span>
        </div>

        <transition name="fade">
          <div v-show="showCompleted" class="mt-2 space-y-2">
            <TaskItem v-for="task in completedTasks" :key="task.id" :task="task" @edit="openTaskModal"
              @delete="handleDelTask" />
          </div>
        </transition>
      </div>



      <!-- Empty State -->
      <div v-else-if="!completedTasks" class="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
        <p class="text-gray-500 text-lg">Bạn chưa có công việc nào.</p>
        <button @click="openTaskModal(null)"
          class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition">
          <span>Thêm công việc</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Add button -->
    <AddTaskButton @click="openTaskModal(null)" />

    <!-- Modal form -->
    <TaskForm :visible="isModalVisible" :task="selectedTask" @close="closeTaskModal" @success="handleLoadTasks" />

    <!-- Pagination -->
    <Pagination v-if="filteredTasks.length > itemsPerPage" :current-page="currentPage"
      :total-items="filteredTasks.length" :items-per-page="itemsPerPage" @page-change="handlePageChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useHead } from '@vueuse/head';
import { AdjustmentsVerticalIcon, FunnelIcon, ListBulletIcon } from '@heroicons/vue/24/outline';

import type { Task } from '@/types/task';
import { useTaskStore } from '@/stores/task';
import TaskForm from '@/components/tasks/TaskForm.vue';
import AddTaskButton from '@/components/tasks/AddTaskButton.vue';
import TaskService from '@/services/TaskService';
import HeadSection from '@/components/sections/HeadSection.vue';
import TaskFilter from '@/components/tasks/TaskFilter.vue';
import Pagination from '@/components/layout/Pagination.vue';
import TaskItem from '@/components/tasks/TaskItem.vue';
import { useCategoryStore } from '@/stores/category';
import CategoryService from '@/services/CategoryService';


useHead({
  title: 'Công việc của tôi | ToDoCV',
  meta: [
    {
      name: 'description',
      content: 'Xem và quản lý các công việc cá nhân của bạn trong ToDoCV.',
    },
  ],
});

defineEmits(['edit', 'delete']);
const filters = ref<{ status: string; important: boolean; keyword: string; due_date: string; categories: string[] }>({
  status: ''
  , important: false, keyword: '', due_date: '', categories: []
});
const currentPage = ref(1);
const itemsPerPage = ref(6);
const isModalVisible = ref(false);
const selectedTask = ref<Task | null>(null);
const taskStore = useTaskStore();
const categoryStore = useCategoryStore();
const allTasks = computed(() => taskStore.tasks);
const showCompleted = ref(false);
const showFilter = ref(false);
const showAdvanced = ref(false); // Toggle lọc nâng cao


onMounted(() => {
  loadTasks();
});

const loadTasks = async () => {
  try {
    taskStore.setLoading(true);
    const tasks = await TaskService.getTasks();
    const categories = await CategoryService.getCategories();
    categoryStore.setCategories(categories.data);
    taskStore.setTasks(tasks.data);
    // Extract all unique categories from all tasks
  } catch (err) {
    taskStore.setError('Lỗi tải danh sách công việc');
  } finally {
    taskStore.setLoading(false);
  }
};

const sortedTasks = computed(() => {
  return [...taskStore.tasks].sort((a, b) => {
    // Quan trọng lên đầu
    if (a.important === b.important) return 0;
    return a.important ? -1 : 1;
  });
});
const filteredTasks = computed(() => {
  return allTasks.value.filter(task => {
    const { status, important, keyword, due_date, categories } = filters.value;
    if (status && task.status !== status) return false;
    if (important && !task.important) return false;
    if (keyword && !task.title.toLowerCase().includes(keyword.toLowerCase()) && !task.description.toLowerCase().includes(keyword.toLowerCase())) return false;
    if (due_date && task.due_date && new Date(task.due_date).toISOString().slice(0, 10) !== due_date) return false;
    if (categories.length && !categories.some(c => categoryStore.getCategoriesForTask(task.id).includes(c))) return false;
    return true;
  })
});

const uncompletedTasks = computed(() =>
  filteredTasks.value.filter(task => task.status !== 'completed')
);

const completedTasks = computed(() =>
  filteredTasks.value.filter(task => task.status === 'completed')
);


const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredTasks.value.slice(start, end);
});

const openTaskModal = (task: Task | null) => {
  selectedTask.value = task ? { ...task } : null;
  isModalVisible.value = true;
};

const closeTaskModal = () => {
  isModalVisible.value = false;
  selectedTask.value = null;
};

const handleLoadTasks = async () => {
  try {
    taskStore.setLoading(true);
    const response = await TaskService.getTasks();
    taskStore.setTasks(response.data);
  } catch (error) {
    taskStore.setError('Lỗi tải lại danh sách công việc');
  } finally {
    taskStore.setLoading(false);
    closeTaskModal();
  }
};

const handleDelTask = async (taskId: number) => {
  try {
    await TaskService.deleteTask(taskId);
    taskStore.removeTaskFromStore(taskId);
  } catch (error) {
    taskStore.setError('Lỗi xóa công việc');
  }
};

const applyFilter = (newFilters: {
  status: string,
  important: boolean, keyword: string, due_date: string, categories: string[]
}) => {
  currentPage.value = 1;
  filters.value = newFilters;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};
</script>
