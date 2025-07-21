<script lang="ts" setup>
import { ref } from 'vue';
import HeadSection from '@/components/sections/HeadSection.vue';
import TaskList from '@/views/TaskList.vue';
import TaskForm from '@/components/tasks/TaskForm.vue';
import { CalendarDaysIcon, PlusIcon } from '@heroicons/vue/24/outline';
import type { Task } from '@/types/task';

// --- State ---
const isModalVisible = ref(false);
const selectedTask = ref<Task | null>(null);

// Dữ liệu mẫu (sau này sẽ đến từ store hoặc API)
const allTasks = ref<Task[]>([
  { id: 1, title: 'Lên kế hoạch cho tuần tới', description: 'Chi tiết kế hoạch', due_date: '2025-06-20', status: 'To Do' },
  { id: 2, title: 'Chuẩn bị tài liệu họp', description: 'Tài liệu cho dự án X', due_date: '2025-06-21', status: 'In Progress' },
  { id: 3, title: 'Gửi email nhắc nhở team', description: 'Nhắc về deadline', due_date: '2025-06-22', status: 'Completed' },
  { id: 4, title: 'Cập nhật báo cáo tháng', description: 'Báo cáo doanh thu', due_date: '2025-06-23', status: 'To Do' },
  { id: 5, title: 'Phỏng vấn ứng viên', description: 'Vị trí Frontend Developer', due_date: '2025-06-24', status: 'To Do' },
  { id: 6, title: 'Kiểm tra bản vá lỗi', description: 'Fix bug #123', due_date: '2025-06-25', status: 'In Progress' },
  { id: 7, title: 'Brainstorm ý tưởng mới', description: 'Cho quý 3', due_date: '2025-06-26', status: 'To Do' },
]);

// --- Modal Handlers ---
const openTaskModal = (task: Task | null) => {
  selectedTask.value = task ? { ...task } : null;
  isModalVisible.value = true;
};

const closeTaskModal = () => {
  isModalVisible.value = false;
  selectedTask.value = null;
};

// --- CRUD Handlers ---
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

const handleDeleteTask = (taskId: number) => {
  allTasks.value = allTasks.value.filter(t => t.id !== taskId);
};
</script>

<template>
  <div>
    <!-- Head section -->
    <HeadSection
      :icon="CalendarDaysIcon"
      title="Công việc đã lập kế hoạch"
      customClassIcon="text-blue-500"
    />

    <!-- Task List Component -->
    <div class="mt-8">
      <TaskList 
        :tasks="allTasks"
        @edit="openTaskModal"
        @delete="handleDeleteTask"
      />
    </div>

    <!-- Nút thêm công việc và Modal -->
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