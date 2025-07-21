<template>
  <HeadSection :icon="ListBulletIcon" title="Công việc của tôi" customClassIcon="text-blue-600"/>
  <div class="bg-white rounded-lg shadow">
    <!-- Task Filter -->
    <TaskFilter @filter="applyFilter" />

    <!-- Task List -->
    <div v-if="paginatedTasks.length > 0" class="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <TaskCard 
        v-for="task in paginatedTasks" 
        :key="task.id" 
        :task="task"
        @edit="$emit('edit', task)"
        @delete="$emit('delete', task.id)"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 px-4">
      <p class="text-gray-500">Không tìm thấy công việc nào phù hợp.</p>
    </div>

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
import { ref, computed } from 'vue';
import TaskFilter from '@/components/tasks/TaskFilter.vue';
import TaskCard from '@/components/tasks/TaskCard.vue';
import Pagination from '@/components/layout/Pagination.vue';
import type { Task } from '@/types/task';
import HeadSection from '@/components/sections/HeadSection.vue';
import { ListBulletIcon } from '@heroicons/vue/24/outline';
import { useHead } from '@vueuse/head';

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

const filters = ref({
  status: '',
});
const currentPage = ref(1);
const itemsPerPage = ref(6); // Hiển thị 6 công việc mỗi trang

const demoTasks: Task[] = [
  {
    id: 1,
    title: 'Học Vue 3 Composition API',
    description: 'Xem tài liệu chính thức và làm thử project nhỏ.',
    status: 'In Progress',
    due_date: '2025-07-25',
  },
  {
    id: 2,
    title: 'Làm bài tập Laravel',
    description: 'Thực hiện các yêu cầu về authentication và middleware.',
    status: 'To Do',
    due_date: '2025-07-23',
  },
  {
    id: 3,
    title: 'Viết blog về Tailwind',
    description: 'Chia sẻ tips về responsive layout với Tailwind CSS.',
    status: 'Completed',
    due_date: '2025-07-20',
  },
  {
    id: 4,
    title: 'Thiết kế giao diện login',
    description: 'Dùng Vue + Tailwind để tạo form login đẹp.',
    status: 'To Do',
    due_date: '2025-07-22',
  },
  {
    id: 5,
    title: 'Xây API cho Task',
    description: 'Laravel resource controller và route API.',
    status: 'In Progress',
    due_date: '2025-07-28',
  },
  {
    id: 6,
    title: 'Cài đặt Vue Router',
    description: 'Tạo route cho các trang: login, tasks, detail.',
    status: 'To Do',
    due_date: '2025-07-18',
  },
  {
    id: 7,
    title: 'Tạo component TaskForm.vue',
    description: 'Tạo form thêm/sửa công việc.',
    status: 'To Do',
    due_date: '2025-07-29',
  }
];

const filteredTasks = computed(() => {
  return demoTasks.filter(task => {
    if (filters.value.status && task.status !== filters.value.status) {
      return false
    }
    return true
  });
});

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredTasks.value.slice(start, end);
});

const applyFilter = (newFilters: { status: string }) => {
  currentPage.value = 1;
  filters.value = newFilters;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};
</script>
