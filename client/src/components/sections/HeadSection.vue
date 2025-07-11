<script lang="ts" setup>

defineProps<{
    icon: any;
    title:string;
    customClass?: string
}>();

</script>
<template lang="">
    <div class="mb-4 flex items-center w-fit p-2 bg-white rounded-lg overflow-hidden shadow" >
        <component  :is="icon" :class="['w-8 h-8', customClass]"></component> 
        <h1 class="text-2xl font-bold bg-white px-4 py-1">{{title}}</h1>
    </div>
</template>
<style lang="">
    
</style>