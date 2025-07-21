import api from '@/services/axios'
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types/task'

export default class TaskService {
  // Lấy danh sách tasks
  static async getTasks(): Promise<Task[]> {
    await api.get('/sanctum/csrf-cookie')
    const response = await api.get('/api/tasks')
    return response.data
  }

  // Thêm task mới
  static async addTask(task: CreateTaskDto): Promise<Task> {
    await api.get('/sanctum/csrf-cookie')
    const response = await api.post('/api/tasks', task)
    return response.data
  }

  // Cập nhật task
  static async updateTask(taskId: string, task: UpdateTaskDto): Promise<Task> {
    await api.get('/sanctum/csrf-cookie')
    const response = await api.put(`/api/tasks/${taskId}`, task)
    return response.data
  }

  // Xóa task
  static async deleteTask(taskId: string): Promise<void> {
    await api.get('/sanctum/csrf-cookie')
    await api.delete(`/api/tasks/${taskId}`)
  }

  // Lấy chi tiết task
  static async getTaskById(taskId: string): Promise<Task> {
    const response = await api.get(`/api/tasks/show/${taskId}`)
    return response.data
  }
}