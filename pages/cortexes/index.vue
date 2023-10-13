<template>
    <div class="grid grid-cols-4 gap-5">
        <div v-for="c in cortexes">
            <CortexCard :cortex="c" ></CortexCard>
        </div>
    </div>
</template>

<script setup>
    const cortexes = ref([{ name: 'Cortex 1', id: 1 }, { name: 'Cortex 2', id: 2 }])

    //await useFetch('localhost:3000/cortexes');
</script>