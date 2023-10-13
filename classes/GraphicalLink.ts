import * as paper from "paper";
import {GraphicalNeuralNetwork} from '../classes/GraphicalNeuralNetwork';


export class GraphicalLink {

    public fromNetwork: GraphicalNeuralNetwork;
    public toNetwork: GraphicalNeuralNetwork;
    public segment: paper.Path | null;

    constructor(fromNetwork: GraphicalNeuralNetwork, toNetwork: GraphicalNeuralNetwork) {

        this.fromNetwork = fromNetwork;
        this.toNetwork = toNetwork;
        this.segment = new paper.Path();
        this.segment.strokeWidth = 6;
        this.segment.strokeColor = new paper.Color('#C4F1BE');


        if (this.fromNetwork.rightHook)
            this.segment.add(this.fromNetwork.rightHook.bounds.center);

        if (this.toNetwork.leftHook)
            this.segment.add(this.toNetwork.leftHook.bounds.center);

        this.segment.visible = true;
        this.segment.smooth();
    }
  }