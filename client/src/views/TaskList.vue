<template>
  <HeadSection
    :icon="ListBulletIcon"
    title="Công việc của tôi"
    customClassIcon="text-blue-600"
  />

  <div class="bg-white rounded-lg shadow">
    <!-- Task Filter -->
    <TaskFilter @filter="applyFilter" />

    <!-- Task List -->
    <div class="p-4 min-h-[300px]">
      <div
        v-if="paginatedTasks.length > 0"
        class="space-y-2"
      >
        <TaskItem
          v-for="task in paginatedTasks"
          :key="task.id"
          :task="task"
          @edit="openTaskModal"
          @delete="handleDelTask"
        />
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="flex flex-col items-center justify-center h-full text-center gap-4 py-12"
      >
        <p class="text-gray-500 text-lg">Bạn chưa có công việc nào.</p>
        <button
          @click="openTaskModal(null)"
          class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
        >
          <span>Thêm công việc</span>
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Add button -->
    <AddTaskButton @click="openTaskModal(null)" />

    <!-- Modal form -->
    <TaskForm
      :visible="isModalVisible"
      :task="selectedTask"
      @close="closeTaskModal"
      @success="handleLoadTasks"
    />

    <!-- Pagination -->
    <Pagination
      v-if="filteredTasks.length > itemsPerPage"
      :current-page="currentPage"
      :total-items="filteredTasks.length"
      :items-per-page="itemsPerPage"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import TaskFilter from '@/components/tasks/TaskFilter.vue';
import Pagination from '@/components/layout/Pagination.vue';
import type { Task } from '@/types/task';
import HeadSection from '@/components/sections/HeadSection.vue';
import { ListBulletIcon } from '@heroicons/vue/24/outline';
import { useHead } from '@vueuse/head';
import TaskForm from '@/components/tasks/TaskForm.vue';
import AddTaskButton from '@/components/tasks/AddTaskButton.vue';
import TaskService from '@/services/TaskService';
import { useTaskStore } from '@/stores/task';
import TaskItem from '@/components/tasks/TaskItem.vue';

defineEmits(['edit', 'delete']);

useHead({
  title: 'Công việc của tôi | ToDoCV',
  meta: [
    {
      name: 'description',
      content: 'Xem và quản lý các công việc cá nhân của bạn trong ToDoCV.',
    },
  ],
});

const filters = ref({ status: '' });
const currentPage = ref(1);
const itemsPerPage = ref(6);
const isModalVisible = ref(false);
const selectedTask = ref<Task | null>(null);
const taskStore = useTaskStore();
onMounted(() => {
  loadTasks();
});
const allTasks = computed(() => taskStore.tasks);

const loadTasks = async () => {
  try {
    taskStore.setLoading(true);
    const tasks = await TaskService.getTasks();
    taskStore.setTasks(tasks.data);
  } catch (err) {
    taskStore.setError('Lỗi tải danh sách công việc');
  } finally {
    taskStore.setLoading(false);
  }
};


const filteredTasks = computed(() => {
  return allTasks.value.filter(task => {
    if (filters.value.status && task.status !== filters.value.status) {
      return false;
    }
    return true;
  });
});

const hasTasks = computed(() => allTasks.value.length > 0);

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

const handleDelTask = async (taskId: string) => {
  try {
    await TaskService.deleteTask(taskId);
    taskStore.removeTaskFromStore(taskId);
  } catch (error) {
    taskStore.setError('Lỗi xóa công việc');
  }
};

const applyFilter = (newFilters: { status: string }) => {
  currentPage.value = 1;
  filters.value = newFilters;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};
</script>
