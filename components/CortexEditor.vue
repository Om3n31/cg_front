<template>
    <Transition>
        <AddNetworkToEditorPopup v-show="showAddNetworkPopup" @addNetwork="addNetwork" @close="closeAddNetworkPopup"></AddNetworkToEditorPopup>
    </Transition>    
    <div>
      <canvas id="canvas" class="border-2 border-white rounded-lg w-full"></canvas>
    </div>
    <!-- EDIT CORTEX BUTTON-->
    
    <div id="context-menu" style="position: absolute; display: none; background-color: #fff;">

        <div class="menu-item" id="menu-item-add">Add new neural network</div>
        <div class="menu-item" id="menu-item-edit-NN">Edit neural network</div>
        <div class="menu-item" id="menu-item-delete-NN">Delete neural network</div>
        <div class="menu-item" id="menu-item-delete-link">Delete link</div>

    </div>
    
    <!--
    <button @click="confirmChanges" class="border-2 border-white-700 mt-4 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-red-700 hover:bg-opacity-30 transition-all">
					Confirm changes
	</button>
    -->
</template>

<script setup lang="ts">

    import {GraphicalLink} from "../classes/GraphicalLink"
    import {GraphicalNeuralNetwork} from "../classes/GraphicalNeuralNetwork"
    import {Canvas} from "../classes/Canvas"
    import * as paper from "paper";
    import {Cortex, Link, Network} from "../interfaces/NetworkInterfaces"
