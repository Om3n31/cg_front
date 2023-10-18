<template>
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
		<div class="bg-slate-800 rounded-lg p-8 shadow-lg z-100 max-h-[90vh] overflow-y-scroll w-9/12">
			<!-- Add your content for the popup card here -->
			<slot>
				<div class="w-full">
					<input type="text" v-model="cortexName" placeholder="New cortex name" class=" break-all break-words w-full text-3xl bg-slate-700 text-center font-bold"/>
				</div>
			</slot>
			<div class="flex justify-between">
				<button @click="closePopup" class="border-2 border-red-700 mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-red-700 hover:bg-opacity-30 transition-all">
					Cancel
				</button>
				<button @click="addCortex" class="border-2 border-cortex-light-green mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-cortex-light-green hover:bg-opacity-30 transition-all">
					Add
				</button>
			</div>
		</div>
  	</div>
</template>

<script setup lang="ts">

	import {Cortex} from '../interfaces/NetworkInterfaces';

	const emit = defineEmits(['addCortex', 'close']);

	let cortexName = ref<string>('');

    let cortexes = ref(await useFetch<Cortex[]>('http://localhost:8000/cortexv2/?format=json').data.value);

	function addCortex() {
        let nameAlreadyExists = false;
        if (cortexes.value)
            cortexes.value.forEach(cortex => {
                if (cortex.name === cortexName.value) {
                    nameAlreadyExists = true;
                }
        });
		
        if (nameAlreadyExists){
            alert('The name of the cortex must be unique. Please check the cortex\'s name and try again');
			return;
        }

		if (cortexName.value === ""){
            alert('The cortex must have a name.');
			return;
        }


        emit('addCortex', cortexName.value);
		closePopup();
	}

	function closePopup() {
		cortexName.value = '';
		emit('close');
	}
</script>