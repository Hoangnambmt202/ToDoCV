<script lang="ts" setup>
import { useHead } from '@vueuse/head';
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify';
import AuthService from '@/services/AuthService';
;

useHead({
  title: 'Đăng ký tài khoản | ToDoCV',
  meta: [
    { name: 'description', content: 'Sign up page for creating a new account' },
    {
      property: 'og:title',
      content: 'Todo Sign Up',
    },
    {
      property: 'og:description',
      content: 'Ứng dụng quản lý task đơn giản, hiệu quả',
    },
  ],
});


const router = useRouter();

const name = ref('nam');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const loading = ref(false);
const error = ref('');

const handleSignUp = async () => {
  error.value = '';
  loading.value = true;

  if (password.value !== passwordConfirm.value) {
    toast.error('Mật khẩu không khớp!');
    loading.value = false;
    return;
  }

  try {
    const res = await AuthService.signUp({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirm.value,
    });

    sessionStorage.setItem('access_token', res.data.access_token);
    toast.success(res.data.message, {
      autoClose: 3000,
      onClose: () => {
        router.push('/login');
      },
    });

   
  } catch (err: any) {
    if (err.response?.data?.errors) {
      const msg = Object.values(err.response.data.errors).flat().join('\n');
      toast.error(msg);
    } else {
      toast.error('Đăng ký thất bại. Vui lòng thử lại sau.');
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900 w-full min-h-screen ">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 gap-2 mx-auto md:h-screen lg:py-0"
    >
      <a href="#" class="flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
        ToDoCV
      </a>
      <span class="text-gray-300 italic mb-4">Ứng dụng quản lý công việc cá nhân</span>
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6">
          <h1
            class="text-xl font-bold mb-2 leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Tạo tài khoản mới
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="handleSignUp">
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Email</label
              >
              <input
                v-model="email"
                required
                type="email"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Password</label
              >
              <input
                v-model="password"
                required
                type="password"
                name="password"
                id="password"
                minlength="6"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div>
              <label
                for="confirm-password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Nhập lại password</label
              >
              <input
                v-model="passwordConfirm"
                required
                type="password"
                name="confirm-password"
                id="confirm-password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="terms"
                  aria-describedby="terms"
                  type="checkbox"
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="font-light text-gray-500 dark:text-gray-300"
                  >Tôi đồng ý với
                  <a
                    class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    href="#"
                    >Điều khoản & Chính sách</a
                  ></label
                >
              </div>
            </div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 border border-primary-600 cursor-pointer"
            >
               {{ loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản' }}
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Bạn có tài khoản rồi?
              <RouterLink
                to="/login"
                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >Đăng nhập tại đây</RouterLink
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
