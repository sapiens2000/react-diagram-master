import {CanvasEngine, DeserializeEvent} from "@projectstorm/react-canvas-core";
import {
    DefaultPortModel,
    NodeModel,
    NodeModelGenerics,
} from "@projectstorm/react-diagrams";
import {SelectNode, FlowAttr} from "./SelectNode";

export interface Field {
	[key: string] : any;
}

export class FilterNode extends NodeModel<NodeModelGenerics> {
	filteredData = [{}];
	dataSet = {
		value : [''],
		op : '',
		cond : '',
	}

	progWorkFlowMng = {
		"flowId" : "2",
		"progId" : 19,
		"flowSeq" : 0,
		"flowType" : "",
		"flowAttr" : "",
		"flowDesc" : "",
		"crtdDttm" : "",
		"updtDttm" : ""
	}
	fieldStates: Field | null = null;

	selectFlowAttrInfo: FlowAttr | null = null;

	outPort = new DefaultPortModel(false, "result");
	inPort = new DefaultPortModel(true, "in");

	constructor(readonly engine: CanvasEngine) {
		super({ type: "filter-node" });
		this.addPort(this.outPort);

		this.addPort(this.inPort);
		this.inPort.setMaximumLinks(1);
	}

	serialize() {
		return {
			...super.serialize(),
			fieldStates : this.fieldStates
		};
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.fieldStates = event.data.fieldStates;
	}

	getFlowAttr(port: DefaultPortModel): void {
		const link = Object.values(port.getLinks())[0];
		const node = link?.getSourcePort()?.getNode();

		if (node instanceof SelectNode) {
			console.log(node.getFlowAttr())
			this.setFlowAttr(node.getFlowAttr())
		}
	}

	setFlowAttr(newAttr: any) {
		this.selectFlowAttrInfo = newAttr;
	}

	setFieldState(newFieldState: any) {
		this.fieldStates = newFieldState;
	}

	refresh() {
		this.getFlowAttr(this.inPort);
	}
}

export default FilterNode;
