<template>
    <div class="w-full rounded-lg mt-2">
        <input autocomplete="off" @input="refreshPropositions()" @focusin="refreshPropositions()" @focusout="clearPropositions()" v-model="searchTerm" class="mb-1 w-full bg-white text-black px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cortex-light-green" type="text" id="search">
        <ul v-if="propositions.length" class="absolute rounded-md w-full z-50">
            <li class="text-black bg-white hover:bg-gray-400 active:bg-slate-500 cursor-pointer px-1" v-for="proposition in propositions" :key="proposition.name" @click="selectItem(proposition)">
                {{ proposition.name }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">

    //import { emit } from 'process';
    import {ref} from 'vue'
 

    const props = defineProps({
        items: Array,
        key: String
    })

    const emit = defineEmits(['autocomplete']);


    let items = props.items as { name: string, [x: string | number | symbol]: unknown } [];
    let searchTerm = ref('');
    let propositions = ref<{ name: string, [x: string | number | symbol]: unknown } []>([]);
    

    function refreshPropositions() {

        let matches = 0;
        
        if(!items)
            return;

        propositions.value = items.filter(item => {

            if (item.name.toLowerCase().includes(searchTerm.value.toLowerCase())) {
                
                matches++;
                
                return item;
            }
        })
    }

    const clearPropositions = () => {

        console.log('clearing propositions');
        
        setTimeout(() => {
            propositions.value = [];
        }, 100);
    }

    const selectItem = async (item: { name: string, [x: string | number | symbol]: unknown }) => {

        searchTerm.value = item.name;
        
        emit('autocomplete', item);
    }

</script>
