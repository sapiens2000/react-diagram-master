import './App.css';
import createEngine, * as SRD from '@projectstorm/react-diagrams';
import { ArrowLinkFactory } from './components/link/ArrowLinkFactory'
import SelectNodeFactory from './components/node/SelectNodeFactory';
import FilterNodeFactory from './components/node/FilterNodeFactory';
import OutputNodeFactory from './components/node/OutputNodeFactory';
import { ProjectDiagramModel } from './components/model/ProjectDiagramModel';
import axios from 'axios';

export default class App {
  protected activeModel: SRD.DiagramModel;
	protected engine: SRD.DiagramEngine;

  constructor() {
		//this.engine = SRD.default();
    this.engine = createEngine({registerDefaultDeleteItemsAction: false});
		this.newModel();
	}

  public newModel(){
    //this.engine.setModel(this.activeModel);
    
    this.engine.getLinkFactories().registerFactory(new ArrowLinkFactory());
    this.engine.getNodeFactories().registerFactory(new OutputNodeFactory());
    this.engine.getNodeFactories().registerFactory(new FilterNodeFactory());
    this.engine.getNodeFactories().registerFactory(new SelectNodeFactory());


    const model = this.makeNewProg();

    model.registerListener({
      linksUpdated: (event: any) => {
        event.link.registerListener({
          targetPortChanged: (event: any) => {
              console.log(event.port.parent);
          }
        })
      }
    });
 
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
        updtdttm: "",
        dltDttm: ""
      }
 
    // 나중에 변경
    axios.post("/diagram/project", tmp_prog_mst, { maxRedirects: 0})
    .catch((Error) => { 
      console.log(Error);
    }).then(response => {
      const regex = /프로젝트 ID: (\d+)/; 
      const matches = response.data.match(regex);
      if (matches) {
        const id = parseInt(matches[1]);
        tmp_prog_mst.progId = id;    
      }
    });

    console.log(tmp_prog_mst);
    const newModel = new ProjectDiagramModel();
    newModel.setProgMst(tmp_prog_mst);
    return newModel;
  }

	public getActiveDiagram(): SRD.DiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): SRD.DiagramEngine {
		return this.engine;
	}
}