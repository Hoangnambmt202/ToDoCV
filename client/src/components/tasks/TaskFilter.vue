<template>
  <div class="flex items-center gap-4 mb-4 p-4 bg-white rounded-t-lg ">
    <div class="flex-grow">
      <label for="status-filter" class="sr-only">Lọc theo trạng thái</label>
      <select id="status-filter" v-model="filters.status" @change="emitFilter" class="block w-full rounded-md border-gray-300 shadow-sm outline-none  sm:text-sm p-4 z-10 ">
        <option value="">Tất cả trạng thái</option>
        <option value="to-do">Việc cần làm</option>
        <option value="doing">Đang làm</option>
        <option value="completed">Đã hoàn thành</option>
      </select>
    </div>
    <!-- Thêm các bộ lọc khác ở đây nếu cần, ví dụ: theo ngày, theo tag -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const filters = ref({ status: '' });
const emit = defineEmits(['filter']);

function emitFilter() {
  emit('filter', { ...filters.value });
}
</script>