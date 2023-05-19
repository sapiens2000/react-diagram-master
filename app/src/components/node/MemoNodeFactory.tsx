import * as React from "react";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import MemoNodeModel from "./MemoNodeModel";
import MemoNodeWidget from "./MemoNodeWidget";

class MemoNodeFactory extends AbstractReactFactory<
	MemoNodeModel,
	DiagramEngine
	> {
	constructor() {
		super("memo-node");
	}

	generateReactWidget(event: any) {
		// return <SelectNodeWidgetAdvanced engine={this.engine} node={event.model} />;
		// return <SelectNodeWidgetAdvanced node={event.model} engine={this.engine} />;
		return <MemoNodeWidget node={event.model} engine={this.engine} />;
	}

	generateModel(event: any) {
		return new MemoNodeModel(this.engine);
	}
}

export default MemoNodeFactory;
