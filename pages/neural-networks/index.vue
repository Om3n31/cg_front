<template>

    <NuxtLink to="/create-network" class="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-slate-800 border-2 border-cortex-light-green rounded-md shadow-sm hover:bg-cortex-light-green hover:bg-opacity-30"> 
        Create New Network
    </NuxtLink>

    <div class="grid grid-cols-4 gap-5">
        <div v-for="network in networks">
            <NetworkCard :network="network" ></NetworkCard>
        </div>
    </div>

</template>

<script setup lang="ts">

    import { Network } from '../../interfaces/NetworkInterfaces';

    let networks = ref(await useFetch<Network[]>('http://localhost:8000/neuralnetwork/?format=json').data.value);
</script>