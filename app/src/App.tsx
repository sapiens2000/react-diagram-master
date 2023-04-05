import './App.css';
import * as SRD from '@projectstorm/react-diagrams';

import { DefaultNodeFactory } from './components/node/DefaultNodeFactory';
import ContextAction from './ContextAction';
import { DefaultNodeModel } from './components/node/DefaultNodeModel';
import { ArrowLinkFactory } from './components/link/ArrowLinkFactory'
import { ArrowPortModel } from './components/link/ArrowLinkModel';
import SerializeAction from './SerializeAction';
import beautify from 'json-beautify';

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


    const model = new SRD.DiagramModel();

    var node1 = new DefaultNodeModel('Node 1','rgb(0, 192, 255)');
    var port1 = node1.addPort(new ArrowPortModel(false, 'out', 'out'));
    node1.setPosition(100, 100);

    var node2 = new DefaultNodeModel('Node 2', 'rgb(192, 255, 0)');
    var port2 = node2.addPort(new ArrowPortModel(true, 'out', 'in'));
    node2.setPosition(400, 100);

    let link1 = port1.link(port2);

    model.addAll(node1, node2, link1);
    this.engine.setModel(model);

    // add events
    this.engine.getActionEventBus().registerAction(new ContextAction());
    this.engine.getActionEventBus().registerAction(new SerializeAction());
    var str = JSON.stringify(model.serialize());
    console.log(str);
    var model2 = new SRD.DiagramModel();
    model2.deserializeModel(JSON.parse(str), this.engine);

    this.engine.setModel(model2);
    console.log(model2.serialize());

  }

	public getActiveDiagram(): SRD.DiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): SRD.DiagramEngine {
		return this.engine;
	}
}



