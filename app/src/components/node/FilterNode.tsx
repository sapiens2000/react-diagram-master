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
		"flowId" : "",
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

	// Data를 Filtering 할 때 정확한 Filtering을 위해선 각 테이블의 자료형도 가져올 필요가 있다.
	dummy = [
		{
			"LOG_DATE": "2023-04-25",
			"LOG_TIME": "15:30:00",
			"LOG_USER_ID": "user001",
			"LOG_PAY_ACC": 12345
		},
		{
			"LOG_DATE": "2023-04-24",
			"LOG_TIME": "14:25:00",
			"LOG_USER_ID": "user002",
			"LOG_PAY_ACC": 67890
		},
		{
			"LOG_DATE": "2023-04-23",
			"LOG_TIME": "10:15:00",
			"LOG_USER_ID": "user003",
			"LOG_PAY_ACC": 98765
		},
		{
			"LOG_DATE": "2023-04-22",
			"LOG_TIME": "11:45:00",
			"LOG_USER_ID": "user004",
			"LOG_PAY_ACC": 45678
		},
		{
			"LOG_DATE": "2023-04-21",
			"LOG_TIME": "16:30:00",
			"LOG_USER_ID": "user005",
			"LOG_PAY_ACC": 23456
		},
		{
			"LOG_DATE": "2023-04-20",
			"LOG_TIME": "12:10:00",
			"LOG_USER_ID": "user006",
			"LOG_PAY_ACC": 34567
		},
		{
			"LOG_DATE": "2023-04-19",
			"LOG_TIME": "09:30:00",
			"LOG_USER_ID": "user007",
			"LOG_PAY_ACC": 56789
		},
		{
			"LOG_DATE": "2023-04-18",
			"LOG_TIME": "17:15:00",
			"LOG_USER_ID": "user008",
			"LOG_PAY_ACC": 78901
		},
		{
			"LOG_DATE": "2023-04-17",
			"LOG_TIME": "13:50:00",
			"LOG_USER_ID": "user009",
			"LOG_PAY_ACC": 89123
		},
		{
			"LOG_DATE": "2023-04-16",
			"LOG_TIME": "18:20:00",
			"LOG_USER_ID": "user010",
			"LOG_PAY_ACC": 90123
		}
	]
}

export default FilterNode;
