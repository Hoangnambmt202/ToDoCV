
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPersistedstate from 'pinia-plugin-persistedstate';
import { createHead } from '@vueuse/head';
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { plugin as VueTippy } from 'vue-tippy';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

import App from './App.vue'
import router from './router'
import '@/assets/main.css'

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

app.use(VueTippy, {
  directive: 'tippy', // optional
  component: 'Tippy', // optional
  defaultProps: {
    placement: 'top',
    allowHTML: true,
    theme: 'light',
  },
})
app.mount('#app')
