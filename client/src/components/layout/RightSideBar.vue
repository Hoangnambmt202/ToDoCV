<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import {
  ArrowPathRoundedSquareIcon,
  ArrowRightEndOnRectangleIcon,
  BellIcon,
  CalendarDaysIcon,
  PaperClipIcon,
  PlusIcon,
  StarIcon,
  TagIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline';
import { watchEffect } from 'vue';
import TaskService from '@/services/TaskService';
import { Tippy } from 'vue-tippy';
import { toast } from 'vue3-toastify';

import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css';
import debounce from 'lodash.debounce';
import { useCategoryStore } from '@/stores/category';
import { useUIStore } from '@/stores/ui';
import { useTaskStore } from '@/stores/task';

const ui = useUIStore();
const taskStore = useTaskStore();
const showDeleteModal = ref(false);
const categoryOptions = ref<string[]>([
  'Work',
  'Personal',
  'Urgent',
  'Later',
  'Important',
  
]); // Danh sách các category
const categoryStore = useCategoryStore();

const localTask = ref({
  title: '',
  status: 'to-do',
  category: null as string | null,
});

const selectedCategories = ref<string[]>([]);
// Load danh mục mỗi khi selectedTask thay đổi
watchEffect(() => {
  if (taskStore.selectedTask?.id) {
    selectedCategories.value = categoryStore.getCategoriesForTask(taskStore.selectedTask.id);
  }
});

const handleNewCategory = (newTag: string) => {
  categoryStore.addCategory(newTag);
  selectedCategories.value.push(newTag);
};

const debouncedSaveChanges = debounce(() => {
  saveChanges();
}, 2000); // đợi 1s sau khi người dùng ngừng thao tác


const saveChanges = async () => {
  if (taskStore.selectedTask) {
    // Chỉ cập nhật các trường có trong DTO
    const { id, title, status, important, due_date, description } = taskStore.selectedTask;
    await TaskService.updateTask(id, { title, status, important, due_date, description, category_names: selectedCategories.value, });
    const response = await TaskService.getTasks();
    taskStore.setTasks(response.data);
    categoryStore.setCategoriesFromTasks(response.data);
  }
};

const confirmDeleteTask = async () => {
  showDeleteModal.value = false;
  ui.closeRightSidebar();
  const id = taskStore?.selectedTask?.id;
  if (!id) return;
  const response = await TaskService.deleteTask(id);
  if (response.status === 200) {
    taskStore.removeTaskFromStore(id);
    taskStore.setSelectedTask(null);
    toast.success('Xóa công việc thành công!');
  } else {
    toast.error('Xóa công việc thất bại!');
  }
};

const toggleImportant = async (id: number) => {
  try {
    taskStore.toggleImportant(id);
    await TaskService.toggleImportant(id);
  } catch (error) {
    toast.error('Đánh dấu thất bại!');
  }
};
const toggleCompleted = async () => {
  if (!taskStore.selectedTask) return;
  const task = taskStore.selectedTask;

  const newStatus = task.status === 'completed' ? 'to-do' : 'completed';
  task.status = newStatus;

  try {
    await TaskService.updateTask(task.id, {
      ...task,
      status: newStatus,
      category_names: selectedCategories.value,
    });
    toast.success(`Đã đánh dấu là ${newStatus === 'completed' ? 'hoàn thành' : 'chưa hoàn thành'}`);
    
    // Cập nhật lại danh sách task
    const response = await TaskService.getTasks();
    taskStore.setTasks(response.data);
    categoryStore.setCategoriesFromTasks(response.data);
  } catch (err) {
    toast.error('Cập nhật trạng thái thất bại!');
  }
};
const toggleCollapse = () => {
  ui.toggleRightSidebar();
};
</script>

<template>
  <div
    class="transition-all duration-300 ease-in-out fixed top-0 right-0 h-full drop-shadow-xl/25 !z-100 overflow-y-auto flex max-h-full flex-col border border-gray-500 bg-white"
    :class="ui.showRightSidebar ? 'w-96' : 'w-0'">
    <div v-if="ui.showRightSidebar && taskStore.selectedTask" class="p-4 flex-1">
      <div class="bg-white shadow-lg p-4 sticky z-50 top-0 left-0 right-0">
        <div v-if="taskStore.selectedTask" class="flex items-center flex-col space-y-2">
          <div class="flex items-center gap-2 w-full">
            <input type="checkbox" name="check" id="check" class="w-6 h-6"
              :checked="taskStore.selectedTask.status === 'completed'" @change="toggleCompleted" />
            
            <input v-model="taskStore.selectedTask.title"
              class="w-full p-2 border-b border-b-gray-500 focus:outline-none" @change="debouncedSaveChanges" />
            <button @click="toggleImportant(taskStore.selectedTask.id)" class="cursor-pointer"
              :class="taskStore.selectedTask.important ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'"
              v-tippy="{ content: taskStore.selectedTask.important ? 'Bỏ đánh dấu quan trọng' : 'Đánh dấu là quan trọng' }">
              <StarIcon class="h-6 w-6" />
            </button>
          </div>
          <div class="flex items-center gap-2 w-full">
            <label for="addStep" name="addStep">
              <PlusIcon class="w-6 h-6 text-black" />

            </label>
            <input type="text" name="addStep" id="addStep" placeholder="Thêm bước"
              class="w-full flex-1 border-b border-b-gray-500 px-3 py-2 mt-1 focus:outline-none">
          </div>
        </div>
      </div>

      <div class="overflow-y-scroll overflow-hidden bg-white max-h-full">
        <div class="bg-white w-full shadow py-4 hover:bg-gray-100 cursor-default ">
          <div class="flex gap-2 ">
            <BellIcon class="w-6 h-6 text-black" />
            <span>Nhắc tôi</span>
          </div>
        </div>

        <div v-if="taskStore.selectedTask.due_date"
          class="bg-white w-full shadow py-4 hover:bg-gray-100 cursor-default ">
          <div class="flex gap-2 ">
            <CalendarDaysIcon class="w-6 h-6 text-black" />
            <span>{{ taskStore.selectedTask.due_date }}</span>
          </div>

        </div>
        <div v-else class="bg-white w-full shadow py-4 hover:bg-gray-100 cursor-default ">
          <div class="flex gap-2 ">
            <CalendarDaysIcon class="w-6 h-6 text-black" />
            <span>Thêm hạn chót</span>
          </div>
        </div>
        <div class="bg-white w-full shadow py-4 hover:bg-gray-100 cursor-default ">
          <div class="flex gap-2 ">
            <ArrowPathRoundedSquareIcon class="w-6 h-6 text-black" />
            <span>Lặp lại</span>
          </div>
        </div>

        <div class="bg-white w-full shadow py-4 px-2 hover:bg-gray-100 cursor-pointer">
          <!-- Tag đã có -->

          <div class="flex gap-2 items-center">
            <TagIcon class="w-6 h-6 text-black" />
            <div class="flex flex-1 gap-1">
              <span v-for="category in selectedCategories" :key="category"></span>
              <Multiselect v-model="selectedCategories" :multiple="true" :options="categoryOptions" mode="tags" taggable
                :createTag="true" placeholder="Chọn hoặc thêm danh mục" :searchable="true" @tag="handleNewCategory"
                @change="debouncedSaveChanges" class="w-full" />
            </div>


          </div>

        </div>

        <div class="bg-white w-full shadow py-4 hover:bg-gray-100  ">
          <div class="flex gap-2 ">
            <span>
              <PaperClipIcon class="w-6 h-6 text-black" />
            </span>
            <input type="file" placeholder="Thêm file" class=" flex-1 text-base text-gray-400 outline-none" />
          </div>
        </div>
        <div class="bg-white border border-gray-400 w-full shadow">
          <textarea name="note" id="note" placeholder="Ghi chú ..." class="w-full h-full outline-none p-2 text-black">
            </textarea>
        </div>
      </div>
    </div>

    <div class="border-t-2 p-4 flex w-full relative justify-between border-gray-500">
      <Tippy content="Thu gọn" placement="left">
        <button @click="toggleCollapse" class="flex items-center justify-center">
          <ArrowRightEndOnRectangleIcon class="w-6 h-6 text-black hover:text-blue-500 cursor-pointer" />
        </button>
      </Tippy>
      <Tippy content="Xóa công việc" placement="left">
        <button @click="showDeleteModal = true;" class="flex items-center justify-center">
          <TrashIcon id="deleteButton" class="w-6 h-6 text-black hover:text-red-500 cursor-pointer" />
        </button>
      </Tippy>
    </div>
  </div>
  <div id="deleteModal" v-if="showDeleteModal" tabindex="-1"
    class=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-101 justify-center items-center w-full md:inset-0 h-modal md:h-full">
    <div class="relative top-1/2 left-1/3 p-4 w-full opacity-100 max-w-md h-full md:h-auto">
      <!-- Modal content -->
      <div class="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
        <button type="button" @click="showDeleteModal = false"
          class="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
          <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"></path>
          </svg>
          <span class="sr-only">Đóng</span>
        </button>
        <svg class="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor"
          viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clip-rule="evenodd"></path>
        </svg>
        <p class="mb-4 text-gray-500 dark:text-gray-300">Bạn có chắc muốn xóa công việc này không?</p>
        <div class="flex justify-center items-center space-x-4">
          <button @click="showDeleteModal = false" type="button"
            class="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
            Hủy
          </button>
          <button type="submit"
            class="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
            @click="confirmDeleteTask">
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>