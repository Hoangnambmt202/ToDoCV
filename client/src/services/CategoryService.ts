import api from './axios'

export default {
  /**
   * Lấy danh sách tất cả các category của người dùng.
   */
  getCategories : async () =>  {
    const response = await api.get('/api/categories')
    return response.data;
  },

  /**
   * Tạo danh mục mới.
   * @param name Tên danh mục
   * @param task_id ID của task liên kết với danh mục
   */
  createCategory : async (data: { name: string; task_id: number }) => {
    const response = await api.post('/api/categories', data)
    return response.data;
  },


  /**
   * Cập nhật danh mục.
   * @param id ID danh mục
   * @param name Tên mới
   */
  updateCategory :async(id: number, name: string) =>{
   const response = await api.put(`/api/categories/${id}`, { name })
   return response.data;
  },

  /**
   * Xoá danh mục.
   * @param id ID danh mục
   */
  deleteCategory :async (id: number) => {
    const response = await api.delete(`/api/categories/${id}`)
    return response.data;
  },
}
