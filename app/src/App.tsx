import './App.css';
import createEngine, * as SRD from '@projectstorm/react-diagrams';
import { DefaultNodeFactory } from './components/node/DefaultNodeFactory';
import { ArrowLinkFactory } from './components/link/ArrowLinkFactory'
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
    
    model.registerListener({
      linksUpdated: (event: any) => {
        event.link.registerListener({
          targetPortChanged: (event: any) => {
            console.log(event.link);
          }
        });
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