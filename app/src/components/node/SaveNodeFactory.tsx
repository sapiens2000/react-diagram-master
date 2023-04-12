import * as React from "react";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import {SaveNode} from "./SaveNodeModel";
import SaveNodeWidget from "./SaveNodeWidget";

class SaveNodeFactory extends AbstractReactFactory<
    SaveNode,
    DiagramEngine
    > {
    constructor() {
        super("save");
    }

    generateReactWidget(event: any) {
        return <SaveNodeWidget node={event.model} engine={this.engine} />;
    }

    generateModel(event: any) {
        return new SaveNode(this.engine);
    }
}

export default SaveNodeFactory;
