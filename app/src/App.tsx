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

	private _isLoaded: boolean = false;

	get isLoaded() : boolean {
		return this._isLoaded;
	}
	set isLoaded(value : boolean) {
		this._isLoaded = value;
	}

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
			this.isLoaded = true;
      this.loadProject(newProject);
			this.isLoaded = false;
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
		// 연결하는 상황만 고려한 코드, 끊는 상황을 생각하지 않아 유연성이 떨어짐
    // model.registerListener({
    //   linksUpdated: (event: any) => {
		// 		const link = event.link
    //     event.link.registerListener({
    //       targetPortChanged: (event: any) => {
		// 					if(event.port.options.alignment == 'left') {
		// 						let tempFlowList = [link.sourcePort.parent.progWorkFlowMng.flowId,
		// 																			link.targetPort.parent.progWorkFlowMng.flowId];
		// 						this._workflow.push(tempFlowList);
		// 					}
		// 					else if(event.port.options.alignment == 'right') {
		// 						let tempFlowList = [link.targetPort.parent.progWorkFlowMng.flowId,
		// 																			link.sourcePort.parent.progWorkFlowMng.flowId];
		// 						this._workflow.push(tempFlowList);
		// 					}
    //       }
    //     })
    //   }
    // });

    this.engine.setModel(model);
  }

  public makeNewProg(): ProjectDiagramModel {
		let tmp_prog_mst = {
			progId: 0,
			progNm: "new project",
			progDesc: "",
			viewAttr: {},
			useYn: false,
			crtdDttm: "",
			updtDttm: "",
			dltDttm: ""
		}
		const newModel = new ProjectDiagramModel();

		const new_project = async() => await axios.post("/diagram/project", tmp_prog_mst, {maxRedirects: 0})
			.then(response => {
				tmp_prog_mst.progId = response.data;
				newModel.setProgMst(tmp_prog_mst);
				return newModel;
			})
			.catch((Error) => {
				console.log(Error);
			});
		
		new_project();
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



		const load_project = async() => await axios.get(`/diagram/project/load/${progId}`, { maxRedirects: 0})
			.then(response => {
				console.log('Response data:', response.data);
				
				const newModel = new ProjectDiagramModel();
				
				let progMstDto = {
					progId: response.data.progId,
					progNm: response.data.progNm,
					progDesc: response.data.progDesc,
					useYn: response.data.useYn,
				}
				
				newModel.setProgMst(progMstDto);
				this.engine.setModel(newModel);
				this.engine.getModel().deserializeModel(JSON.parse(response.data.viewAttr), this.engine);
				console.log(newModel.prog_mst)
			})
			.catch((Error) => {
				console.log(Error);
			});
		
		load_project();
		//this.engine.repaintCanvas();
	}

	public getActiveDiagram(): ProjectDiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): SRD.DiagramEngine {
		return this.engine;
	}
}