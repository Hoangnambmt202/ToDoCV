<template>
 
  <div v-if="visible" class="fixed inset-0 overlay overflow-y-auto h-full w-full flex items-center justify-center"  @click.self="close">
    <div class="relative mx-auto p-5 border w-full max-w-md shadow-xl rounded-md bg-white">
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">{{ formTitle }}</h3>
        <div class="mt-2 px-7 py-3">
          <form >
            <div class="mb-4">
              <label for="title" class="block text-sm font-medium text-gray-700 text-left">Tiêu đề</label>
              <input type="text" id="title" v-model="form.title" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
            </div>
            <div class="mb-4">
              <label for="description" class="block text-sm font-medium text-gray-700 text-left">Mô tả</label>
              <textarea id="description" v-model="form.description" rows="3" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
            </div>
            <div class="mb-4">
              <label for="due_date" class="block text-sm font-medium text-gray-700 text-left">Hạn hoàn thành</label>
              <input type="date" id="due_date" v-model="form.due_date" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required>
            </div>
            
          </form>
        </div>
        <div class="items-center px-4 py-3">
          <button @click="submitForm" class="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Lưu
          </button>
           <button @click="close" class="mt-2 px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300">
            Hủy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { Task } from '@/types/task';
import { toast } from 'vue3-toastify';
import TaskService from '@/services/TaskService';

const isModalVisible = ref(false);
const props = defineProps<{
  visible: boolean;
  
}>();
const emit = defineEmits(['close', 'success']);


const form = ref<Partial<Task>>({ title: '',
  description: '',
  due_date: null,
  status: 'to-do', 
   });
const formTitle = computed(() => ('Tạo công việc mới'));

// Reset form mỗi khi visible = true
watch(() => props.visible, (visible) => {
  if (visible) {
    form.value = {
      title: '',
      description: '',
      due_date: null ,
      status: 'to-do'
    };
  }
});

const close = () => {
  emit('close');
};
const submitForm = async () => {
  try {
   

    const payload = {
      ...form.value,
      due_date: form.value.due_date ? new Date(form.value.due_date) : null,
  
    };
    console.log(typeof form.value.due_date);
    const response = await TaskService.addTask(payload);
    emit('success');
    form.value = {};
    toast.success(response.message);
    emit('close');
  } catch (error) {
    console.error('Lỗi khi tạo task:', error);
  }
};

</script>
