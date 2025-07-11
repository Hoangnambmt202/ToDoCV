<script  lang="ts" setup>
import HeadSection from '@/components/sections/HeadSection.vue';
import { CheckCircleIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';

defineOptions({
    name: 'CompletedView'
});
const tasks = ref([
  { name: 'Lên kế hoạch cho tuần tới', deadline: '20/6/2025', completed: false },
  { name: 'Chuẩn bị tài liệu cho cuộc họp', deadline: '20/6/2025', completed: false },
  { name: 'Gửi email nhắc nhở', deadline: '20/6/2025', completed: true },
])
</script>
<template>
    <!-- head section -->
    <HeadSection :icon="CheckCircleIcon" title="Công việc đã hoàn thành" customClass="text-green-600"/>
    <div class="bg-white rounded-xl shadow p-4">
        <h2 class="text-xl font-semibold mb-4">Danh sách việc làm đã hoàn thành</h2>
        <ul class="space-y-3">
            <li v-for="(task, index) in tasks" :key="index"
                class="flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <span :class="{ 'line-through': task.completed }">{{ task.name }}</span>
                <input type="checkbox" v-model="task.completed" class="form-checkbox h-5 w-5 text-blue-600" />
            </li>
        </ul>
    </div>
</template>
<style lang="">

</style>