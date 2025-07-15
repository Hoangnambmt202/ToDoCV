import api from './axios';
export default {
    // 1. Lấy danh sách công việc
    async getTasks() {
        await api.get('/sanctum/csrf-cookie'); // Lấy CSRF cookie
        return api.get('/api/tasks');
    },
    // 2. Thêm công việc mới
    async addTask(task) {
        await api.get('/sanctum/csrf-cookie'); // Lấy CSRF cookie
        return api.post('/api/tasks', task);
    }
    // 3. Cập nhật công việc
    , async updateTask(taskId, task) {
        await api.get('/sanctum/csrf-cookie'); // Lấy CSRF cookie
        return api.put(`/api/tasks/${taskId}`, task);
    },      
    // 4. Xóa công việc
    async deleteTask(taskId) {
        await api.get('/sanctum/csrf-cookie'); // Lấy CSRF cookie
        return api.delete(`/api/tasks/${taskId}`);
    }
};