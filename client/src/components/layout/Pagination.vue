<template>
  <div class="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-b-lg shadow">
    <div class="flex flex-1 justify-between sm:hidden">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
        Previous
      </button>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
        Next
      </button>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Hiển thị
          <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
          đến
          <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span>
          của
          <span class="font-medium">{{ totalItems }}</span>
          kết quả
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
            <span class="sr-only">Previous</span>
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </button>
          
          <button v-for="page in pages" :key="page" @click="changePage(page)" :class="['relative inline-flex items-center px-4 py-2 text-sm font-semibold', { 'bg-blue-600 text-white focus-visible:outline-blue-600': page === currentPage, 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50': page !== currentPage }]">
            {{ page }}
          </button>
          
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
            <span class="sr-only">Next</span>
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid';

const props = defineProps<{
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}>();

const emit = defineEmits(['page-change']);

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));

const pages = computed(() => {
  const pagesArray = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pagesArray.push(i);
  }
  return pagesArray;
});

const changePage = (page: number) => {
  if (page > 0 && page <= totalPages.value) {
    emit('page-change', page);
  }
};
</script>