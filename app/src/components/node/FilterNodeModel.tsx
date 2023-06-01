import {CanvasEngine, DeserializeEvent} from "@projectstorm/react-canvas-core";
import {
    DefaultPortModel,
    NodeModel,
    NodeModelGenerics,
} from "@projectstorm/react-diagrams";
import {SelectNodeModel, FlowAttr} from "./SelectNodeModel";
import { ProjectDiagramModel } from "../model/ProjectDiagramModel";
import axios, { AxiosResponse } from "axios";

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
						console.log(model);
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
