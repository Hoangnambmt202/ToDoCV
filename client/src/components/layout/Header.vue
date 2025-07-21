<script lang="ts" setup>
import { ArrowRightOnRectangleIcon, BellIcon } from '@heroicons/vue/24/outline';
import { useAuthStore } from '@/stores/auth';
import authService from '@/services/AuthService';
import { useRouter } from 'vue-router';
import { Tippy } from 'vue-tippy';
import { ref ,onMounted} from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const tippyRef = ref(null);

const logout = async () => {
  await authService.logout();
  authStore.logout();
  router.push({ name: 'Login' });
};
</script>

<template>
  <header class="bg-white shadow-xl border border-gray-300 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
    <div class="flex items-center">
      <h1 class="text-xl font-bold text-gray-800">TodoCV</h1>
    </div>
    <div class="flex gap-4 items-center">
      <button class="cursor-pointer ">
        <BellIcon class="h-6 w-6 text-gray-600 hover:text-gray-700" />
      </button>
      <span class="text-gray-600 cursor-pointer">Xin chào,

        <Tippy interactive trigger="click" placement="top-start" theme="light" onClickOutSide="() => $emit('close')" ref="tippyRef">
          <template #default>
          <button class="cursor-pointer">
            {{ authStore.user?.name || 'Người dùng' }}
          </button>
       
          </template>
          <template #content >
            <div class="flex flex-col w-40 rounded p-2 text-sm gap-2">
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