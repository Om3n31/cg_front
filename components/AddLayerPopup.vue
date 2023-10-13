<template>
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
		<div class="bg-slate-800 rounded-lg p-8 shadow-lg z-100 max-h-[90vh] overflow-y-scroll w-9/12">
			<!-- Add your content for the popup card here -->
			<slot>
				<div class="w-full">
					<input type="text" v-model="layerName" placeholder="New layer" class=" break-all break-words w-full text-3xl bg-slate-700 text-center font-bold"/>
					<div class="flex items-start justify-start w-full h-full p-4">
						<div class="relative w-full mt-4">

							<label for="layerTypes" class="block font-medium dark:text-white mb-2">Layer type</label>
							<select v-model="selectedLayerType" @change="displayOptions()" id="layerTypes" class="appearance-none border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white">
								<option v-for="layerType in layerTypes" :value=layerType>{{ layerType.name }}</option>
							</select>
							
							<div class="border-t-2 mt-6 border-cortex-light-green border-dashed">
								<div v-for="option in selectedLayerTypeOptions">

									<div class="pt-4" v-if="option.option.possible_values.length && (option.option.type == 'boolean' || option.option.type == 'string')">
										<label :for="option.option.id.toString()" class="block font-medium dark:text-white mb-2">{{ option.option.name }}</label>
										<select v-model="option.optionValue" :id="option.option.id.toString()" class="appearance-none border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white">
											<option v-for="value in option.option.possible_values" :value=value>{{ value }}</option>
										</select>
									</div>

									<div class="pt-4" v-if="!option.option.possible_values.length && option.option.type == 'integer'">
										<label :for="option.option.id.toString()" class="block font-medium dark:text-white mb-2">{{ option.option.name }}</label>
										<input v-model="option.optionValue" type="number" :id="option.option.id.toString()" class="appearance-none border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"/>
									</div>

									<div class="pt-4" v-if="option.option.type == 'float'">
										<label :for="option.option.id.toString()" class="block font-medium dark:text-white mb-2">{{ option.option.name }}</label>
										<input v-model="option.optionValue" type="number" :id="option.option.id.toString()" min="0" max="1" class="appearance-none border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"/>
									</div>

								</div>
							</div>

						</div>
					</div>
				</div>
			</slot>
			<div class="flex justify-between">
				<button @click="closePopup" class="border-2 border-red-700 mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-red-700 hover:bg-opacity-30">
					Cancel
				</button>
				<button @click="addLayer" class="border-2 border-cortex-light-green mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-cortex-light-green hover:bg-opacity-30">
					Add
				</button>
			</div>
		</div>
  	</div>
</template>

<script setup lang="ts">

	import { Network, Layer, LayerType, LayerOption } from '../interfaces/NetworkInterfaces';

	const props = defineProps({
		network: {
			type: Object as () => Network, 
			required: true
		}
	});

	const emit = defineEmits(['addLayer', 'close']);

	let layerTypes = ref(await useFetch<LayerType[]>('http://localhost:8000/tflayertype/?format=json').data.value);
    let layerTypeOptions = ref(await useFetch<LayerOption[]>('http://localhost:8000/tflayertypeoption/?format=json').data.value);

	let layerName = ref<string>('');
	let selectedLayerType = ref<LayerType>();
	let	selectedLayerTypeOptions = ref<{ option: LayerOption, optionValue: string|number|undefined }[]>([]);

	function displayOptions() {

		let optionList = layerTypeOptions.value?.filter((option) => { return selectedLayerType.value?.options.includes(option.id) });
		
		if(!optionList)
			return;

		selectedLayerTypeOptions.value.splice(0, selectedLayerTypeOptions.value.length);

		for(let option of optionList)
			selectedLayerTypeOptions.value.push({ option: option, optionValue: undefined});
	}

	function addLayer() {

		for(let layer of props.network.layers) {
			if(layer.name == layerName.value) {
				alert('The name of the layer must be unique. Please check the layer\'s name and try again');
				return;
			}
		}
			
		emit('addLayer', layerName.value, selectedLayerType.value, selectedLayerTypeOptions.value);
		closePopup();
	}

	function closePopup() {
		layerName.value = '';
		selectedLayerType.value = undefined;
		selectedLayerTypeOptions.value = [];
		emit('close');
	}
</script>