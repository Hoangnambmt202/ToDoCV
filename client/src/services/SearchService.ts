import axios from './axios'

interface SearchParams {
  query?: string
  status?: 'to-do' | 'completed' | 'doing'
  important?: boolean
  start_date?: string
  end_date?: string
  limit?: number
  page?: number
}

class SearchService {
  // Tìm kiếm cơ bản với query
  async searchTasks(query: string) {
    const response =  await axios.get(`/api/search?q=${encodeURIComponent(query)}`)
    return response.data
  }

  // Tìm kiếm nâng cao với nhiều tiêu chí
  async advancedSearch(params: SearchParams) {
    const response = await axios.get('/api/search/advanced', { params })
    return response.data
  }

  // Tìm kiếm theo trạng thái
  async searchByStatus(status: 'completed' | 'doing' | 'to-do') {
    const response = await axios.get(`/api/search/status/${status}`)
    return response.data
  }

  // Tìm kiếm theo độ ưu tiên
  async searchByPriority(important: boolean) {
    const response = await axios.get(`/api/search/priority/${important}`)
    return response.data
  }

  // Tìm kiếm theo khoảng thời gian
  async searchByDateRange(startDate: string, endDate: string) {
    const response = await axios.get('/api/search/date-range', {
      params: { startDate, endDate }
    })
    return response.data
  }

  // Gợi ý tìm kiếm
  async getSearchSuggestions(query: string) {
    const response = await axios.get(`/api/search/suggestions?q=${encodeURIComponent(query)}`)
    return response.data
  }

  // Lấy lịch sử tìm kiếm
  async getSearchHistory() {
    const response = await axios.get('/api/search/history')
    return response.data
  }

  // Lưu lịch sử tìm kiếm
  async saveSearchHistory(query: string) {
    const response = await axios.post('/api/search/history', { query })
    return response.data
  }

  // Xóa lịch sử tìm kiếm
  async clearSearchHistory() {
    const response = await axios.delete('/api/search/history')
    return response.data
  }
}

export default new SearchService()
