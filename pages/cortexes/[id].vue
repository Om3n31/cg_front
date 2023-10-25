<template>
    <div>
        <input type="text" v-model="cortex.name" placeholder="" class="mb-4 break-all break-words w-full text-3xl bg-slate-700 text-center font-bold"/>
    </div>
    <CortexEditor :cortex="cortex"></CortexEditor>
</template>

<script setup lang='ts'>

    import {Cortex} from "../../interfaces/NetworkInterfaces"

    const id = useRoute().params.id;

    let data1 = await useFetch<Cortex>('http://localhost:8000/cortexv2/'+ id.toString() +'/?format=json');;

    let cortex = ref<Cortex>({ name: '', id: undefined });

    if (data1.data.value) {
        cortex.value = data1.data.value;
    }

</script>