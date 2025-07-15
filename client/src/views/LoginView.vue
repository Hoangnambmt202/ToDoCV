<script lang="ts" setup>
import AuthService from '@/services/AuthService';
import { useHead } from '@vueuse/head';
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';


useHead({
  title: 'Login | ToDoCV',
  meta: [
    {
      name: 'description',
      content: 'Login to your ToDoCV account to manage your tasks and projects.',
    },
  ],
});
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();
const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await AuthService.login({
      email: email.value,
      password: password.value,
    });
  

    toast.success(response?.data.message + `Chào mừng ` + response?.data.name, {
      position: 'top-right',
      autoClose: 3000,
      // Chuyển tới dashboard
      onClose: () => router.push('/dashboard')
    });
  } catch (err: any) {
    if (err.response?.status === 422) {
      error.value = 'Vui lòng kiểm tra lại email và mật khẩu';
    } else {
      error.value = 'Đăng nhập thất bại. Vui lòng thử lại sau';
    }
  } finally {
    loading.value = false;
  }

};
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="#" class="flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
        ToDoCV
      </a>
      <span class="text-gray-300 italic mb-4">Ứng dụng quản lý công việc cá nhân</span>
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Đăng nhập vào tài khoản của bạn
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="handleLogin">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input v-model="email" type="email" name="email" id="email" required
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@example.com" />
            </div>
            <div>
              <label for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input v-model="password" required type="password" name="password" id="password" placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>
            <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
            <div class="flex items-center justify-between">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input id="remember" aria-describedby="remember" type="checkbox"
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                </div>
                <div class="ml-3 text-sm">
                  <label for="remember" class="text-gray-500 dark:text-gray-300">Ghi nhớ tôi</label>
                </div>
              </div>
              <a href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Bạn quên
                mật khẩu?</a>
            </div>
            <button type="submit" :disabled="loading"
              class="w-full text-white bg-blue-500 hover:bg-blue-700 hover:scale-110 cursor-pointer focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
              {{ loading ? 'Đang đăng nhập...' : 'Tiếp tục' }}
            </button>
            <p to="/sign-up" class="text-sm font-light text-gray-500 dark:text-gray-400">
              Bạn chưa có tài khoản?
              <RouterLink to="/sign-up" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Đăng
                ký tài khoản</RouterLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
