<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useHead } from '@vueuse/head';
import { SunIcon, PlusIcon, ArrowTrendingUpIcon } from '@heroicons/vue/24/outline';
import HeadSection from '@/components/sections/HeadSection.vue';
import TaskSummary from '@/components/dashboard/TaskSummary.vue';
import TaskChart from '@/components/dashboard/TaskChart.vue';
import RecentTasks from '@/components/dashboard/RecentTasks.vue';
import TaskForm from '@/components/tasks/TaskForm.vue';
import type { Task } from '@/types/task';

defineOptions({
  name: 'DashboardView',
});

useHead({
  title: 'Bảng điều khiển | TodoCV',
  meta: [
    { name: 'description', content: 'Trang tổng quan cho quản lý tác vụ và công việc.' },
  ],
});

const isModalVisible = ref(false);
const selectedTask = ref<Task | null>(null);

// Dữ liệu mẫu, sau này sẽ được thay thế bằng Pinia store hoặc API call
const allTasks = ref<Task[]>([
  { id: 1, title: 'Thiết kế giao diện Dashboard', description: 'Hoàn thành thiết kế cho trang Dashboard.', due_date: '2024-07-20', status: 'Completed' },
  { id: 2, title: 'Phát triển API cho Tasks', description: 'Xây dựng các endpoint cho CRUD tasks.', due_date: '2024-07-22', status: 'In Progress' },
  { id: 3, title: 'Tích hợp Frontend với API', description: 'Kết nối UI với backend API.', due_date: '2024-07-25', status: 'To Do' },
  { id: 4, title: 'Viết Unit Test cho services', description: 'Đảm bảo coverage trên 80%.', due_date: '2024-07-28', status: 'To Do' },
  { id: 5, title: 'Triển khai lên Staging', description: 'Deploy phiên bản mới nhất.', due_date: '2024-07-29', status: 'To Do' },
]);

// --- Dữ liệu tính toán cho các component con ---

const taskSummary = computed(() => ({
  total: allTasks.value.length,
  completed: allTasks.value.filter(t => t.status === 'Completed').length,
  pending: allTasks.value.filter(t => t.status !== 'Completed').length,
}));

const taskStats = computed(() => ({
  completed: allTasks.value.filter(t => t.status === 'Completed').length,
  inProgress: allTasks.value.filter(t => t.status === 'In Progress').length,
  toDo: allTasks.value.filter(t => t.status === 'To Do').length,
}));

const recentTasks = computed(() => {
  // Sắp xếp theo ID giảm dần để lấy các công việc mới nhất, giới hạn 5 công việc
  return [...allTasks.value].sort((a, b) => b.id - a.id).slice(0, 5);
});

// --- Logic xử lý Modal ---

const openTaskModal = (task: Task | null) => {
  selectedTask.value = task ? { ...task } : null;
  isModalVisible.value = true;
};

const closeTaskModal = () => {
  isModalVisible.value = false;
  selectedTask.value = null;
};

const handleSaveTask = (taskData: Partial<Task>) => {
  if (taskData.id) {
    const index = allTasks.value.findIndex(t => t.id === taskData.id);
    if (index !== -1) {
      allTasks.value[index] = { ...allTasks.value[index], ...taskData };
    }
  } else {
    const newTask: Task = {
        id: Date.now(),
        title: taskData.title || 'Không có tiêu đề',
        description: taskData.description || '',
        due_date: taskData.due_date || '',
        status: taskData.status || 'To Do',
    };
    allTasks.value.push(newTask);
  }
};
</script>

<template>
  <div class="h-full">
    <HeadSection :icon="ArrowTrendingUpIcon" customClassIcon="text-yellow-500" title="Tổng quan công việc" />
    
    <div class="mt-8 space-y-8 h-full">
      <!-- Task Summary -->
      <TaskSummary :summary="taskSummary" />

      <!-- Main Content Area -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Recent Tasks (2/3 width on large screens) -->
        <div class="lg:col-span-2">
          <RecentTasks :tasks="recentTasks" />
        </div>

        <!-- Task Chart (1/3 width on large screens) -->
        <div class="lg:col-span-1 h-full">
          <TaskChart :stats="taskStats" />
        </div>
      </div>
    </div>

     <!-- Nút thêm công việc và Modal vẫn giữ nguyên -->
    <button @click="openTaskModal(null)" class="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      <PlusIcon class="h-6 w-6" />
    </button>
    
    <TaskForm 
      :visible="isModalVisible" 
      :task="selectedTask" 
      @close="closeTaskModal"
      @save="handleSaveTask"
    />
  </div>
</template>