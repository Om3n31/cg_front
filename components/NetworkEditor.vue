<template>
    <input type="text" v-model="network.name" placeholder="New network" class="mb-4 break-all break-words w-full text-3xl bg-slate-700 text-center font-bold"/>
    <div @click="openCreationPopup()" class="transition-all cursor-pointer inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-slate-800 border-2 border-cortex-light-green rounded-md shadow-sm hover:bg-cortex-light-green hover:bg-opacity-30"> 
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
    <div @click="editNetwork()" class="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-slate-800 border-2 border-cortex-light-green rounded-md shadow-sm hover:bg-cortex-light-green hover:bg-opacity-30 transition-all"> 
        Confirm
    </div>
</template>
<script setup lang="ts">

    import { ref, onMounted } from 'vue';
    import { Network, Layer, LayerType, LayerOption, DBLayer, DBNetwork, DBOption } from '../interfaces/NetworkInterfaces';

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

    //rebuilding the complex objects from the DB
    let network = ref<Network>({ id: undefined, name: '', layers: [] });

    onMounted(async () => {
        await rebuildNetwork(network.value);
    });

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

    async function editNetwork() {

    }

    async function rebuildNetwork(network: Network) {

        let url: string = 'http://localhost:8000/neuralnetwork/' + useRoute().params.id.toString() + '/';

        let NNresponse = await useFetch<DBNetwork>(url, { method: 'GET' });

        if(!NNresponse.data.value)
            return;

        network.id = NNresponse.data.value.id;
        network.name = NNresponse.data.value.name;

        //get layer types and layers type options 
        let layerOptionReponse = await useFetch<LayerOption[]>('http://localhost:8000/tflayertypeoption/', { method: 'GET' })
        let layerResponse = await useFetch<DBLayer[]>('http://localhost:8000/layer/',{ method: 'GET' });

        let layerTypeResponse = await useFetch<LayerType[]>('http://localhost:8000/tflayertype/',{ method: 'GET' });

        if(!layerResponse.data.value)
            return;

        layerResponse.data.value.forEach(layer => {
            if(layer.neural_network == network.id) {

                let type = layerTypeResponse.data.value?.find(layerType => layerType.id == layer.type);

                let typeOptions = layerResponse.data.value?.filter(typeOption => type?.options.includes(typeOption.id)) 
                let typeOptionIds: number[] | undefined = typeOptions?.map(typeOption => typeOption.id);

                if(!type)
                    return;

                network.layers.push({
                    id: layer.id,
                    name: layer.name,
                    position: layer.position,
                    type: { id: type.id, name: type.name, options: typeOptionIds ? typeOptionIds : []},
                    options: []
                });
            }
        });

        //order the layers by position
        network.layers.sort((a, b) => {
            if(!a.position)
                return 1;
            if(!b.position)
                return -1;
            if(a.position < b.position)
                return -1;
            if(a.position > b.position)
                return 1;
            return 0;
        });
        
        let optionResponse = await useFetch<DBOption[]>('http://localhost:8000/tfoption/', { method: 'GET' })
        
        if(!optionResponse.data.value)
            return;

        optionResponse.data.value.forEach(option => {
            network.layers.forEach(layer => {

                if(layer.id == option.layer && layerOptionReponse.data.value) {

                    let optionData = layerOptionReponse.data.value.find(layerTypeOption => layerTypeOption.id == option.option);
                    
                    if(!optionData)
                        return;
                    
                    layer.options.push({
                        option: optionData,
                        optionValue: option.option_value
                    });
                }
            });
        });
    }
</script>