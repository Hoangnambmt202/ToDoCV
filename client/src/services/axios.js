import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true, 
  headers: {
    'Accept': 'application/json'
  }
});
api.interceptors.request.use((config) => {
  const xsrfToken = getCookie('XSRF-TOKEN');
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

// Helper: lấy cookie từ trình duyệt
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}


export default api;

