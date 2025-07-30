<template>
  <div class="bg-white w-full rounded-lg shadow-md p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    <!-- Trạng thái -->
    <select v-model="filters.status" @change="emitFilter" class="p-2 border rounded">
      <option value="">Tất cả trạng thái</option>
      <option value="to-do">Cần làm</option>
      <option value="doing">Đang làm</option>
      <option value="completed">Hoàn thành</option>
    </select>

    <!-- Mức độ quan trọng -->
    <label class="flex items-center gap-2">
      <input type="checkbox" v-model="filters.important" @change="emitFilter" />
      Quan trọng
    </label>

    <!-- Từ khóa -->
    <input
      type="text"
      v-model="filters.keyword"
      @input="emitFilter"
      placeholder="Tìm theo tiêu đề hoặc mô tả"
      class="p-2 border rounded"
    />

    <!-- Ngày đến hạn -->
    <input
      type="date"
      v-model="filters.due_date"
      @change="emitFilter"
      class="p-2 border rounded col-span-1"
    />

    <!-- Danh mục -->
    <Multiselect
      v-model="filters.categories"
      :options="categoryOptions"
      mode="tags"
      taggable
      placeholder="Chọn danh mục"
      class="col-span-1"
      @change="emitFilter"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import Multiselect from '@vueform/multiselect';
import '@vueform/multiselect/themes/default.css';
import { useCategoryStore } from '@/stores/category';

const categoryStore = useCategoryStore();
const categoryOptions = ref<string[]>([
  'Work',
  'Personal',
  'Urgent',
  'Later',
  'Important',
]); // Danh sách các category
const filters = ref({
  status: '',
  important: false,
  keyword: '',
  due_date: '',
  categories: [] as string[],
});

const emit = defineEmits(['filter']);
const emitFilter = () => emit('filter', { ...filters.value });
</script>
