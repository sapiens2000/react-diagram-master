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

  constructor(newProject: boolean) {
		//this.engine = SRD.default();
    this.engine = createEngine({registerDefaultDeleteItemsAction: false});
		if(newProject){
      this.newProject();
    }else{
      //this.loadProject();
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

    model.registerListener({
      linksUpdated: (event: any) => {
				const link = event.link
        event.link.registerListener({
          targetPortChanged: (event: any) => {
							// console.log(event.port);
              // console.log(link);

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

							// console.log(this.workflow);
          }
        })
      }
    });

    this.activeModel = model;
    this.engine.setModel(model);
  }

  public makeNewProg(): ProjectDiagramModel{    
    var tmp_prog_mst = {
        progId: -1,
        progNm: "new project",
        progDesc: "",
        viewAttr: {},
        useYn: false,
        crtdDttm: "",
        updtDttm: "",
        dltDttm: ""
      }
    
    const newModel = new ProjectDiagramModel();

    axios.post("/diagram/project", tmp_prog_mst)
    .then(response => {
      const id = parseInt(response.data);
      tmp_prog_mst.progId = id;

      
      newModel.setProgMst(tmp_prog_mst);
      console.log(newModel.getProgMst());
  
    } )
    .catch(error => {
      console.log(error);

    });

    return newModel;
  }

	public getActiveDiagram(): ProjectDiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): SRD.DiagramEngine {
		return this.engine;
	}
}