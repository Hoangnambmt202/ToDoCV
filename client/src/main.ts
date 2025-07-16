import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate'
import { createHead } from '@vueuse/head'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import App from './App.vue'
import router from './router'

const app = createApp(App)
const head = createHead()


const pinia = createPinia()
pinia.use(piniaPersistedstate)

app.use(head)
app.use(router)
app.use(pinia)
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
}as ToastContainerOptions)
app.mount('#app')
