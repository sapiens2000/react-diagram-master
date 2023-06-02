import {CanvasEngine, DeserializeEvent} from "@projectstorm/react-canvas-core";
import {
	DefaultPortModel,
	NodeModel,
	NodeModelGenerics,
} from "@projectstorm/react-diagrams";
import { ProjectDiagramModel } from "../model/ProjectDiagramModel";
import axios, { AxiosResponse } from "axios";
import App from '../../App';

export interface FlowAttr {
	"sql" : string,
	"col" : string[]
}

export class SelectNodeModel extends NodeModel<NodeModelGenerics>{
	dataSet = {
		table : '',
		column : '',
		value : [''],
	}

	progWorkFlowMng: {
        flowId: number;
        progId: number;
        flowSeq: number;
        flowType: string;
        flowAttr: {};
        crtdDttm: string;
        updtDttm: string;
    };

	flowAttrInfo: FlowAttr = {
		"sql" : "",
		"col" : ['']
	}

	outPort = new DefaultPortModel(false, "out");

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
		super({ type: "select-node" });
		this.addPort(this.outPort);

		this.progWorkFlowMng = {
            flowId : -1,
            //tmp
            progId : -1,
            flowSeq : 1,
            flowType : "select",
            flowAttr : {

            },
            crtdDttm : "",
            updtDttm : "",
        }

    const model = engine.getModel()
    if (model instanceof ProjectDiagramModel){
       const progMst = model.getProgMst();
       this.progWorkFlowMng.progId = progMst.progId;
    } else{
            console.log('Invalid model type');
		}

		console.log(this.progWorkFlowMng.progId);

		// 불러오기를 실행했을 때 Deserialize 내용을 아래의 respose.data가 덮어써서 새로운 flowId를 할당하는 버그가 있음
		// 이를 위해 프로젝트를 불러왔는지를 체크하여 생성하고자 메소드 init()으로 분러함
		// if(this.progWorkFlowMng.flowId == -1) {
		// 	axios.post(`/diagram/project/save-node/${this.progWorkFlowMng.progId}`, this.progWorkFlowMng, {maxRedirects: 0})
		// 		.catch((error: any) => {
		// 			console.log(error);
		// 		}).then((response: AxiosResponse<string> | void) => {
		// 		if (response) {
		// 			this.progWorkFlowMng.flowId = parseInt(response.data);
		// 		}
		// 	});
		// }
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
			flowAttrInfo: this.flowAttrInfo,
			progWorkFlowMng: this.progWorkFlowMng
		};
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.flowAttrInfo = event.data.flowAttrInfo;
		this.progWorkFlowMng = event.data.progWorkFlowMng;
	}
}

export default SelectNodeModel;