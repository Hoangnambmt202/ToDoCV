<script lang="ts" setup>
import Header from '@/components/layout/Header.vue'
import RightSideBar from '@/components/layout/RightSideBar.vue';
import Sidebar from '@/components/layout/Sidebar.vue';



</script>

<template>
  <div class="max-h-screen container mx-auto overflow-hidden">
    <Header/>
    <div class="flex w-full max-h-screen overflow-hidden">
      <!-- Left Column -->
      <Sidebar />
      <!-- Center Column -->
      <div
        class="flex-1 p-6 max-h-screen overflow-hidden bg-gradient-to-br from-cyan-200 via-blue-300 to-purple-300"
      >
        <slot/>
      </div>
      <!-- Right Column -->
      <RightSideBar/>
    </div>
  </div>
</template>
