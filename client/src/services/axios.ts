import axios from 'axios';
import Cookies from 'js-cookie'
const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, 
  headers: {
    'Accept': 'application/json'
  }
});
api.interceptors.request.use((config) => {
  const xsrfToken = Cookies.get('XSRF-TOKEN');
  if (xsrfToken) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
  }
  return config;
});
// Interceptor để bắt lỗi CSRF hết hạn
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 419) {
      // Chuyển hướng đến đăng nhập
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api;

