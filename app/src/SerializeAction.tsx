import * as React from 'react';
import * as _ from 'lodash';
import { Action, ActionEvent, InputType } from '@projectstorm/react-canvas-core';

export default class SerializeAction extends Action {
	constructor(){
		super({
			type: InputType.KEY_DOWN,
			fire: (event: ActionEvent<React.KeyboardEvent>) => {
                if (event.event.keyCode == 13) {		
                    const AllEntities = this.engine.getModel().getSelectionEntities();
                    if (AllEntities.length > 0){
                        _.forEach(AllEntities, (model) => {
                            console.log(model.serialize());
                        })    
                    }
                }
			}
		});
	}
}

