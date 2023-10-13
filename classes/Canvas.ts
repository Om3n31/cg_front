import * as paper from "paper";
import {GraphicalNeuralNetwork} from '../classes/GraphicalNeuralNetwork';
import {GraphicalLink} from '../classes/GraphicalLink';


export class Canvas {

    public paper = paper;
    public graphicalNeuralNetworks: GraphicalNeuralNetwork[];

    constructor(graphicalNeuralNetworks: GraphicalNeuralNetwork[]) {
        this.graphicalNeuralNetworks = graphicalNeuralNetworks;
    }

}
