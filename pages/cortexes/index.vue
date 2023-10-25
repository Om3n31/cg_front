<template>
    <div class="grid grid-cols-4 gap-5">
        <div v-for="c in cortexes">
            <CortexCard :cortex="c" ></CortexCard>
        </div>
    </div>
</template>

<script setup lang='ts'>

    import {Cortex} from "../../interfaces/NetworkInterfaces"

    let data1 = await useFetch<Cortex[]>('http://localhost:8000/cortexv2/?format=json');

    let cortexes = ref(data1.data.value);

</script>