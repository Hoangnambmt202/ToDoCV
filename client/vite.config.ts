import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    watch: {
      usePolling: true,      // 👈 Bắt buộc nếu dùng WSL hoặc Docker
      interval: 100,         // 👈 Kiểm tra mỗi 100ms (có thể chỉnh)
    },
    port: 5173,
    strictPort: true,
    open: true              // 👈 Tự mở trình duyệt khi chạy dev server
  }
})
