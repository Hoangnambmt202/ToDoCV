
<template>
  <button
    @click="$emit('click')"
    class="fixed z-40 bottom-20 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    <PlusIcon class="h-6 w-6" />
  </button>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline';
</script>
