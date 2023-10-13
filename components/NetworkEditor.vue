<template>
    <input type="text" v-model="networkName" placeholder="New network" class="mb-4 break-all break-words w-full text-3xl bg-slate-700 text-center font-bold"/>
    <div @click="openCreationPopup()" class="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-slate-800 border-2 border-cortex-light-green rounded-md shadow-sm hover:bg-cortex-light-green hover:bg-opacity-30"> 
        + Add a layer
    </div>
    <Transition>
        <AddLayerPopup v-show="showCreationPopup" @addLayer="addLayer" @close="closeCreationPopup" :network="network"></AddLayerPopup>
    </Transition>    
    <Transition>
        <EditLayerPopup v-show="showEditionPopup" :layerToEdit="layerToEdit" :network="network" @editLayer="editLayer" @close="closeEditionPopup"></EditLayerPopup>
    </Transition>   
    <div class="p-2 border-2 border-cortex-green rounded-lg my-2 flex gap-2 border-dashed overflow-x-scroll">
        <div class="w-2/12 border-2 border-cortex-light-green rounded-lg flex" v-for="(layer, index) in network.layers" :key="layer.name">

            <div @click="makeLayerGoLeft(layer, index)" class="flex items-center rounded-l-lg border-r-2 border-cortex-light-green w-1/12 bg-slate-800 cursor-pointer hover:bg-cortex-light-green hover:bg-opacity-30">
                <img src="../assets/images/arrow-left.png"/>
            </div>

            <div class="w-10/12 p-2">
                <div class="flex justify-between">
                    <button @click="openEditionPopup(layer)" class="bg-slate-800 hover:bg-cortex-light-green hover:bg-opacity-30 p-1 rounded-lg w-[2vw] h-[2vw] border-2 border-cortex-light-green cursor-pointer"><img src="../assets/images/edit.svg"/></button>
                    <div class="text-lg text-center py-2 max-w-[60%]"> {{ layer.name }}</div>
                    <button @click="removeLayer(index)" class="bg-slate-800 hover:bg-red-700 hover:bg-opacity-30 p-1 rounded-lg w-[2vw] h-[2vw] border-2 border-red-500 cursor-pointer"><img src="../assets/images/trash.svg"/></button>
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

            <div @click="makeLayerGoRight(layer, index)" class="flex items-center rounded-r-lg border-l-2 border-cortex-light-green w-1/12 bg-slate-800 cursor-pointer hover:bg-cortex-light-green hover:bg-opacity-30">
                <img src="../assets/images/arrow-right.png"/>
            </div>

        </div>
    </div>
    <div @click="createNetwork()" class="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-slate-800 border-2 border-cortex-light-green rounded-md shadow-sm hover:bg-cortex-light-green hover:bg-opacity-30"> 
        Confirm
    </div>
</template>
<script setup lang="ts">

    import { ref } from 'vue';
    import { Network, Layer, LayerType, LayerOption } from '../interfaces/NetworkInterfaces';

    let showCreationPopup = ref(false);
    let showEditionPopup = ref(false);

    //initialize default layer to avoid typing errors when passing the argument to EditLayerPopup
    let defaultLayer = {
        name: 'name',
        type: { id: 0, name: 'name', options: []},
        options: []
    }
    let layerToEdit = ref<Layer>(defaultLayer);

    let networkName = ref<string>('');
    let network = ref<Network>({ id: undefined, name: '', layers: [] });

    function addLayer(name: string, type: LayerType, options: { option: LayerOption, optionValue: string|number|undefined }[]): void {
        
        let nameClone = name.slice();
        let typeClone = { ...type };
        let optionsClone = { ...options };

        network.value.layers.push({ name: nameClone, type: typeClone, options: optionsClone});
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
        //call to back to create network
        await $fetch( '/localhost:8000/neuralnetwork/', {
            method: 'POST',
            body: network
        });
    }

    function makeLayerGoLeft(layer: Layer, index: number)  {

        if(index == 0)
            return;

        let layerToMove = network.value.layers[index];
        network.value.layers[index] = network.value.layers[index-1];
        network.value.layers[index-1] = layerToMove;
    }

    function makeLayerGoRight(layer: Layer, index: number)  {
            
        if(index == network.value.layers.length-1)
            return;

        let layerToMove = network.value.layers[index];
        network.value.layers[index] = network.value.layers[index+1];
        network.value.layers[index+1] = layerToMove;
    }
</script>