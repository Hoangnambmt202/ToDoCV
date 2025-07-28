<template>
  <div v-if="visible" class="fixed inset-0 overlay overflow-y-auto h-full w-full flex items-center justify-center"
    @click.self="close">
    <div class="relative mx-auto p-5 border w-full max-w-md shadow-xl rounded-md bg-white">
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">{{ formTitle }}</h3>
        <div class="mt-2 px-7 py-3">
          <form @submit.prevent="submitForm">
            <div class="mb-4">
              <label for="title" class="block text-sm font-medium text-gray-700 text-left">Tiêu đề</label>
              <input type="text" id="title" v-model="form.title"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required>
            </div>
            <div class="mb-4">
              <label for="description" class="block text-sm font-medium text-gray-700 text-left">Mô tả</label>
              <textarea id="description" v-model="form.description" rows="3"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
            </div>
            
            <div class="mb-4">
              <label for="due_date" class="block text-sm font-medium text-gray-700 text-left mb-1">Hạn hoàn thành</label>
              
              <Tippy interactive trigger="click" theme="light-border" :on-create="onTippyCreated">
                <template #default>
                  <button type="button"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-left shadow-sm bg-white focus:outline-none flex justify-between items-center">
                    <span>{{ form.due_date ? formatDate(form.due_date) : 'Chọn hạn hoàn thành' }}</span>
                    <CalendarDaysIcon class="h-5 w-5 text-gray-400" />
                  </button>
                </template>
                <template #content>
                  <p class="p-2" >Thời hạn</p>
                  <hr class="bg-gray-300 text-gray-300">
                  <button @click="setDate('today')" class="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded">Hôm nay</button>
                    <button @click="setDate('tomorrow')" class="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded">Ngày mai</button>
                    <button @click="setDate('next_week')" class="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded">Tuần tới</button>
                    <hr class="my-1 bg-gray-300 text-gray-300">
                    <input type="date" v-model="manualDate" @change="setManualDate"
                class="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </template>
              </Tippy>
            </div>

          </form>
        </div>
        <div class="items-center px-4 py-3">
          <button type="submit" @click="submitForm"
            class="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Lưu
          </button>
          <button @click="close"
            class="mt-2 px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300">
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
import { Tippy } from 'vue-tippy';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';
import { CalendarDaysIcon } from '@heroicons/vue/24/outline';
import { format, addDays, addWeeks } from 'date-fns';
import type { Instance as TippyInstance } from 'tippy.js';


const props = defineProps<{
  visible: boolean;
}>();
const emit = defineEmits(['close', 'success']);

const form = ref<Partial<Task>>({
  title: '',
  description: '',
  due_date: null,
  status: 'to-do',
});

const isManualInputVisible = ref(false);
const manualDate = ref('');
const tippyInstance = ref<TippyInstance | null>(null);

const formTitle = computed(() => 'Tạo công việc mới');

const onTippyCreated = (instance: TippyInstance) => {
  tippyInstance.value = instance;
};

watch(() => props.visible, (visible) => {
  if (visible) {
    form.value = {
      title: '',
      description: '',
      due_date: null,
      status: 'to-do'
    };
    isManualInputVisible.value = false;
  }
});

const formatDate = (date: string | Date | null) => {
  if (!date) return '';
  return format(new Date(date), 'dd/MM/yyyy');
};

const setDate = (option: 'today' | 'tomorrow' | 'next_week') => {
  const today = new Date();
  let newDate;
  if (option === 'today') {
    newDate = today;
  } else if (option === 'tomorrow') {
    newDate = addDays(today, 1);
  } else if (option === 'next_week') {
    newDate = addWeeks(today, 1);
  }
  form.value.due_date = format(newDate!, 'yyyy-MM-dd');
  isManualInputVisible.value = false;
  tippyInstance.value?.hide();
};



const setManualDate = () => {
  form.value.due_date = manualDate.value;
};

const close = () => {
  emit('close');
};

const submitForm = async () => {
  try {
    const payload = {
      ...form.value,
      user_id: 1, // Tạm thời hardcode, sẽ lấy từ auth store
    };
    const response = await TaskService.addTask(payload as any); // Tạm thời dùng as any
    emit('success');
    toast.success('Tạo công việc thành công!');
    emit('close');
  } catch (error) {
    toast.error('Lỗi khi tạo công việc!');
    console.error('Lỗi khi tạo task:', error);
  }
};
</script>

<style>
.tippy-box[data-theme~='light-border'] {
  border: 1px solid #e2e8f0;
}
</style>