import * as React from "react";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import {SaveNode} from "./OutputNodeModel";
import SaveNodeWidget from "./OutputNodeWidget";

class SaveNodeFactory extends AbstractReactFactory<
    SaveNode,
    DiagramEngine
    > {
    constructor() {
        super("output");
    }

    generateReactWidget(event: any) {
        return <SaveNodeWidget node={event.model} engine={this.engine} />;
    }

    generateModel(event: any) {
        return new SaveNode(this.engine);
    }

    
}

export default SaveNodeFactory;
