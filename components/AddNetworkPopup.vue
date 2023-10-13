<template>
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
		<div class="bg-slate-800 rounded-lg p-8 shadow-lg z-100 w-6/12 border-2 border-cortex-light-green">

			<div @click="$emit('close')" class="cursor-pointer">
				<div @click="$emit('close')" class="cursor-pointer w-[3vw] h-[3vw] bg-cortex-light-green" style="-webkit-clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%); clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%);">		
				</div>
			</div>
			
			<div class="flex items-start justify-start w-full h-full">
				<div class="relative w-full mt-4 space-y-8">

					<div class="relative w-full">
						<label class="font-medium text-lg">Add existing neural networks to {{ $props.layerName }}</label>
						<ItemList :items="networks" key="Styles" class="w-4/12 text-black"></ItemList>
					</div>

					<div class="relative" @click="addLayers(); $emit('close')">
						<a href="#_"
							class="inline-block w-full px-5 py-4 text-lg font-medium text-center text-white transition duration-200 bg-cortex-light-green rounded-lg hover:bg-cortex-dark-green ease"
							data-primary="violet-500" data-rounded="rounded-lg">Add</a>
					</div>
				</div>
			</div>
		</div>
  	</div>
</template>

<script setup lang="ts">

	const props = defineProps({
		layerName: String,
	})

	let networks = [
		{ name: `network 1`, data: `data 1` }, 
		{ name: `network 2`, data: `data 2` },
		{ name: `network 3`, data: `data 3` }, 
		{ name: `network 4`, data: `data 4` }, 
		{ name: `network 5`, data: `data 5` },
		{ name: `network 6`, data: `data 6` },
		{ name: `network 7`, data: `data 7` }, 
		{ name: `network 8`, data: `data 8` },
		{ name: `network 9`, data: `data 9` }, 
		{ name: `network 10`, data: `data 10` }, 
		{ name: `network 11`, data: `data 11` },
		{ name: `network 12`, data: `data 12` }
	]
		
	function addLayers() {

	}

</script>