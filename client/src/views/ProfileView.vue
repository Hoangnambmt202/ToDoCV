<template>
    <div class="p-4 sm:p-6 lg:p-8">
        <HeadSection :icon="UserCircleIcon" title="Hồ sơ của bạn" />

        <div class="mt-8 max-w-4xl mx-auto">
            <!-- Form cập nhật thông tin cá nhân -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold text-gray-800 border-b pb-4">Thông tin cá nhân</h2>
                <form @submit.prevent="updateProfile" class="mt-6 space-y-6">
                    <div class="flex items-center space-x-6">
                        <img class="h-24 w-24 rounded-full object-cover"
                            :src="`https://ui-avatars.com/api/?name=${authStore.user?.name}&background=random`"
                            alt="User avatar">
                        <button type="button"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                            Thay đổi ảnh
                        </button>
                    </div>
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700">Tên</label>
                        <input type="text" id="name" v-model="profileForm.name" :disabled="!isEditing"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </div>
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" v-model="profileForm.email" disabled
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm">
                    </div>
                    <div class="flex justify-end gap-4">
                        <button v-if="isEditing" type="button" @click="cancelEdit"
                            class="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-200 border border-transparent rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer">
                            Hủy
                        </button>
                        <button type="button"
                            class="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                            @click="toggleEdit">
                            {{ isEditing ? 'Lưu' : 'Chỉnh sửa thông tin' }}
                        </button>

                    </div>
                </form>
            </div>

            <!-- Form thay đổi mật khẩu -->
            <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-semibold text-gray-800 border-b pb-4">Thay đổi mật khẩu</h2>
                <form @submit.prevent="changePassword" class="mt-6 space-y-6">
                    <div>
                        <label for="current_password" class="block text-sm font-medium text-gray-700">Mật khẩu hiện
                            tại</label>
                        <input type="password" id="current_password" v-model="passwordForm.current_password"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </div>
                    <div>
                        <label for="new_password" class="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                        <input type="password" id="new_password" v-model="passwordForm.new_password"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </div>
                    <div>
                        <label for="new_password_confirmation" class="block text-sm font-medium text-gray-700">Xác nhận
                            mật khẩu mới</label>
                        <input type="password" id="new_password_confirmation"
                            v-model="passwordForm.new_password_confirmation"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </div>
                    <div class="flex justify-end">
                        <button type="submit"
                            class="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Đổi mật khẩu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { UserCircleIcon } from '@heroicons/vue/24/outline';
import HeadSection from '@/components/sections/HeadSection.vue';
import { useAuthStore } from '@/stores/auth';
import AuthService from '@/services/AuthService';
import { toast } from 'vue3-toastify';

const authStore = useAuthStore();
const isEditing = ref(false)
const originalProfile = ref({ name: '', email: '' })

onMounted( async () => {
    //lấy thông tin user từ api 
    const response = await AuthService.getUser();
    authStore.setUser(response.data);
    if (authStore.user) {
        profileForm.value.name = authStore.user.name;
        profileForm.value.email = authStore.user.email;

        // Sao lưu dữ liệu gốc
        originalProfile.value = { ...profileForm.value }
    }
})
const toggleEdit = async () => {
    if (!isEditing.value) {
        // Chuyển sang chế độ chỉnh sửa
        isEditing.value = true
    } else {
        // Gọi cập nhật profile
        await updateProfile()
        isEditing.value = false
    }
}
const cancelEdit = () => {
    profileForm.value = { ...originalProfile.value }
    isEditing.value = false
}


const profileForm = ref({
    name: '',
});

const passwordForm = ref({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
});


onMounted(() => {
    if (authStore.user) {
        profileForm.value.name = authStore.user.name;
    }
});

const updateProfile = async () => {
    try {
        if (profileForm)  {
            await AuthService.updateUser(profileForm.value);
            toast.success('Cập nhật thông tin thành công!');
            const response = await AuthService.getUser();
            authStore.setUser(response.data);
   
        }
            
    } catch (error) {
        toast.error('Có lỗi xảy ra, vui lòng thử lại.');
    }
};

const changePassword = async () => {
    if (passwordForm.value.new_password !== passwordForm.value.new_password_confirmation) {
        toast.error('Mật khẩu mới không khớp!');
        return;
    }
    try {
        // Logic gọi API thay đổi mật khẩu
        toast.success('Đổi mật khẩu thành công!');
        passwordForm.value = { current_password: '', new_password: '', new_password_confirmation: '' };
    } catch (error) {
        toast.error('Mật khẩu hiện tại không đúng hoặc đã xảy ra lỗi.');
    }
};
</script>
