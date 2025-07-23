import api from './axios'

export default {
  // 1. Đăng ký
  async signUp(user: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) {
    await api.get('/sanctum/csrf-cookie') // Lấy CSRF cookie
    return api.post('/api/sign-up', user) // Đăng ký + auto login
  },

  // 2. Đăng nhập
  async login(credentials: { email: string; password: string }) {
    await api.get('/sanctum/csrf-cookie') // Lấy CSRF cookie
    return api.post('/api/login', credentials)
  },

  // 3. Lấy thông tin user
  async getUser() {
    await api.get('/sanctum/csrf-cookie')
    return api.get('/api/user')
  },

  // 4. Đăng xuất
  async logout() {
    await api.get('/sanctum/csrf-cookie')
    return api.post('/api/logout')
  },
  // 5. Cập nhật thông tin user
  async updateUser(userData: { name: string; email: string; avatar: string }) {
    await api.get('/sanctum/csrf-cookie')
    return api.put('/api/update', userData)
  },
  // 6. Thay đổi mật khẩu

  async changePassword(passwordData: {
    current_password: string
    new_password: string
    new_password_confirmation: string
  }) {
    await api.get('/sanctum/csrf-cookie')
    return api.put('/api/change-password', passwordData)
  },
}
