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
import App from '../../App';

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
