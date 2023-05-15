import './App.css';
import createEngine, * as SRD from '@projectstorm/react-diagrams';
import { ArrowLinkFactory } from './components/link/ArrowLinkFactory'
import SelectNodeFactory from './components/node/SelectNodeFactory';
import FilterNodeFactory from './components/node/FilterNodeFactory';
import OutputNodeFactory from './components/node/OutputNodeFactory';

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

    const model = new SRD.DiagramModel()
    
    model.registerListener({
      linksUpdated: (event: any) => {
          console.log(event.link.sourcePort.parent.dataSet)
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

// contextaction
// import * as React from 'react';
// import * as _ from 'lodash';
// import {  DefaultNodeModel } from './components/node/DefaultNodeModel';
// import { Action, ActionEvent, InputType } from '@projectstorm/react-canvas-core';


// export default class ContextAction extends Action {
// 	constructor(){
// 		super({
// 			type: InputType.MOUSE_DOWN,
// 			fire: (event: ActionEvent<React.MouseEvent<Element, MouseEvent>>) => {
// 				const selectedEntities = this.engine.getModel().getSelectedEntities();
// 				if (selectedEntities.length === 1){
// 					if (event.event.button == 2) {		
// 						event.event.preventDefault();
// 						selectedEntities.forEach(model => {
// 							if (model instanceof DefaultNodeModel){					
// 								event.event.preventDefault();
// 							}
// 						})
// 					}
// 				}
// 			}
// 		});
// 	}
// }