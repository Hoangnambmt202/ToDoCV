import Dashboard from '@/views/Dashboard.vue'
import LoginView from '@/views/LoginView.vue'
import PlannedView from '@/views/Planned.vue'
import SignUpView from '@/views/SignUpView.vue'
import Completed from '@/views/Completed.vue'

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
  
    },
    {
      path: '/dashboard',
      component: Dashboard,
      meta: { layout: 'default', requiresAuth: false},
    },
    {
      path: '/planned',
      component: PlannedView,
      meta: { layout: 'default' },
    },
    {
      path: '/completed',
      component: Completed,
      meta: { layout: 'default' },
    },
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
  const token = sessionStorage.getItem('access_token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
