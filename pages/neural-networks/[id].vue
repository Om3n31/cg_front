<template>
    <div>
        <p>Cortex #{{ id }}</p>
    </div>
</template>

<script setup>
    
    import { DBNetwork } from '../../interfaces/NetworkInterfaces';
    const { id } = useRoute().params

    let network = ref(await useFetch<DBNetwork>('http://localhost:8000/neuralnetwork/?format=json').data.value);

</script>