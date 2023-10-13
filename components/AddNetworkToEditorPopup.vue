<template>
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
		<div class="bg-slate-800 rounded-lg p-8 shadow-lg z-100 max-h-[90vh] overflow-y-scroll w-9/12">
			<!-- Add your content for the popup card here -->
			<slot>
				<div class="w-full">
					<input type="text" v-model="networkName" placeholder="Add network" class=" break-all break-words w-full text-3xl bg-slate-700 text-center font-bold"/>
					<div class="flex items-start justify-start w-full h-full p-4">
						<div class="relative w-full mt-4">
							<label for="networks" class="block font-medium dark:text-white mb-2">Available networks</label>
							<select v-model="selectedNetwork" id="networks" class="appearance-none border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white">
								<option v-for="network in networks" :value=network>{{ network.name }}</option>
							</select>
						</div>
					</div>
				</div>
			</slot>
			<div class="flex justify-between">
				<button @click="closePopup" class="border-2 border-red-700 mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-red-700 hover:bg-opacity-30 transition-all">
					Cancel
				</button>
				<button @click="addNetwork" class="border-2 border-cortex-light-green mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-cortex-light-green hover:bg-opacity-30 transition-all">
					Add
				</button>
			</div>
		</div>
  	</div>
</template>

<script setup lang="ts">

	import { Network} from '../interfaces/NetworkInterfaces';

	const emit = defineEmits(['addNetwork', 'close']);

	let networks = ref(await useFetch<Network[]>('http://localhost:8000/neuralnetwork/?format=json').data.value);

	let networkName = ref<string>('');
	let selectedNetwork = ref<Network>();

	function addNetwork() {

		emit('addNetwork', selectedNetwork.value);
		closePopup();
	}

	function closePopup() {
		networkName.value = '';
		selectedNetwork.value = undefined;
		emit('close');
	}
</script>