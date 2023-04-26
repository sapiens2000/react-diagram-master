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

    onlineTransIsol = {
        idx : 0,
        acct_desc : '',
        acct_type : '',
        balance : 0,
        device_info : '',
        hhmissff : '',
        in_pay_acc : '',
        in_pay_bcd : '',
        in_pay_name : '',
        inpt_dttm : '',
        out_pay_acc : '',
        out_pay_bcd : '',
        out_pay_name : '',
        tot_amt : 0,
        user_id : '',
        user_no : 0,
        user_type : '',
        yyyymmdd : ''
    }    

    constructor(readonly engine: CanvasEngine) {
        super({ type: "save" });
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

    refresh() {
        this.getNumber(this.inPort);
    }
}

export default SaveNode;
