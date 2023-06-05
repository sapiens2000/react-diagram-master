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
interface RowField {
    id: number;
    tableFieldName: string;
    type: string;
    mappingField: string;
    defaultValue: string;
}
  
const generateGridRows = (RowFieldNames: string[]): RowField[] => {
    return RowFieldNames.map((fieldName, index) => {
        return {
            id: index + 1,
            tableFieldName: fieldName,
            type: '',
            mappingField: '',
            defaultValue: '',
            pk: 'false'
        };
    });
};

const GridrowsToColInfo = (Rows: RowField[]): { [key: string]: string | any[] } => {
    const transformedData: { [key: string]: string | any[] } = {};
  
    Rows.forEach((row: any) => {
      const { tableFieldName, type, mappingField, defaultValue } = row;
      transformedData[tableFieldName] = [type, mappingField, defaultValue];
    });
  
    return transformedData;
  };


const testFieldNames = ['LOG_DATE', 'LOG_TIME', 'LOG_USER_ID', 'LOG_PAY_ACC'];


type ColInfo = Array<Array<any>>;
type flowAttrInfoType = {
    type: string,
    pk: {},
    tableName: string,
    col_info: ColInfo,
}

export class OutputNodeModel extends NodeModel<NodeModelGenerics> {
    dataSet: {
        column: string[]
    }

    inPort = new DefaultPortModel(true, "in");
    
    flowAttrInfo: {
		type: string,
        pk: {},
        tableName: string,
        col_info: ColInfo,
	}

    progWorkFlowMng: {
        flowId: number;
        progId: number;
        flowSeq: number;
        flowType: string;
        flowAttr: flowAttrInfoType;
        crtdDttm: string;
        updtDttm: string;
    };

    selectFlowAttrInfo: FlowAttr | null = null;
    test_rows: any;

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
                pk: {},
                tableName: '',
                col_info: []
            },
            crtdDttm : "",
            updtDttm : "",
        }

        this.test_rows = generateGridRows(testFieldNames);

        // default
        // this.flowAttrInfo = { 
        //     type: 'insert',
        //     pk: [],
        //     tableName: '',
        //     col_info: [...test_rows ]
        // }

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
