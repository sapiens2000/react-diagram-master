import * as React from "react";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import {FilterNode} from "./FilterNode";
import FilterNodeWidget from "./FilterNodeWidget";

class FilterNodeFactory extends AbstractReactFactory<
    FilterNode,
    DiagramEngine
    > {
    constructor() {
        super("filter");
    }

    generateReactWidget(event: any) {
        return <FilterNodeWidget node={event.model} engine={this.engine} />;
    }

    generateModel(event: any) {
        return new FilterNode(this.engine);
    }
}

export default FilterNodeFactory;
