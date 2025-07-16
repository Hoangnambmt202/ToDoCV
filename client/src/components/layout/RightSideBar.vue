<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useUIStore } from '@/stores/ui'
import { useTaskStore } from '@/stores/task';
import { ArrowPathRoundedSquareIcon, ArrowRightEndOnRectangleIcon, BellIcon, CalendarDaysIcon, PaperClipIcon, TagIcon, TrashIcon } from '@heroicons/vue/24/outline';

const ui = useUIStore()
const taskStore = useTaskStore()
const showDeleteModal = ref(false)


const editableTask = ref({
  title: '',
  status: 'pending',
})
const toggleCollapse = () => {
  ui.toggleRightSidebar()

}

// Khi selectedTask thay đổi, cập nhật editableTask
watch(
  () => taskStore.selectedTask,
  (newTask) => {
    if (newTask) {
      editableTask.value = {
        title: newTask.title,
        status: newTask.status,
      }
    }
  },
  { immediate: true }
)
const handleDelete = async () => {

}
const saveChanges = async () => {
  if (!taskStore.selectedTask) return

  const hasChanged =
    editableTask.value.title !== taskStore.selectedTask.title ||
    editableTask.value.status !== taskStore.selectedTask.status

  if (!hasChanged) return // không cần lưu nếu không thay đổi

  await taskStore.updateTask(taskStore.selectedTask.id, editableTask.value)
}

</script>



<template>
  <div class="transition-all duration-300 ease-in-out flex max-h-full flex-col border border-gray-500 bg-white "
    :class="ui.showRightSidebar ? 'w-96' : 'w-0 '">


    <div v-if="ui.showRightSidebar" class="p-4 ">
      <!-- Update task input -->
      <div class="bg-white shadow-lg p-4 sticky z-50 top-0 left-0 right-0 ">
        <div v-if="taskStore.selectedTask" class="flex items-center flex-col space-y-2">
          <div class="flex items-center gap-2 w-full">
            <label
              class="relative top-0 left-8 text-[#008080] flex cursor-pointer items-center justify-center gap-[1em]"
              for="tick">
              <input class="peer appearance-none" id="tick" name="tick" type="checkbox" />
              <span
                class="absolute left-0 top-1/2 h-[2em] w-[2em] -translate-x-full -translate-y-1/2 rounded-[0.25em] border-[2px] border-[#008080]">
              </span>
              <svg viewBox="0 0 69 89"
                class="absolute left-0 top-1/2 h-[2em] w-[2em] -translate-x-full -translate-y-1/2 duration-500 ease-out [stroke-dasharray:100] [stroke-dashoffset:100] peer-checked:[stroke-dashoffset:0]"
                fill="none" height="89" width="69" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M.93 63.984c3.436.556 7.168.347 10.147 2.45 4.521 3.19 10.198 8.458 13.647 12.596 1.374 1.65 4.181 5.922 5.598 8.048.267.4-1.31.823-1.4.35-5.744-30.636 9.258-59.906 29.743-81.18C62.29 2.486 63.104 1 68.113 1"
                  stroke-width="6px" stroke="#008080" pathLength="100"></path>
              </svg>

            </label>
            <input v-model="editableTask.title" class="w-full ml-8 p-2 border-b border-b-gray-500 focus:outline-none"
              placeholder="Tiêu đề công việc" @blur="saveChanges" />
          </div>
          <div class="flex gap-2 w-full">
            <button title="Add New" class="group cursor-pointer outline-none hover:rotate-90 duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24"
                class="stroke-zinc-400 fill-none group-hover:fill-zinc-800 group-active:stroke-zinc-200 group-active:fill-zinc-600 group-active:duration-0 duration-300">
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                  stroke-width="1.5"></path>
                <path d="M8 12H16" stroke-width="1.5"></path>
                <path d="M12 16V8" stroke-width="1.5"></path>
              </svg>
            </button>

            <input type="text" name="addStep" id="addStep" placeholder="Thêm bước"
              class="w-full flex-1 border-b border-b-gray-500 px-3 py-2 mt-1 focus:outline-none">
          </div>

        </div>
      </div>
      <div class="overflow-y-scroll max-h-78">

        <div class="bg-white w-full shadow p-4 ">
          <div class="flex gap-2 ">
            <BellIcon class="w-6 h-6 text-black" />
            <span>Nhắc tôi</span>
          </div>
        </div>

        <div class="bg-white w-full shadow p-4 ">
          <div class="flex gap-2 ">
            <CalendarDaysIcon class="w-6 h-6 text-black" />
            <span>Thêm hạn chót</span>
          </div>
        </div>
        <div class="bg-white w-full shadow p-4 ">
          <div class="flex gap-2 ">
            <ArrowPathRoundedSquareIcon class="w-6 h-6 text-black" />
            <span>Lặp lại</span>
          </div>
        </div>
        <div class="bg-white w-full shadow p-4 ">
          <div class="flex gap-2 ">
            <TagIcon class="w-6 h-6 text-black" />
            <span>Thêm danh mục</span>
          </div>
        </div>

        <div class="bg-white w-full shadow p-4 ">
          <div class="flex gap-2 ">
            <PaperClipIcon class="w-6 h-6 text-black" />
            <span>Thêm File</span>
          </div>
        </div>
        <div class="bg-white w-full shadow">
          <textarea name="note" id="note" placeholder="Ghi chú ..." class="w-full h-full outline-none p-4">
            </textarea>
        </div>
      </div>
    </div>

    <div class="border-t-2 p-4 flex w-full relative justify-between border-gray-500">
      <ArrowRightEndOnRectangleIcon class="w-6 h-6 text-black hover:text-blue-500 cursor-pointer"
        @click="toggleCollapse" />
      <TrashIcon id="deleteButton"  @click="showDeleteModal = true"
        class="w-6 h-6 text-black hover:text-red-500 cursor-pointer" />
      <div id="deleteModal" v-if="showDeleteModal" tabindex="-1" aria-hidden="true"
        class=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
        <div class="relative top-1/2 left-1/3 p-4 w-full opacity-100 max-w-md h-full md:h-auto">
          <!-- Modal content -->
          <div class="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            <button type="button"
                @click="showDeleteModal = false"
              class="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
             >
              <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
            <svg class="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true"
              fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"></path>
            </svg>
            <p class="mb-4 text-gray-500 dark:text-gray-300">Are you sure you want to delete this item?</p>
            <div class="flex justify-center items-center space-x-4">
              <button     @click="showDeleteModal = false" type="button"
                class="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                No, cancel
              </button>
              <button type="submit"
                class="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                Yes, I'm sure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

