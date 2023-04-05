import * as React from 'react';
import * as _ from 'lodash';
import { Action, ActionEvent, InputType } from '@projectstorm/react-canvas-core';

export default class SerializeAction extends Action {
	constructor(){
		super({
			type: InputType.KEY_DOWN,
			fire: (event: ActionEvent<React.KeyboardEvent>) => {
                if (event.event.keyCode == 13) {		
                    
                    const allEntities = this.engine.getModel().getSelectionEntities();
                    const selectedEntities = this.engine.getModel().getSelectedEntities();
                    if (selectedEntities.length > 0){
                        _.forEach(selectedEntities, (model) => {
                            console.log(model.serialize());
                        })    
                    }
                }
			}
		});
	}
}

