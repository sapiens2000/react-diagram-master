import * as React from 'react';
import * as _ from 'lodash';
import {  DefaultNodeModel } from './components/node/DefaultNodeModel';
import { Action, ActionEvent, InputType } from '@projectstorm/react-canvas-core';

export default class CustomContextAction extends Action {
	constructor(){
		super({
			type: InputType.MOUSE_DOWN,
			fire: (event: ActionEvent<React.MouseEvent>) => {
				const selectedEntities = this.engine.getModel().getSelectedEntities();
				if (selectedEntities.length === 1){
					// right click
					if (event.event.button == 2) {		
						console.log('click')	
						selectedEntities.forEach(model => {
							if (model instanceof DefaultNodeModel){					
								console.log(model.getPosition());
							}
						})
					}
				}
			}
		});
	}
}

