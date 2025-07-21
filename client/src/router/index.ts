import Cookies from 'js-cookie'
import Dashboard from '@/views/Dashboard.vue'
import LoginView from '@/views/LoginView.vue'
import PlannedView from '@/views/Planned.vue'
import SignUpView from '@/views/SignUpView.vue'
import Completed from '@/views/Completed.vue'
import TaskList from '@/views/TaskList.vue'
import Planned from '@/views/Planned.vue'
import ProfileView from '@/views/ProfileView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      meta: { layout: 'default', requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'tasks',
          name: 'Tasks',
          component: TaskList
        },
        {
          path: 'completed',
          name: 'Completed',
          component: Completed
        },
        {
          path: 'planned',
          name: 'Planned',
          component: Planned
        },
        {
          path: 'profile',
          name: 'Profile',
          component: ProfileView
        }
      ]
    },
    // Routes for unauthenticated users
    {
      path: '/login',
      component: LoginView,
      meta: { layout: 'guest' },
    },
    {
      path: '/sign-up',
      component: SignUpView,
      meta: { layout: 'guest' },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = Cookies.get('XSRF-TOKEN')  // Lấy token từ cookie

  // Kiểm tra xem route yêu cầu xác thực hay không
  if (to.meta.requiresAuth) {
    // Nếu không có token (chưa đăng nhập), chuyển hướng đến trang login
    if (!token) {
      next('/login')
    } else {
      // Nếu có token, cho phép tiếp tục (có thể thêm logic kiểm tra token nếu cần)
      next()
    }
  } else {
    // Nếu route không yêu cầu xác thực (chẳng hạn như trang login, sign-up), tiếp tục bình thường
    next()
  }
})

export default router