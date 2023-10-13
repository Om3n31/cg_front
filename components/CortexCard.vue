<template>
    <NuxtLink :to="`/cortexes/${cortex.id}`" class="mb-3">
        <div class="bg-slate-900 border-2 border-cortex-light-green rounded-lg font-bold truncate p-3 h-full cursor-pointer transform transition duration-500 hover:scale-110">
            {{cortex.name}}           
            <img src="../assets/images/cortex.jpg"> 
        </div>
    </NuxtLink>
</template>

<script setup>
    const { cortex } = defineProps(['cortex']);
</script>