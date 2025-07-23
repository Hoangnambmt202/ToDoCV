<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useHead } from '@vueuse/head';
import { ArrowTrendingUpIcon } from '@heroicons/vue/24/outline';
import HeadSection from '@/components/sections/HeadSection.vue';
import TaskSummary from '@/components/dashboard/TaskSummary.vue';
import TaskChart from '@/components/dashboard/TaskChart.vue';
import RecentTasks from '@/components/dashboard/RecentTasks.vue';
import TaskForm from '@/components/tasks/TaskForm.vue';
import AddTaskButton from '@/components/tasks/AddTaskButton.vue';

import type { Task } from '@/types/task';
import { useTaskStore } from '@/stores/task';
import TaskService from '@/services/TaskService';

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
const taskStore = useTaskStore(); // Giả sử bạn có một store để quản lý tác vụ
// Dữ liệu mẫu, sau này sẽ được thay thế bằng Pinia store hoặc API call
const allTasks = taskStore.tasks;

// --- Dữ liệu tính toán cho các component con ---

const taskSummary = computed(() => ({
  total: allTasks.length,
  completed: allTasks.filter(t => t.status === 'completed').length,
  todo: allTasks.filter(t => t.status !== 'completed').length,
}));

const taskStats = computed(() => ({
  completed: allTasks.filter(t => t.status === 'completed').length,
  inProgress: allTasks.filter(t => t.status === 'doing').length,
  toDo: allTasks.filter(t => t.status === 'to-do').length,
}));

const recentTasks = computed(() => {
  // Sắp xếp theo ID giảm dần để lấy các công việc mới nhất, giới hạn 5 công việc
  return [...allTasks].sort((a, b) => b.id - a.id).slice(0, 5);
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
const handleLoadTasks = async () => {
  try {
    taskStore.setLoading(true);
    const response = await TaskService.getTasks(); // ✅ phải await
    taskStore.setTasks(response.data);
  } catch (error) {
    taskStore.setError('Lỗi tải lại danh sách công việc');
  } finally {
    taskStore.setLoading(false);
    closeTaskModal();  
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

    <AddTaskButton @click="openTaskModal(null)" />
    
     <TaskForm
      :visible="isModalVisible"
      :task="selectedTask"
      @close="closeTaskModal"
      @success="handleLoadTasks"
    />
  </div>
</template>