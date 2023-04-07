import * as React from "react";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import SelectNodeModel from "./SelectNodeModel";
import SelectNodeWidget from "./SelectNodeWidget";


class SelectNodeFactory extends AbstractReactFactory<
    SelectNodeModel,
    DiagramEngine
    > {
    constructor() {
        super("select-node");
    }

    generateReactWidget(event: any) {
        return <SelectNodeWidget node={event.model} engine={this.engine} />;
    }

    generateModel(event: any) {
        return new SelectNodeModel(this.engine);
    }
}

export default SelectNodeFactory;
