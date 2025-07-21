<template>
  <div class="bg-white p-4 rounded-lg shadow max-h-screen">
    <h3 class="font-semibold text-gray-800 mb-4">Tổng quan trạng thái công việc</h3>
    <Pie v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Pie } from 'vue-chartjs';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  type ChartData
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const props = defineProps<{
  stats: {
    completed: number;
    inProgress: number;
    toDo: number;
  }
}>();

const chartData = computed<ChartData<'pie'>>(() => ({
  labels: ['Đã hoàn thành', 'Đang làm', 'Việc cần làm'],
  datasets: [
    {
      backgroundColor: ['#4ade80', '#facc15', '#60a5fa'],
      data: [props.stats.completed, props.stats.inProgress, props.stats.toDo],
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>