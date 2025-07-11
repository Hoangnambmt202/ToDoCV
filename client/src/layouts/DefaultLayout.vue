<script lang="ts" setup>
import Header from '@/components/layout/Header.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
</script>

<template>
  <div class="min-h-screen container mx-auto">
    <Header />
    <div class="block md:flex lg:flex w-full">
      <Sidebar />
      <div
        class="flex-1 p-6 min-h-screen bg-gradient-to-br from-cyan-200 via-blue-300 to-purple-300"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
