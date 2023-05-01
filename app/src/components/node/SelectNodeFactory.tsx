import * as React from "react";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import {SelectNode} from "./SelectNode";
import SelectWidgetModal from "./SelectWidget";

class SelectNodeFactory extends AbstractReactFactory<
    SelectNode,
    DiagramEngine
    > {
    constructor() {
        super("select-node");
    }

    generateReactWidget(event: any) {
        // return <SelectNodeWidgetAdvanced engine={this.engine} node={event.model} />;
        // return <SelectNodeWidgetAdvanced node={event.model} engine={this.engine} />;
        return <SelectWidgetModal node={event.model} engine={this.engine} />;
    }

    generateModel(event: any) {
        return new SelectNode(this.engine);
    }
}

export default SelectNodeFactory;
