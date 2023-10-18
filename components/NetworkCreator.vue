<template>


    <Transition>
        <AddLayerPopup v-show="showCreationPopup" @addLayer="addLayer" @close="closeCreationPopup" :network="network"></AddLayerPopup>
    </Transition>    
    <Transition>
        <EditLayerPopup v-show="showEditionPopup" :layerToEdit="layerToEdit" :network="network" @editLayer="editLayer" @close="closeEditionPopup"></EditLayerPopup>
    </Transition>  
    
    <input type="text" v-model="network.name" placeholder="New network" class="mb-4 break-all break-words w-full text-3xl bg-slate-700 text-center font-bold"/>
    <div @click="openCreationPopup()" class="transition-all cursor-pointer inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-slate-800 border-2 border-cortex-light-green rounded-md shadow-sm hover:bg-cortex-light-green hover:bg-opacity-30"> 
        + Add a layer
    </div>
 
    <div class="p-2 border-2 border-cortex-green rounded-lg my-2 flex gap-2 border-dashed overflow-x-scroll">
        <div class="w-2/12 border-2 border-cortex-light-green rounded-lg flex" v-for="(layer, index) in network.layers" :key="layer.name">

            <div @click="makeLayerGoLeft(index)" class="flex items-center rounded-l-lg border-r-2 border-cortex-light-green w-1/12 bg-slate-800 cursor-pointer hover:bg-cortex-light-green hover:bg-opacity-30 transition-all">
                <img src="../assets/images/arrow-left.png"/>
            </div>

            <div class="w-10/12 p-2">
                <div class="flex justify-between">
                    <button @click="openEditionPopup(layer)" class="bg-slate-800 hover:bg-cortex-light-green hover:bg-opacity-30 p-1 rounded-lg w-[2vw] h-[2vw] border-2 border-cortex-light-green cursor-pointer transition-all"><img src="../assets/images/edit.svg"/></button>
                    <div class="text-lg text-center py-2 max-w-[60%]"> {{ layer.name }}</div>
                    <button @click="removeLayer(index)" class="bg-slate-800 hover:bg-red-700 hover:bg-opacity-30 p-1 rounded-lg w-[2vw] h-[2vw] border-2 border-red-500 cursor-pointer transition-all"><img src="../assets/images/trash.svg"/></button>
                </div>
                <div class="mb-2 flex justify-between border-b border-dashed border-opacity-50  ">
                    <div class="text-sm font-mono">Type</div>
                    <div class="text-sm font-mono">{{ layer.type.name }}</div>
                </div>
                <div v-for="option in layer.options" class="mb-2 flex justify-between border-b border-dashed border-opacity-50  ">
                    <div class="text-sm font-mono text-cortex-dark-green">{{ option.option.name }}</div>
                    <div class="text-sm font-mono text-cortex-dark-green">{{ option.optionValue }}</div>
                </div>
            </div>

            <div @click="makeLayerGoRight(index)" class="flex items-center rounded-r-lg border-l-2 border-cortex-light-green w-1/12 bg-slate-800 cursor-pointer hover:bg-cortex-light-green hover:bg-opacity-30 transition-all">
                <img src="../assets/images/arrow-right.png"/>
            </div>

        </div>
    </div>
    <div @click="createNetwork()" class="relative cursor-pointer inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-slate-800 border-2 border-cortex-light-green rounded-md shadow-sm hover:bg-cortex-light-green hover:bg-opacity-30 transition-all"> 
        <div v-show="loading" class="w-full bg-black bg-opacity-50 absolute top-0 left-0 h-full w-full"></div>
        Confirm
        <div v-show="loading" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
            <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-cortex-light-green" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
        </div>
    </div>
