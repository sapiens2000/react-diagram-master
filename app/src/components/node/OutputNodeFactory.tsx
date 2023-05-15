import * as React from "react";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import {OutputNodeModel} from "./OutputNodeModel";
import OutputNodeWidget from "./OutputNodeWidget";

class OutputNodeFactory extends AbstractReactFactory<
    OutputNodeModel,
    DiagramEngine
    > {
    constructor() {
        super("output");
    }

    generateReactWidget(event: any) {
        return <OutputNodeWidget node={event.model} engine={this.engine} />;
    }

    generateModel(event: any) {
        return new OutputNodeModel(this.engine);
    }

    
}

export default OutputNodeFactory;
