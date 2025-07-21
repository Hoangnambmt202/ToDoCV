<script setup lang="ts">
import Header from '@/components/layout/Header.vue';
import RightSideBar from '@/components/layout/RightSideBar.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div class="container mx-auto px-6 py-8">
          <router-view />
          
        </div>
      </main>
    </div>
    <RightSideBar/>
  </div>
</template>