import {CanvasEngine, DeserializeEvent} from "@projectstorm/react-canvas-core";
import {
	DefaultPortModel,
	NodeModel,
	NodeModelGenerics,
} from "@projectstorm/react-diagrams";
import { ProjectDiagramModel } from "../model/ProjectDiagramModel";
import axios, { AxiosResponse } from "axios";

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

	constructor(readonly engine: CanvasEngine) {
		super({ type: "select-node" });
		this.addPort(this.outPort);

		this.progWorkFlowMng = {
            flowId : -1,
            //tmp
            progId : -1,
            flowSeq : -1,
            flowType : "",
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

		axios.post(`/diagram/project/save-node/${this.progWorkFlowMng.progId}`, this.progWorkFlowMng, { maxRedirects: 0})
        .catch((error: any) => {
          console.log(error);
        }).then((response: AxiosResponse<string> | void) => {
            if (response) {
              this.progWorkFlowMng.flowId = parseInt(response.data);
            }
        });
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

export default SelectNodeModel;