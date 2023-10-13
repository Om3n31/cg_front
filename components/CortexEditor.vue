<template>

    <div>
        <button @click="addNetwork">Add network</button>
    </div>

    <div>
      <canvas id="canvas" class="border-2 border-white rounded-lg w-full"></canvas>
    </div>

</template>
  
<script setup lang="ts">

    import {GraphicalNeuralNetwork} from "../classes/GraphicalNeuralNetwork"
    import {Canvas} from "../classes/Canvas"
    import * as paper from "paper";

    const neuralNetworks: GraphicalNeuralNetwork[] = [];
    const canvas = new Canvas(neuralNetworks);

    const addNetwork = () => {
        canvas.graphicalNeuralNetworks.push(new GraphicalNeuralNetwork(1, 50, 50, 100, 100, '#525B76', 'Network 1', false, false, canvas));
        console.log("Adding a network");
    };

    onMounted(() => {
        
        paper.setup(document.getElementById('canvas') as HTMLCanvasElement);

        //TODO : display existing neural networks

        let rectangle1 = new GraphicalNeuralNetwork(1, 50, 50, 100, 100, '#525B76', 'Network 1', false, false, canvas);

        let rectangle2 = new GraphicalNeuralNetwork(2, 200, 50, 100, 100, '#525B76', 'Network 2', false, false, canvas);
        
        canvas.graphicalNeuralNetworks.push(rectangle1);
        canvas.graphicalNeuralNetworks.push(rectangle2);

        // TODO create neural networks from scratch

        // Initialize variables to track segment and mouse position
        var mousePoint: paper.Point = new paper.Point(0, 0);
        var isDrawing: boolean = false;
        var isDragging: boolean = false;
        
        // Event handler for mouse down in the void

        paper.view.onClick = function (event: any) {
            if (isDrawing) {
                //Gérer les événements de click
                isDrawing = false;
            };
        };

        // Event handler for mouse move

        paper.view.onMouseMove = function (event: any) {
        mousePoint = event.point;
            if (isDrawing) {
                //Gérer les mouvements de souris
            }
        };
    });
</script>

