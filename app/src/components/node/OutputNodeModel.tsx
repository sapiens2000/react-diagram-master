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
import SelectNodeModel, { FlowAttr } from "./SelectNodeModel";

// const GridrowsToColInfo = (Rows: RowField[]): { [key: string]: string | any[] } => {
//     const transformedData: { [key: string]: string | any[] } = {};
  
//     Rows.forEach((row: any) => {
//       const { tableFieldName, type, mappingField, defaultValue } = row;
//       transformedData[tableFieldName] = [type, mappingField, defaultValue];
//     });
  
//     return transformedData;
//   };

export interface RowField {
    id: number;
    tableFieldName: string;
    mappingField: string;
    defaultValue: string;
}

export class OutputNodeModel extends NodeModel<NodeModelGenerics> {
    dataSet: {
        column: string[]
    }

    inPort = new DefaultPortModel(true, "in");
    
    flowAttrInfo: {
		type: string,
        pk: [],
        tableName: string,
        col_info: {},
	}

    selectFlowAttrInfo: FlowAttr | null = null;

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

    selectFieldNames = ['user_id','out_pay_name','yyyymmdd'];

    progWorkFlowMng: {
        flowId: number;
        progId: number;
        flowSeq: number;
        flowType: string;
        // for dynamically add datas
        flowAttr: any;
        crtdDttm: string;
        updtDttm: string;
    };

    gridRows: any;

    constructor(readonly engine: DiagramEngine) {
        super({ type: "output" });
        this.addPort(this.inPort);

        this.progWorkFlowMng = {
            flowId : -1,
            progId : -1,
            flowSeq : -1,
            flowType : "",
            flowAttr : {
                type: 'insert',
                pk: [],
                tableName: '',
                col_info: []
            },
            crtdDttm : "",
            updtDttm : "",
        }

        this.gridRows = []

        const model = engine.getModel()

        if (model instanceof ProjectDiagramModel){
            this.progWorkFlowMng.progId = model.prog_mst.progId;
        } else{
            console.log('Invalid model type');
        }
    }

    serialize() {
        return {
            ...super.serialize(),
            progWorkFlowMng: this.progWorkFlowMng
        };
    }

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.progWorkFlowMng = event.data.progWorkFlowMng;
        console.log(this.progWorkFlowMng);
	}

    setGridRows(newRows: any[]){
        this.gridRows = [...newRows];
    }

    getFlowAttr(port: DefaultPortModel): void {
		let link = Object.values(port.getLinks())[0];
		let node = link?.getSourcePort()?.getNode();

		if (node instanceof FilterNodeModel) {
            let snode = Object.values(node.getPort('in').getLinks())[0]?.getSourcePort().getNode();
            
            if(snode instanceof SelectNodeModel){
                console.log(snode.getFlowAttr())
                this.setFlowAttr(snode.getFlowAttr());
            }
		} else if(node instanceof SelectNodeModel){
            this.setFlowAttr(node.getFlowAttr())
            console.log(node.getFlowAttr());
        } 
	}

	setFlowAttr(newAttr: any) {
		this.selectFlowAttrInfo = newAttr;
	}

    refresh() {
		this.getFlowAttr(this.inPort);
	}

}

export default OutputNodeModel;
