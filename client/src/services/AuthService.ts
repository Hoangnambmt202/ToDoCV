import api from './axios';

export default {
  // 1. Đăng ký
  async signUp(user:{ name: string; email: string; password: string; password_confirmation: string }) {
    await api.get('/sanctum/csrf-cookie'); // Lấy CSRF cookie
    return api.post('/api/sign-up', user); // Đăng ký + auto login
  },

  // 2. Đăng nhập
  async login(credentials:{ email: string; password: string }) {
    await api.get('/sanctum/csrf-cookie'); // Lấy CSRF cookie
    return api.post('/api/login', credentials);
    
  },

  // 3. Lấy thông tin user
  getUser() {
    return api.get('/api/user');
  },

  // 4. Đăng xuất
  logout() {
    return api.post('/api/logout');
  }
};
