import {
    DefaultPortModel,
    DiagramEngine,
    NodeModel,
    NodeModelGenerics,
} from "@projectstorm/react-diagrams";
import FilterNodeModel from "./FilterNodeModel";
import { ProjectDiagramModel } from "../model/ProjectDiagramModel";
import axios, { AxiosResponse } from "axios";
import {DeserializeEvent} from "@projectstorm/react-canvas-core";

export class OutputNodeModel extends NodeModel<NodeModelGenerics> {
    dataSet = {
        value : ['']
    }

    inPort = new DefaultPortModel(true, "in");
    progWorkFlowMng: {
        flowId: number;
        progId: number;
        flowSeq: number;
        flowType: string;
        flowAttr: {};
        crtdDttm: string;
        updtDttm: string;
    };

    constructor(readonly engine: DiagramEngine) {
        super({ type: "output" });
        this.addPort(this.inPort);
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

    serialize() {
        return {
            ...super.serialize(),
            value: this.dataSet.value,
						progWorkFlowMng: this.progWorkFlowMng
        };
    }

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.dataSet.value = event.data.value;
		this.progWorkFlowMng = event.data.progWorkFlowMng;
	}

    getNumber(port: DefaultPortModel): void {
        const link = Object.values(port.getLinks())[0];
        const node = link?.getSourcePort()?.getNode();

        if (node instanceof FilterNodeModel) {
            console.log(node.dataSet.value)
            this.setValue(node.dataSet.value)
        }
    }

    setValue(value: string[]) {
        this.dataSet.value = [...value];
    }

}

export default OutputNodeModel;