import { link } from "fs";
    
    const props = defineProps({
        cortex: {
            type: Object as PropType<Cortex>,
            required: true,
        },
    });

    async function getNetworks(): Promise<Network[]> {
        let data1 = await useFetch<Network[]>('http://localhost:8000/neuralnetwork/?format=json');

        let existingNetworks: Network[] = [];

        if (data1.data.value) {
            existingNetworks = data1.data.value;
            existingNetworks = existingNetworks.filter(network => network.cortex === props.cortex.id);
        }

        return existingNetworks;
    }

    async function getLinks(): Promise<Link[]> {
        let data1 = await useFetch<Link[]>('http://localhost:8000/link/?format=json');

        let existingLinks: Link[] = [];

        if (data1.data.value) {
            existingLinks = data1.data.value;
            existingLinks = existingLinks.filter(link => link.cortex === props.cortex.id);
        }

        return existingLinks;
    }

    const canvas = new Canvas();

    const menuItems: Record<string, string[]> = {

        onVoid: ['menu-item-add'],
        onNeuralNetwork: ['menu-item-edit-NN', 'menu-item-delete-NN'],
        onLink: ['menu-item-delete-link'],
    };

    let showAddNetworkPopup = ref(false);

    let openAddNetworkPopup: () => void;

    const closeAddNetworkPopup: () => void = () => {
        showAddNetworkPopup.value = false;
    };

    let addNetwork: (network : Network) => void;
    let deleteNetwork: () => void;
    let deleteLink: () => void;
    let editNetwork: () => void;

    const closeContextMenu = () => {
            const contextMenu = document.getElementById('context-menu');
            if (contextMenu) {
                contextMenu.style.display = 'none';

                // Remove event listeners
                const addNetworkHtml = document.getElementById('menu-item-add');
                if (addNetworkHtml) {
                    addNetworkHtml.removeEventListener('click', openAddNetworkPopup);
                }
                const deleteNetworkHtml = document.getElementById('menu-item-delete-NN');
                if (deleteNetworkHtml) {
                    deleteNetworkHtml.removeEventListener('click', deleteNetwork);
                }
                const deleteLinkHtml = document.getElementById('menu-item-delete-link');
                if (deleteLinkHtml) {
                    deleteLinkHtml.removeEventListener('click', deleteLink);
                }
                const editNetworkHtml = document.getElementById('menu-item-edit-NN');
                if (editNetworkHtml) {
                    editNetworkHtml.removeEventListener('click', editNetwork);
                }
                // Repeat this pattern for other context menu items you've added event listeners to.
            }
        };
    
    onMounted(async () => {        

        paper.setup(document.getElementById('canvas') as HTMLCanvasElement);

        const existingNetworks = await getNetworks();

        existingNetworks.forEach(network => {

            if (network.id){
                canvas.graphicalNeuralNetworks.push(
                            new GraphicalNeuralNetwork(
                                network.id,
                                network.x, 
                                network.y,
                                100,
                                100,
                                '#525B76',
                                network.name,
                                false,
                                false,
                                canvas
                            )
                        );
            }
        });

        const existingLinks = await getLinks();

        existingLinks.forEach(link => {
            console.log(link)
            console.log(canvas.graphicalNeuralNetworks);
            let fromNetwork = canvas.graphicalNeuralNetworks.find(network => network.id === link.from_network);
            let toNetwork = canvas.graphicalNeuralNetworks.find(network => network.id === link.to_network);
            console.log(fromNetwork);
            console.log(toNetwork)
                if (fromNetwork && toNetwork) {
                    canvas.graphicalLinks.push(
                                    new GraphicalLink(
                                        fromNetwork,
                                        toNetwork
                                    )
                                );
                }
        });

        //Allow to have the position of the mouse in the canvas at any time

        let pointerInCanvas: paper.Point;

        const canvasHtml = document.getElementById('canvas');
        
        function onMouseMove(mouseMoveEvent: paper.MouseEvent) {
            pointerInCanvas = mouseMoveEvent.point;
        }

        paper.view.onMouseMove = onMouseMove;

        window.addEventListener('click', closeContextMenu);

        if (canvasHtml) {

            canvasHtml.addEventListener('contextmenu', (event) => {
                event.preventDefault();

                const scrollX = window.scrollX || window.pageXOffset;
                const scrollY = window.scrollY || window.pageYOffset;

                //Client x and y are not the same as paper.js canvas x and y
                const x = event.clientX + scrollX;
                const y = event.clientY + scrollY;    

                //Detect if right click was on a neural network
                let neuralNetworkClicked: GraphicalNeuralNetwork | null = null;

                canvas.graphicalNeuralNetworks.forEach(neuralNetwork => {
                    if (neuralNetwork.rectangle.contains(pointerInCanvas)) {
                        neuralNetworkClicked = neuralNetwork;
                    }
                });

                let linkClicked: GraphicalLink | null = null;

                //Detect if right click was on a link

                canvas.graphicalLinks.forEach(link => {
                    if (link.segment) {
                        if (link.segment.bounds.contains(pointerInCanvas)) {
                            linkClicked = link;
                        }
                    }
                });

                console.log(linkClicked);
                // Display context menu at the right position


                const contextMenuPoint = new paper.Point(pointerInCanvas);

                const contextMenu = document.getElementById('context-menu');

                if (contextMenu) {

                    contextMenu.style.left = x + 'px';
                    contextMenu.style.top = y + 'px';
                    contextMenu.style.display = 'block';

                    // Get all the context menu items and hide them in order to only display the ones we want
                    const allMenuItems = document.querySelectorAll('.menu-item');
                        allMenuItems.forEach((item) => ((item as HTMLElement).style.display = 'none'));
                }

                //Depending on what is clicked on, we display only certain items

                let itemsToShow:string[];

                if (neuralNetworkClicked && neuralNetworkClicked != null) {
                    itemsToShow = menuItems['onNeuralNetwork'];
                }
                else if(linkClicked && linkClicked != null){
                    itemsToShow = menuItems['onLink'];
                }
                else {
                    itemsToShow = menuItems['onVoid'];
                }
                
                itemsToShow.forEach((item) => {
                    const menuItem = document.getElementById(item);
                    if (menuItem) {
                        (menuItem as HTMLElement).style.display = 'block'; // Cast to HTMLElement
                    }
                });

                // CONTEXT MENU : ADD NEW NETWORK BEHAVIOR //

                openAddNetworkPopup = () => {
                    if (contextMenu && contextMenu.style.display === 'block') {
                        showAddNetworkPopup.value = true;
                    }
                    closeContextMenu();
                }
                        

                const addNetworkHtml = document.getElementById('menu-item-add');
                    if (addNetworkHtml) {
                        addNetworkHtml.addEventListener('click', openAddNetworkPopup);
                }

                addNetwork = (network: Network) => {

                    let networkId: number = 0;
                    let networkName: string = '';

                    if(network.id && network.name){
                        networkId = network.id;
                        networkName = network.name;
                    }

                    canvas.graphicalNeuralNetworks.push(
                        new GraphicalNeuralNetwork(
                            networkId,
                            contextMenuPoint.x, 
                            contextMenuPoint.y, 
                            100,
                            100,
                            '#525B76',
                            networkName,
                            false,
                            false,
                            canvas
                        )
                    );
                }

                // CONTEXT MENU : EDIT NETWORK BEHAVIOR //

                editNetwork = () => {
                    if (contextMenu && contextMenu.style.display == 'block' && neuralNetworkClicked != null){
                        window.location.href = location.origin + '/neural-networks/' + neuralNetworkClicked.id;
                        closeContextMenu();
                    }
                }

                const editNetworkHtml = document.getElementById('menu-item-edit-NN');
                if(editNetworkHtml) {
                    editNetworkHtml.addEventListener('click', editNetwork);
                }
                
                // CONTEXT MENU : DELETE NETWORK BEHAVIOR //

                deleteNetwork = () => {
                    if (contextMenu && contextMenu.style.display == 'block' && neuralNetworkClicked != null){
                        canvas.deleteNetwork(neuralNetworkClicked)
                        closeContextMenu();
                    }
                }

                const deleteNetworkHtml = document.getElementById('menu-item-delete-NN');
                if(deleteNetworkHtml) {
                    deleteNetworkHtml.addEventListener('click', deleteNetwork);
                }

                // CONTEXT MENU : DELETE LINK BEHAVIOR //

                deleteLink = () => {
                    if (contextMenu && contextMenu.style.display == 'block' && linkClicked != null){
                        canvas.deleteLink(linkClicked)
                        closeContextMenu();
                    }
                }
                
                const deleteLinkHtml = document.getElementById('menu-item-delete-link');
                if(deleteLinkHtml) {
                    deleteLinkHtml.addEventListener('click', deleteLink);
                }
            })
            ;
        }
        //TODO : display existing neural network
        
    });

    onBeforeUnmount(() => {
        window.removeEventListener('click', closeContextMenu);
    });
</script>
<style scoped>
    .context-menu {
        background-color: #fff;
        border: 1px solid #ccc;
        width: 150px;
        position: absolute;
        z-index: 100;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
    }

    .menu-item {
        padding: 10px;
        cursor: pointer;
        transition: background-color 0.2s;
        color: black;
    }

    .menu-item:hover {
        background-color: #f0f0f0;
    }     

</style>