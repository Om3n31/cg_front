<template>
    <NuxtLink :to="`/neural-networks/${network.id}`" class="mb-3">
        <div class="bg-slate-900 border-2 border-cortex-light-green rounded-lg font-bold truncate p-3 h-full cursor-pointer transform transition duration-500 hover:scale-110">
            {{network.name}}           
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">

    import { Network } from '../interfaces/NetworkInterfaces';

    const props = defineProps({
		network: {
			type: Object as () => Network, 
			required: true
		}
	});
</script>