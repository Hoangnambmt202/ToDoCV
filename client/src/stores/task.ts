// stores/task.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import TaskService from '@/services/TaskService'


export const useTaskStore = defineStore('task', () => {
  const tasks = ref<any[]>([])
  const selectedTask = ref<any | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTasks = async () => {
    loading.value = true
    try {
      const response = await TaskService.getTasks()
      return tasks.value = response.data.data ?? response.data
    } catch (err: any) {
      error.value = 'Lỗi khi tải danh sách công việc'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchTaskById = async (id: string | number) => {
    loading.value = true
    try {
      const response = await TaskService.showTask(id)
      return selectedTask.value = response.data.data
    } catch (err: any) {
      error.value = 'Không thể lấy chi tiết task'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const addTask = async (newTask: { title: string; status: string; user_id: number }) => {
    loading.value = true
    try {
      await TaskService.addTask(newTask)
      await fetchTasks()
     
    
    } catch (err: any) {
      error.value = 'Không thể thêm task'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  const updateTask = async (id: number | string, updatedData: { title: string; status: string }) => {
  loading.value = true
  try {
    await TaskService.updateTask(id, updatedData)
    await fetchTasks() // cập nhật danh sách sau khi sửa
    selectedTask.value = { ...selectedTask.value, ...updatedData } // cập nhật local selectedTask
  } catch (err: any) {
    error.value = 'Không thể cập nhật task'
    console.error(err)
  } finally {
    loading.value = false
  }
}


  return {
    tasks,
    selectedTask,
    loading,
    error,
    fetchTasks,
    fetchTaskById,
    addTask,
    updateTask,
  }
})
