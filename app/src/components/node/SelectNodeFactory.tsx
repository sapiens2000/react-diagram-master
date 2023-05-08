import * as React from "react";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import SelectWidgetModal from "./SelectNodeWidget";
import SelectNodeModel from "./SelectNodeModel";

class SelectNodeFactory extends AbstractReactFactory<
    SelectNodeModel,
    DiagramEngine
    > {
    constructor() {
        super("select");
    }

    generateReactWidget(event: any) {
        // return <SelectNodeWidgetAdvanced engine={this.engine} node={event.model} />;
        // return <SelectNodeWidgetAdvanced node={event.model} engine={this.engine} />;
        return <SelectWidgetModal node={event.model} engine={this.engine} />;
    }

    generateModel(event: any) {
        return new SelectNodeModel(this.engine);
    }
}

export default SelectNodeFactory;
