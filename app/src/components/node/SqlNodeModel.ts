import { CanvasEngine } from "@projectstorm/react-canvas-core";
import {
    NodeModel,
    NodeModelGenerics,
} from "@projectstorm/react-diagrams";
import { ArrowPortModel } from "../link/ArrowLinkModel";

export class SqlNodeModel extends NodeModel<NodeModelGenerics>{
    sql: string;

    dataSet = {
        table : '',
        column : '',
        value : [''],
    }

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

    prog_work_Flow_mng = {
        flow_id : 0,
        prog_id : 0,
        flow_seq : 0,
        flow_type : "",
        flow_attr : {
            sql : '',
            column_info : [''],
            db_info : 'PostgreSQL',
            output : [-1],
        },
        flow_desc : "",
        crtd_dttm : "",
        updt_dttm : "",
    }
    
    outPort = new ArrowPortModel(false, "out");

    constructor(readonly engine: CanvasEngine) {
        super({ type: "sql" });
        this.addPort(this.outPort);
    }

    setValue(value: string[]) {
        this.dataSet.value = [...value];
        this.engine.repaintCanvas();
        
    }

    serialize() {
        // console.log(this.s_value)
        return {
            ...super.serialize(),
            value: this.dataSet.value
        };
    }
}

export default SqlNodeModel;