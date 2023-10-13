<template>
    <Transition>
        <AddNetworkToEditorPopup v-show="showAddNetworkPopup" @addNetwork="addNetwork" @close="closeAddNetworkPopup"></AddNetworkToEditorPopup>
    </Transition>    
    <div>
      <canvas id="canvas" class="border-2 border-white rounded-lg w-full"></canvas>
    </div>
    
    <div id="context-menu" style="position: absolute; display: none; background-color: #fff;">

        <div class="menu-item" id="menu-item-add">Add new neural network</div>
        <div class="menu-item" id="menu-item-edit-NN">Edit neural network</div>
        <div class="menu-item" id="menu-item-delete-NN">Delete neural network</div>
        <div class="menu-item" id="menu-item-delete-link">Delete link</div>


    </div>
    
</template>

<script setup lang="ts">

    import {GraphicalLink} from "../classes/GraphicalLink"
    import {GraphicalNeuralNetwork} from "../classes/GraphicalNeuralNetwork"
    import {Canvas} from "../classes/Canvas"
    import * as paper from "paper";
    import {Network} from "../interfaces/NetworkInterfaces"
    
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
    


    const closeContextMenu = () => {
            const contextMenu = document.getElementById('context-menu');
            if (contextMenu) {
                contextMenu.style.display = 'none';

                // Remove event listeners
                const addNetworkHtml = document.getElementById('menu-item-add');
                if (addNetworkHtml) {
                    addNetworkHtml.removeEventListener('click', openAddNetworkPopupddNetwork);
                }
                const deleteNetworkHtml = document.getElementById('menu-item-delete-NN');
                if (deleteNetworkHtml) {
                    deleteNetworkHtml.removeEventListener('click', deleteNetwork);
                }
                const deleteLinkHtml = document.getElementById('menu-item-delete-link');
                if (deleteLinkHtml) {
                    deleteLinkHtml.removeEventListener('click', deleteLink);
                }
                // Repeat this pattern for other context menu items you've added event listeners to.
            }
        };
    
    onMounted(() => {        

        paper.setup(document.getElementById('canvas') as HTMLCanvasElement);

        const canvasHtml = document.getElementById('canvas');
        
        //Allow to have the position of the mouse in the canvas at any time

        let pointerInCanvas: paper.Point;

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
                        /*const networkCounter = canvas.graphicalNeuralNetworks.length;
                        canvas.graphicalNeuralNetworks.push(
                            new GraphicalNeuralNetwork(
                                networkCounter,
                                pointerInCanvas.x, 
                                pointerInCanvas.y, 
                                100,
                                100,
                                '#525B76',
                                'Network ' + networkCounter,
                                false,
                                false,
                                canvas
                            )
                        );
                        */
                        
                
                };

                const addNetworkHtml = document.getElementById('menu-item-add');
                    if (addNetworkHtml) {
                        addNetworkHtml.addEventListener('click', addNetwork);
                }

                // CONTEXT MENU : EDIT NETWORK BEHAVIOR //
                
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
            });
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