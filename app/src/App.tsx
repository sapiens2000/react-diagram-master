import './App.css';
import createEngine, * as SRD from '@projectstorm/react-diagrams';
import { ArrowLinkFactory } from './components/link/ArrowLinkFactory'
import SelectNodeFactory from './components/node/SelectNodeFactory';
import FilterNodeFactory from './components/node/FilterNodeFactory';
import OutputNodeFactory from './components/node/OutputNodeFactory';
import { SelectionBoxLayerFactory } from '@projectstorm/react-diagrams';

export default class App {
  protected activeModel: SRD.DiagramModel;
	protected engine: SRD.DiagramEngine;

  constructor() {
		//this.engine = SRD.default();
    this.engine = createEngine({registerDefaultDeleteItemsAction: false});
		this.newModel();
	}

  public newModel(){
    this.engine.setModel(this.activeModel);
    
    this.engine.getLinkFactories().registerFactory(new ArrowLinkFactory());
    this.engine.getNodeFactories().registerFactory(new OutputNodeFactory());
    this.engine.getNodeFactories().registerFactory(new FilterNodeFactory());
    this.engine.getNodeFactories().registerFactory(new SelectNodeFactory());
    this.engine.getLayerFactories().registerFactory(new SelectionBoxLayerFactory());

    console.log(this.engine.getLayerFactories())
    const model = new SRD.DiagramModel()
    
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

	public getActiveDiagram(): SRD.DiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): SRD.DiagramEngine {
		return this.engine;
	}
}