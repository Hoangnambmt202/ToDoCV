<script lang="ts" setup>
import { ArrowRightOnRectangleIcon, BellIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/auth';
import authService from '@/services/AuthService';
import { useRouter } from 'vue-router';
import { Tippy } from 'vue-tippy';
import { ref } from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const tippyRef = ref(null);

const logout = async () => {
  await authService.logout();
  authStore.logout();
  router.push('/login');
};

</script>

<template>
  <header class="bg-white shadow-xl border border-gray-300 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
    <div class="flex items-center">
      <h1 class="text-xl font-bold text-gray-800">TodoCV</h1>
    </div>
    <div class="flex gap-4 items-center">
      <Tippy interactive trigger="click" placement="bottom-end" theme="light" class="flex items-center" ref="tippyRef">
        <template #default>
          <button class="cursor-pointer ">
            <BellIcon class="h-6 w-6 text-gray-600 hover:text-gray-700" />
          </button>
        </template>
        <template #content>
          <div class=" w-64">
            <h3 class="text-sm font-semibold text-gray-800 mb-2">Thông báo</h3>
            <p class="text-sm text-gray-600">Thông báo 1</p>
            <p class="text-sm text-gray-600">Thông báo 2</p>
            <p class="text-sm text-gray-600">Thông báo 3</p>
            <div class="mt-2 flex justify-center">
              <button class="text-blue-600 hover:underline">Xem tất cả</button>
            </div>
          </div>
        </template>
      </Tippy>
      <span class="text-gray-600 cursor-pointer">Xin chào,

        <Tippy interactive trigger="click" placement="top-start" theme="light" @onClickOutSide="() => $emit('close')" ref="tippyRef">
          <template #default>
          <button class="cursor-pointer">
            {{ authStore.user?.name || 'Người dùng' }}
          </button>
       
          </template>
          <template #content >
            <div class="flex flex-col w-40 rounded text-sm gap-1">
              <RouterLink to="/profile" class="p-2 hover:bg-gray-100 rounded"  @click="tippyRef?.hide()">
                Hồ sơ
              </RouterLink>
            
              <button @click="logout" class="p-2 hover:bg-gray-100 rounded text-left">
                Đăng xuất
              </button>
            </div>
          </template>
        </Tippy>
      </span>

    </div>
  </header>
</template>