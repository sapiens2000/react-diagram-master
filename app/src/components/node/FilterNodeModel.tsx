import {CanvasEngine, DeserializeEvent} from "@projectstorm/react-canvas-core";
import {
    DefaultPortModel,
    NodeModel,
    NodeModelGenerics,
} from "@projectstorm/react-diagrams";
import {SelectNodeModel, FlowAttr} from "./SelectNodeModel";
import { ProjectDiagramModel } from "../model/ProjectDiagramModel";
import axios, { AxiosResponse } from "axios";
import App from '../../App';

export interface Field {
	[key: string] : any;
}

export class FilterNodeModel extends NodeModel<NodeModelGenerics> {
	dataSet = {
		value : [''],
		op : '',
		cond : '',
	}

	progWorkFlowMng: {
        flowId: number;
        progId: number;
        flowSeq: number;
        flowType: string;
        flowAttr: {};
        crtdDttm: string;
        updtDttm: string;
		dltDttm: string;
    };

	fieldStates: Field | null = null;

	selectFlowAttrInfo: FlowAttr | null = null;

	outPort = new DefaultPortModel(false, "result");
	inPort = new DefaultPortModel(true, "in");

	private isLoadedCallback?: () => boolean;

	// Add a method to set the callback function.
	setIsLoadedCallback(callback: () => boolean) {
		this.isLoadedCallback = callback;
	}

	init() {
		if(this.isLoadedCallback && !this.isLoadedCallback()) {
			axios.post(`/diagram/project/save-node/${this.progWorkFlowMng.progId}`, this.progWorkFlowMng, {maxRedirects: 0})
				.catch((error: any) => {
					console.log(error);
				}).then((response: AxiosResponse<string> | void) => {
				if (response) {
					this.progWorkFlowMng.flowId = parseInt(response.data);
				}
			});
		}
	}

	constructor(readonly engine: CanvasEngine) {
		super({ type: "filter-node" });
		this.addPort(this.outPort);

		this.addPort(this.inPort);
		this.inPort.setMaximumLinks(1);

		this.progWorkFlowMng = {
            flowId : -1,
            //tmp
            progId : -1,
            flowSeq : -1,
            flowType : "filter",
            flowAttr : {

            },
            crtdDttm : "",
            updtDttm : "",
			dltDttm : ""
        }

        const model = engine.getModel()
        if (model instanceof ProjectDiagramModel){
            const progMst = model.getProgMst();
            this.progWorkFlowMng.progId = progMst.progId;
        } else{
            console.log('Invalid model type');
        }
				// 불러오기를 실행했을 때 Deserialize 내용을 아래의 respose.data가 덮어써서 새로운 flowId를 할당하는 버그가 있음
				// 이를 위해 프로젝트를 불러왔는지를 체크하여 생성하고자 메소드 init()으로 분러함
				// if(this.isLoadedCallback && !this.isLoadedCallback()) {
				// 	axios.post(`/diagram/project/save-node/${this.progWorkFlowMng.progId}`, this.progWorkFlowMng, {maxRedirects: 0})
				// 		.catch((error: any) => {
				// 			console.log(error);
				// 		}).then((response: AxiosResponse<string> | void) => {
				// 		if (response) {
				// 			this.progWorkFlowMng.flowId = parseInt(response.data);
				// 		}
				// 	});
				//
				// }
	}




	serialize() {
		return {
			...super.serialize(),
			fieldStates : this.fieldStates,
			progWorkFlowMng : this.progWorkFlowMng
		};
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		console.log('deserialize 실행' + event.data.progWorkFlowMng.flowId);
		this.fieldStates = event.data.fieldStates;
		this.progWorkFlowMng = event.data.progWorkFlowMng;
		console.log('flowId = ' + this.progWorkFlowMng.flowId);
	}

	getFlowAttr(port: DefaultPortModel): void {
		const link = Object.values(port.getLinks())[0];
		const node = link?.getSourcePort()?.getNode();

		if (node instanceof SelectNodeModel) {
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

export default FilterNodeModel;
