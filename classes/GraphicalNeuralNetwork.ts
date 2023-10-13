import * as paper from "paper";
import {GraphicalLink} from '../classes/GraphicalLink';
import {Canvas} from '../classes/Canvas';


export class GraphicalNeuralNetwork {

    public id: number
    public rectangle: paper.Rectangle;
    public path: paper.Path.Rectangle;
    public startPoint: paper.Point;
    public size: paper.Size;
    public color: paper.Color;
    public isFirst: boolean;
    public isLast: boolean;
    public leftHook: paper.Path.Circle | null;
    public rightHook: paper.Path.Circle | null;
    public links: GraphicalLink[];
    public inputs: number;
    public outputs: number;
    public isDragging: boolean = false;
    public dragOffset: paper.Point | null = null;
    public isLinking: boolean = false
    public linkingSegment: paper.Path | null = null;
    public currentPosition: paper.Point;
    public canvas: Canvas;
    public text: paper.PointText;
    

    constructor(id: number, startPointX: number, startPointY: number, width: number, height: number, color: string, text: string, isFirst: boolean, isLast: boolean, canvas: Canvas) {

        this.canvas = canvas;

        this.id = id;
        this.startPoint = new paper.Point(startPointX, startPointY);
        this.size = new paper.Size(width, height);
        this.color = new paper.Color(color);

        this.rectangle = new paper.Rectangle(this.startPoint, this.size);
        this.path = new paper.Path.Rectangle({
                            point: this.startPoint, 
                            size: this.size,
                            radius: 20,       
                            fillColor: this.color,
                            strokeColor: '#C4F1BE',
                            strokeWidth: 2
                        });

        this.currentPosition = this.path.position;
        
        let textPosition = new paper.Point(this.path.bounds.center.x - 25, this.path.bounds.center.y)
        this.text =new paper.PointText({
                            point: textPosition,  // Position of the text within the rectangle
                            content: text, // Text content
                            fillColor: 'white', // Text color
                            fontSize: 12        // Font size (optional)
                        });

        this.isFirst = isFirst;
        this.isLast = isLast;

        this.rightHook = new paper.Path.Circle(this.path.bounds.rightCenter, 7);
        this.rightHook.fillColor = new paper.Color('white');

        this.leftHook = new paper.Path.Circle(this.path.bounds.leftCenter, 7);
        this.leftHook.fillColor = new paper.Color('white');

        this.links = [];

        this.inputs = 1;
        this.outputs = 1;
        
        this.linkingSegment = new paper.Path();
        this.linkingSegment.strokeColor = new paper.Color('#525B76');
        this.linkingSegment.strokeWidth = 6;
        
        this.path.onMouseDown = (event: any) => this.startDragging(event);
        this.path.onMouseUp = () => this.stopDragging();
        this.path.onMouseDrag = (event: any) => this.handleDrag(event);

        this.text.onMouseDown = (event: any) => this.startDragging(event);
        this.text.onMouseUp = () => this.stopDragging();
        this.text.onMouseDrag = (event: any) => this.handleDrag(event);

        this.rightHook.onMouseDown = (event: any) => this.startLinking(event);
        this.rightHook.onMouseUp = (event: any) => this.stopLinking(event);
        this.rightHook.onMouseDrag = (event: any) => this.handleLink(event);



        if(this.isFirst) {
            this.leftHook.remove();
        }

        if (this.isLast) {
            this.rightHook.remove();
        }

    }

    public startLinking(event: any): void {
        this.isLinking = true;
        this.linkingSegment = new paper.Path();
        this.linkingSegment.strokeColor = new paper.Color('#525B76');
        this.linkingSegment.strokeWidth = 3;
        this.linkingSegment.add(this.rightHook!.bounds.center);
        this.linkingSegment.add(this.rightHook!.bounds.center);
    }

    public stopLinking(event: any): void {

        if (this.isLinking && this.linkingSegment ) {

            let endLink = this.checkPointInLeftHook(event.point);
            let linkAlreadyExists: boolean = false;

            if (endLink.check == true) {
                
                let segment = new paper.Path();
                segment.strokeColor = new paper.Color('#525B76');
                segment.strokeWidth = 2;
                segment.add(this.rightHook!.bounds.center);
                segment.add(event.point);
                segment.remove();
                this.linkingSegment.remove();

                this.canvas.graphicalLinks.forEach(link => {
                    if ( link.fromNetwork === this && link.toNetwork === endLink.neuralNetwork) {
                        linkAlreadyExists = true;
                    }
                });

                if(!linkAlreadyExists) {
                    let graphicalLink = new GraphicalLink(this, endLink.neuralNetwork);
                    this.canvas.graphicalLinks.push(graphicalLink);
                }
            } else {

                this.linkingSegment.remove();
                this.isLinking = false;
            }
            
        }
    }
    
    public checkPointInLeftHook(point: paper.Point): any {

        let bool = false;
        let hookedNeuralNetwork: GraphicalNeuralNetwork | null = null;

        this.canvas.graphicalNeuralNetworks.forEach(neuralNetwork => {

            if (neuralNetwork.leftHook?.contains(point)){
                bool = true;
                hookedNeuralNetwork = neuralNetwork;
            }
        });

        return {check: bool, neuralNetwork : hookedNeuralNetwork }
    }
    
    public handleLink(event: any): void {
        if (this.isLinking && this.linkingSegment) {
            this.linkingSegment.segments[1].point = event.point;
        }
    }
  

    public startDragging(event: any): void {

        this.isDragging = true;
        this.dragOffset = this.path.position.subtract(event.point);
        this.color.alpha = 0.5;
        this.path.fillColor = this.color;
    }

    public stopDragging(): void {

        this.isDragging = false;
        this.dragOffset = null;
        this.color.alpha = 1;
        this.path.fillColor = this.color;
    }

    public handleDrag(event: any): void {

        if (this.isDragging && this.dragOffset) {

            this.path.position = event.point.add(this.dragOffset);

            this.rectangle = new paper.Rectangle(this.path.bounds.topLeft, this.size);

            let textPosition = new paper.Point(this.path.bounds.center.x, this.path.bounds.center.y);

            this.text.position = textPosition;

            if (this.rightHook) {
                this.rightHook.position = this.path.bounds.rightCenter;
            }
            if (this.leftHook) {
                this.leftHook.position = this.path.bounds.leftCenter;
            }
            if (this.canvas.graphicalLinks && this.canvas.graphicalLinks.length != 0) {
                this.canvas.graphicalLinks.forEach(graphicalLink => {
                    if (graphicalLink.fromNetwork == this && graphicalLink.segment) {
                        graphicalLink.segment.segments[0].point = new paper.Point(this.path.bounds.rightCenter);
                    }
                    if (graphicalLink.toNetwork == this && graphicalLink.segment) {
                        graphicalLink.segment.segments[1].point = new paper.Point(graphicalLink.toNetwork.path.bounds.leftCenter);
                    }
                });
            }
        }
    }

    public remove(): void {
        this.path.remove();
        this.leftHook?.remove();
        this.rightHook?.remove();
        this.text.remove();
    }
  }