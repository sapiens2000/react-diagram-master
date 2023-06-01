import * as React from "react";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import {FilterNodeModel} from "./FilterNodeModel";
import FilterNodeWidget from "./FilterNodeWidget";

class FilterNodeFactory extends AbstractReactFactory<
    FilterNodeModel,
    DiagramEngine
    > {
    constructor() {
        super("filter-node");
    }

    generateReactWidget(event: any) {
        return <FilterNodeWidget node={event.model} engine={this.engine} />;
    }

    generateModel(event: any) {
        return new FilterNodeModel(this.engine);
    }
}

export default FilterNodeFactory;
