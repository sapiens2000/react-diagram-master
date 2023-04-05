import * as React from 'react';
import * as _ from 'lodash';
import {  DefaultNodeModel } from './components/node/DefaultNodeModel';
import { Action, ActionEvent, InputType } from '@projectstorm/react-canvas-core';

export default class ContextAction extends Action {
	constructor(){
		super({
			type: InputType.MOUSE_DOWN,
			fire: (event: ActionEvent<React.MouseEvent>) => {
				const selectedEntities = this.engine.getModel().getSelectedEntities();
				// 하나만 선택하면 
				if (selectedEntities.length === 1){
					// 우클릭
					if (event.event.button == 2) {		
						event.event.preventDefault();
						selectedEntities.forEach(model => {
							if (model instanceof DefaultNodeModel){					
								
							}
						})
					}
				}
			}
		});
	}
}

