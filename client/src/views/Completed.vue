<script  lang="ts" setup>
import { ref, computed } from 'vue';
import HeadSection from '@/components/sections/HeadSection.vue';
import TaskList from '@/views/TaskList.vue';
import TaskForm from '@/components/tasks/TaskForm.vue';
import { CheckCircleIcon } from '@heroicons/vue/24/outline';
import type { Task } from '@/types/task';

defineOptions({
    name: 'CompletedView'
});

// --- State ---
const isModalVisible = ref(false);
const selectedTask = ref<Task | null>(null);

// Dữ liệu mẫu (sau này sẽ đến từ store hoặc API)
const allTasks = ref<Task[]>([
  { id: 10, title: 'Hoàn thành báo cáo Q2', description: 'Báo cáo tài chính quý 2', due_date: '2024-06-28', status: 'Completed' },
  { id: 11, title: 'Fix bug trên trang đăng nhập', description: 'Lỗi sai mật khẩu không hiển thị thông báo', due_date: '2024-07-01', status: 'Completed' },
  { id: 12, title: 'Tổ chức tiệc team building', description: 'Lên kế hoạch và đặt địa điểm', due_date: '2024-06-15', status: 'Completed' },
  { id: 13, title: 'Mua sắm vật tư văn phòng', description: 'Giấy in, bút, mực in', due_date: '2024-07-05', status: 'Completed' },
  { id: 14, title: 'Gửi email cảm ơn đối tác', description: 'Cảm ơn sự hợp tác trong dự án ABC', due_date: '2024-07-02', status: 'Completed' },
]);

// Lọc ra các công việc đã hoàn thành
const completedTasks = computed(() => {
    return allTasks.value.filter(task => task.status === 'Completed');
});

// --- Modal Handlers ---
const openTaskModal = (task: Task | null) => {
  // Ở trang "Completed", không nên cho phép chỉnh sửa task đã hoàn thành
  // nhưng ta vẫn giữ logic này để có thể xem chi tiết nếu muốn
  selectedTask.value = task ? { ...task } : null;
  isModalVisible.value = true;
};

const closeTaskModal = () => {
  isModalVisible.value = false;
  selectedTask.value = null;
};

// --- CRUD Handlers ---
const handleSaveTask = (taskData: Partial<Task>) => {
  // Logic lưu công việc (có thể không cần thiết ở trang này)
  if (taskData.id) {
    const index = allTasks.value.findIndex(t => t.id === taskData.id);
    if (index !== -1) {
      allTasks.value[index] = { ...allTasks.value[index], ...taskData };
    }
  }
};

const handleDeleteTask = (taskId: number) => {
  // Logic xóa công việc
  allTasks.value = allTasks.value.filter(t => t.id !== taskId);
};
</script>

<template>
  <div>
    <!-- Head section -->
    <HeadSection :icon="CheckCircleIcon" title="Công việc đã hoàn thành" customClassIcon="text-green-600"/>

    <!-- Task List Component -->
    <div class="mt-8">
      <TaskList 
        :tasks="completedTasks"
        @edit="openTaskModal"
        @delete="handleDeleteTask"
      />
    </div>

    <!-- Modal cho thêm/sửa công việc (TaskForm) -->
    <TaskForm 
      :visible="isModalVisible" 
      :task="selectedTask" 
      @close="closeTaskModal"
      @save="handleSaveTask"
    />
  </div>
</template>

<style lang="">

</style>