import {CanvasEngine, DeserializeEvent} from "@projectstorm/react-canvas-core";
import {
	DefaultPortModel,
	NodeModel,
	NodeModelGenerics,
} from "@projectstorm/react-diagrams";

export interface FlowAttr {
	"sql" : string,
	"col" : string[]
}

export class SelectNode extends NodeModel<NodeModelGenerics>{
	dataSet = {
		table : '',
		column : '',
		value : [''],
	}

	progWorkFlowMng = {
		"flowId" : "1",
		"progId" : 19,
		"flowSeq" : 0,
		"flowType" : "",
		"flowAttr" : "",
		"flowDesc" : "",
		"crtdDttm" : "",
		"updtDttm" : ""
	}

	flowAttrInfo: FlowAttr = {
		"sql" : "",
		"col" : ['']
	}

	outPort = new DefaultPortModel(false, "out");

	constructor(readonly engine: CanvasEngine) {
		super({ type: "select-node" });
		this.addPort(this.outPort);
	}

	setFlowAttr(newAttr: FlowAttr) {
		this.flowAttrInfo = newAttr
		this.engine.repaintCanvas();
	}

	getFlowAttr(): FlowAttr {
		return this.flowAttrInfo;
	}

	// 저장 및 불러오기에 필요
	serialize() {
		return {
			...super.serialize(),
			flowAttrInfo: this.flowAttrInfo
		};
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.flowAttrInfo = event.data.flowAttrInfo;
	}
}

export default SelectNode;