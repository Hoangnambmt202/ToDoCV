<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

// Import layout components
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import GuestLayout from '@/layouts/GuestLayout.vue'

// Lấy route hiện tại
const route = useRoute()

// Mapping layout theo meta
const layoutComponent = computed(() => {
  const layout = route.meta.layout
  if (layout === 'guest') return GuestLayout
  return DefaultLayout // mặc định
})
</script>
