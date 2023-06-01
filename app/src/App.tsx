import './App.css';
import createEngine, * as SRD from '@projectstorm/react-diagrams';
import { ArrowLinkFactory } from './components/link/ArrowLinkFactory'
import SelectNodeFactory from './components/node/SelectNodeFactory';
import FilterNodeFactory from './components/node/FilterNodeFactory';
import OutputNodeFactory from './components/node/OutputNodeFactory';
import MemoNodeFactory from './components/node/MemoNodeFactory';
import { ProjectDiagramModel } from './components/model/ProjectDiagramModel';
import axios from 'axios';

export default class App {
  protected activeModel: ProjectDiagramModel;
	protected engine: SRD.DiagramEngine;

	private _workflow: any[] = [];
	get workflow(): any[] {
		return this._workflow;
	}

  constructor(newProject: Number) {
		//this.engine = SRD.default();
    this.engine = createEngine({registerDefaultDeleteItemsAction: false});
		if(newProject == 0){
      this.newProject();
    }else{
      this.loadProject(newProject);
    }
	}

  public newProject(){
    //this.engine.setModel(this.activeModel);

    this.engine.getLinkFactories().registerFactory(new ArrowLinkFactory());
    this.engine.getNodeFactories().registerFactory(new OutputNodeFactory());
    this.engine.getNodeFactories().registerFactory(new FilterNodeFactory());
    this.engine.getNodeFactories().registerFactory(new SelectNodeFactory());
		this.engine.getNodeFactories().registerFactory(new MemoNodeFactory());


    const model = this.makeNewProg();

		// DB에서 model을 불러왔을 때 workflow가 저장되지 않는 문제가 있다
		// 노드 실행 시퀀스 확인
    model.registerListener({
      linksUpdated: (event: any) => {
				const link = event.link
        event.link.registerListener({
          targetPortChanged: (event: any) => {
							if(event.port.options.alignment == 'left') {
								let tempFlowList = [link.sourcePort.parent.progWorkFlowMng.flowId,
																					link.targetPort.parent.progWorkFlowMng.flowId];
								this._workflow.push(tempFlowList);
							}
							else if(event.port.options.alignment == 'right') {
								let tempFlowList = [link.targetPort.parent.progWorkFlowMng.flowId,
																					link.sourcePort.parent.progWorkFlowMng.flowId];
								this._workflow.push(tempFlowList);
							}
          }
        })
      }
    });

    this.engine.setModel(model);
  }

  public makeNewProg(): ProjectDiagramModel {
		var tmp_prog_mst = {
			progId: 0,
			progNm: "new project",
			progDesc: "",
			viewAttr: {},
			useYn: false,
			crtdDttm: "",
			updtDttm: "",
			dltDttm: ""
		}

		axios.post("/diagram/project", tmp_prog_mst, {maxRedirects: 0})
			.then(response => {
				tmp_prog_mst.progId = response.data;
				console.log(tmp_prog_mst);
			})
			.catch((Error) => {
				console.log(Error);
			});

		const newModel = new ProjectDiagramModel();
		newModel.setProgMst(tmp_prog_mst);
		return newModel;
	}

	public loadProject(progId : Number){
		//////////////////////////////////
		this.engine.getLinkFactories().registerFactory(new ArrowLinkFactory());
		this.engine.getNodeFactories().registerFactory(new OutputNodeFactory());
		this.engine.getNodeFactories().registerFactory(new FilterNodeFactory());
		this.engine.getNodeFactories().registerFactory(new SelectNodeFactory());
		this.engine.getNodeFactories().registerFactory(new MemoNodeFactory());

		const model = new ProjectDiagramModel();
		this.engine.setModel(model);
		//////////////////////////////////

		axios.post(`/diagram/project/load/${progId}`, progId, { maxRedirects: 0})
			.then(response => {
				console.log('Response data:', response.data);

				let viewAttr = JSON.parse(response.data.viewAttr);
				console.log('ViewAttr:', viewAttr);
				const newModel = new ProjectDiagramModel();
				newModel.setProgMst(response.data);
				this.engine.setModel(newModel);
				this.engine.getModel().deserializeModel(viewAttr, this.engine);
			})
			.catch((Error) => {
				console.log(Error);
			});

		// 클릭해야 갱신되는 문제 있음 forceupdate() 하고싶은데 어디서?
		// 다중 JSON을 불러오는데서 문제가 발생함 ProgMsgDto2로 임시처리
	}

	public getActiveDiagram(): ProjectDiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): SRD.DiagramEngine {
		return this.engine;
	}
}