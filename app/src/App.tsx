import './App.css';
import createEngine, * as SRD from '@projectstorm/react-diagrams';

import { DefaultNodeFactory } from './components/node/DefaultNodeFactory';
import { ArrowLinkFactory } from './components/link/ArrowLinkFactory'
import SerializeAction from './SerializeAction';
import SelectNodeFactory from './components/node/SqlNodeFactory';
import SaveNodeFactory from './components/node/SaveNodeFactory';
import FilterNodeFactory from './components/node/FilterNodeFactory';

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
    
    this.engine.getNodeFactories().registerFactory(new DefaultNodeFactory());
    this.engine.getLinkFactories().registerFactory(new ArrowLinkFactory());
    this.engine.getNodeFactories().registerFactory(new SelectNodeFactory());
    this.engine.getNodeFactories().registerFactory(new SaveNodeFactory());
    this.engine.getNodeFactories().registerFactory(new FilterNodeFactory());

    const model = new SRD.DiagramModel()
    this.engine.setModel(model);

    this.engine.getActionEventBus().registerAction(new SerializeAction());
    // var str = JSON.stringify(model.serialize());
    // var model2 = new SRD.DiagramModel();
    // model2.deserializeModel(JSON.parse(str), this.engine);

    this.engine.setModel(model);

  }

	public getActiveDiagram(): SRD.DiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): SRD.DiagramEngine {
		return this.engine;
	}
}

