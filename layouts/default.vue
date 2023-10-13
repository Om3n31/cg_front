<template>
    <div>
        <header class="shadow-sm bg-slate-900">
            <nav class="mx-auto p-8 flex justify-between text-white">
                <p class="font-bold text-cortex-light-green">Cortex Groove</p>

                <ul class="flex gap-14">
                    <li>
                        <NuxtLink to="/">Home</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/create-cortex">Create Cortex</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/cortexes">Cortexes</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/neural-networks">Neural Networks</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/datasets">Datasets</NuxtLink>
                    </li>
                </ul>
                <NuxtLink to="/account">Account</NuxtLink>

            </nav>
        </header>
    </div>
    <div class="px-8 mx-10 p-4 text-white transition-all">
        <slot/> 
    </div>
</template>

<style scoped>
    .router-link-exact-active {
        color: #C4F1BE;
    }
</style>