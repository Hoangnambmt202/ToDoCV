import { defineStore } from 'pinia'
import TaskService from '@/services/TaskService'
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types/task'

interface TaskState {
  tasks: Task[]
  selectedTask: Task | null
  loading: boolean
  error: string | null
}

export const useTaskStore = defineStore('task', {
  state: (): TaskState => ({
    tasks: [],
    selectedTask: null,
    loading: false,
    error: null
  }),

  actions: {
    setTasks(tasks: Task[]) {
      this.tasks = tasks
    },

    addTaskToStore(task: Task) {

      this.tasks.push(task)
    },

    updateTask(updatedTask: Task) {
      const index = this.tasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
      }
    },

    removeTaskFromStore(taskId: string) {
      this.tasks = this.tasks.filter(task => task.id !== taskId)
      if (this.selectedTask?.id === taskId) {
        this.selectedTask = null
      }
    },

    setSelectedTask(task: Task| null) {
      this.selectedTask = task
    },

    setLoading(loading: boolean) {
      this.loading = loading
    },

    setError(error: string | null) {
      this.error = error
    },
  },
  persist: true,
  getters: {
    todoTasks: (state) => state.tasks.filter(task => task.status === 'to-do'),
    completedTasks: (state) => state.tasks.filter(task => task.status === 'completed'),
    getTaskById: (state) => (id: number) => state.tasks.find(task => task.id === id)
  }
})