</template>
<script setup lang="ts">

    import { ref } from 'vue';
    import { Network, Layer, LayerType, LayerOption, DBLayer } from '../interfaces/NetworkInterfaces';

    let showCreationPopup = ref(false);
    let showEditionPopup = ref(false);

    //initialize default layer to avoid typing errors when passing the argument to EditLayerPopup
    let defaultLayer = {
        id: 0,
        name: 'name',
        position: null,
        type: { id: 0, name: 'name', options: []},
        options: []
    }
    let layerToEdit = ref<Layer>(defaultLayer);

    let network = ref<Network>({ id: undefined, name: '', layers: [] });
    let loading = ref(false);

    function addLayer(name: string, type: LayerType, options: { option: LayerOption, optionValue: string|number|undefined }[]): void {
        
        let nameClone = name.slice();
        let typeClone = { ...type };
        let optionsClone = { ...options };

        network.value.layers.push({id: 0, name: nameClone, position: null, type: typeClone, options: optionsClone});
    }

    function editLayer(oldLayerName: string, layerName: string, selectedLayerType: LayerType, selectedLayerTypeOptions: { option: LayerOption, optionValue: string|number|undefined }[]) {

        let layerToModify = network.value.layers.find(layer => layer.name == oldLayerName);
        
        if (layerToModify) {    
            layerToModify.name = layerName;
            layerToModify.type = selectedLayerType;
            layerToModify.options = selectedLayerTypeOptions;
        }

        layerToEdit.value = defaultLayer;
    }

    function removeLayer(index: number): void {
        network.value.layers.splice(index, 1);
    }

    function openCreationPopup() {
        showCreationPopup.value = true;
    }

    function closeCreationPopup() {
        showCreationPopup.value = false;
    }

    function openEditionPopup(layer: Layer) {
        layerToEdit.value = defaultLayer;

        layerToEdit.value = layer;
        showEditionPopup.value = true;
    }

    function closeEditionPopup() {
        showEditionPopup.value = false;
    }

    async function createNetwork() {

        if(!network.value.name) {
            alert('Please enter a name for the network.');
            return;
        }

        loading.value = true;

        let networkResponse = await useFetch<DBLayer> (
            'http://localhost:8000/neuralnetwork/', 
            {
                method: 'POST',
                body: { 
                    name: network.value.name,
                    hdf5: null,
                }
            }
        );
        
        if(!networkResponse.data.value) {
            alert('An error occured during network creation. Please try again later.');
            return;
        }

        network.value.layers = Object.values(network.value.layers);

        for(let i = 0; i < network.value.layers.length; i++) {

            let layerResponse = await useFetch<DBLayer> (
                'http://localhost:8000/layer/', 
                {
                    method: 'POST',
                    
                    body: { 
                        name: network.value.layers[i].name,
                        position: i,
                        type: network.value.layers[i].type.id,
                        neural_network: networkResponse.data.value.id
                    }
                }
            );

            if(!layerResponse.data.value) {
                alert('An error occured during layer #' + i + ' creation. Please try again later.');
                return;
            }

            network.value.layers[i].options = Object.values(network.value.layers[i].options);

            for(let option of network.value.layers[i].options) {
                
                option.optionValue = option.optionValue?.toString();
                
                let optionResponse = await useFetch<{id: number, option_value: string}> (
                    'http://localhost:8000/tfoption/', 
                    {
                        method: 'POST',
                        body: { 
                            option: option.option.id,
                            option_value: option.optionValue,
                            layer: layerResponse.data.value.id
                        }
                    }
                );
            }
        }

        window.location.href = location.origin + '/neural-networks';
    }

    function makeLayerGoLeft(index: number)  {

        if(index == 0)
            return;

        let layerToMove = network.value.layers[index];
        network.value.layers[index] = network.value.layers[index-1];
        network.value.layers[index-1] = layerToMove;
    }

    function makeLayerGoRight(index: number)  {
            
        if(index == network.value.layers.length-1)
            return;

        let layerToMove = network.value.layers[index];
        network.value.layers[index] = network.value.layers[index+1];
        network.value.layers[index+1] = layerToMove;
    }
</script>