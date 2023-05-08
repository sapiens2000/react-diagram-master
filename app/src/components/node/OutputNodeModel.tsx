import { CanvasEngine } from "@projectstorm/react-canvas-core";
import {
    DefaultPortModel,
    NodeModel,
    NodeModelGenerics,
} from "@projectstorm/react-diagrams";
import {FilterNode} from "./FilterNode";

export class SaveNode extends NodeModel<NodeModelGenerics> {
    dataSet = {
        value : ['']
    }

    inPort = new DefaultPortModel(true, "in");

    prog_work_Flow = {
        flow_id : 0,
        //tmp
        prog_id : 19,
        flow_seq : 0,
        flow_type : "",
        flow_attr : {
        },
        flow_desc : "",
        crtd_dttm : "",
        updt_dttm : "",
    }   

    constructor(readonly engine: CanvasEngine) {
        super({ type: "output" });
        this.addPort(this.inPort);
        this.inPort.setMaximumLinks(1);
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

export default SaveNode;