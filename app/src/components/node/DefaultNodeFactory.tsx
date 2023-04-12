import { DefaultNodeModel } from './DefaultNodeModel';
import { DefaultNodeWidget } from './DefaultNodeWidget';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class DefaultNodeFactory extends AbstractReactFactory<DefaultNodeModel, DiagramEngine> {
	constructor() {
		super('default');
	}

	generateReactWidget(event: any): JSX.Element {
		return <DefaultNodeWidget engine={this.engine} node={event.model} />;
	}

	generateModel(event: any): DefaultNodeModel {
		return new DefaultNodeModel();
	}
}
