import { CanvasEngine } from "@projectstorm/react-canvas-core";
import {
    DefaultPortModel,
    DiagramEngine,
    DiagramModel,
    NodeModel,
    NodeModelGenerics,
} from "@projectstorm/react-diagrams";
import {FilterNode} from "./FilterNode";
import { ProjectDiagramModel } from "../model/ProjectDiagramModel";
import axios from "axios";

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
        flowDesc: string;
        crtdDttm: string;
        updtDttm: string;
    };

    constructor(readonly engine: DiagramEngine) {
        super({ type: "output" });
        this.addPort(this.inPort);
        this.progWorkFlowMng = {
            flowId : 3,
            //tmp
            progId : -1,
            flowSeq : -1,
            flowType : "output",
            flowAttr : {
            },
            flowDesc : "",
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

        axios.post("/diagram/project/savenode/" + this.progWorkFlowMng.progId, this.progWorkFlowMng, { maxRedirects: 0})
        .catch((Error) => {
          console.log(Error);
        }).then(response => {
          console.log(response);
        });
    }

    serialize() {
        return {
            ...super.serialize(),
            value: this.dataSet.value
        };
    }

    getNumber(port: DefaultPortModel): void {
        const link = Object.values(port.getLinks())[0];
        const node = link?.getSourcePort()?.getNode();

        if (node instanceof FilterNode) {
            console.log(node.dataSet.value)
            this.setValue(node.dataSet.value)
        }
    }

    setValue(value: string[]) {
        this.dataSet.value = [...value];
    }

}

export default OutputNodeModel;
