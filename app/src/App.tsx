import './App.css';
import * as SRD from '@projectstorm/react-diagrams';

import { DefaultNodeFactory } from './components/node/DefaultNodeFactory';
import { DefaultNodeModel } from './components/node/DefaultNodeModel';
import { ArrowLinkFactory } from './components/link/ArrowLinkFactory'
import SerializeAction from './SerializeAction';
import SelectNodeFactory from './components/node/SelectNodeFactory';

export default class App {
  protected activeModel: SRD.DiagramModel;
	protected engine: SRD.DiagramEngine;

  constructor() {
		this.engine = SRD.default();
		this.newModel();
	}

  public newModel(){
    this.engine.setModel(this.activeModel);
    
    this.engine.getNodeFactories().registerFactory(new DefaultNodeFactory());
    this.engine.getLinkFactories().registerFactory(new ArrowLinkFactory());
    this.engine.getNodeFactories().registerFactory(new SelectNodeFactory());

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



