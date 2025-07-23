import axios from './axios'

export default {
  async searchTasks(query: string) {
    return axios.get(`/api/search?q=${encodeURIComponent(query)}`)
  },
  
  // Có thể thêm các phương thức tìm kiếm theo filter khác
  async searchByStatus(status: string) {
    return axios.get(`/api/search/status/${status}`)
  },
  
  async searchByPriority(priority: string) {
    return axios.get(`/api/search/priority/${priority}`)
  }
}
