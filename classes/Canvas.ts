import * as paper from "paper";
import {GraphicalNeuralNetwork} from '../classes/GraphicalNeuralNetwork';
import {GraphicalLink} from '../classes/GraphicalLink';


export class Canvas {

    public paper = paper;
    public graphicalNeuralNetworks: GraphicalNeuralNetwork[];
    public graphicalLinks: GraphicalLink[];

    constructor() {
        this.graphicalNeuralNetworks = [];
        this.graphicalLinks = [];
    }

    public deleteNetwork(neuralNetwork: GraphicalNeuralNetwork): void {
        
        const index = this.graphicalNeuralNetworks.indexOf(neuralNetwork);

        // remove the neural network from canvas -> implies to remove all the links
        if (index > -1) {
            neuralNetwork.remove();
            this.deleteLinksOfNeuralNetwork(neuralNetwork)
            this.graphicalNeuralNetworks.splice(index, 1); // Remove one item at the found index
            console.log('Item removed from the array.');
        } else {
            console.log('Item not found in the array.');
        }
    }

    public deleteLinksOfNeuralNetwork(neuralNetwork: GraphicalNeuralNetwork): void {

        for (let i = this.graphicalLinks.length - 1; i >= 0; i--) {
            const link = this.graphicalLinks[i];
            if (link.toNetwork === neuralNetwork || link.fromNetwork === neuralNetwork) {
                link.segment?.remove();
                this.graphicalLinks.splice(i, 1);
            }
        }
    }

    public deleteLink(link : GraphicalLink): void{
        const index = this.graphicalLinks.indexOf(link);
        if (index > -1) {
            link.segment?.remove();
            this.graphicalLinks.splice(index, 1);
            console.log('Item removed from the array.');
        } else {
            console.log('Item not found in the array.');
        }
    }

}
