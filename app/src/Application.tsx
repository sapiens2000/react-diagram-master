import * as SRD from '@projectstorm/react-diagrams';
import { DefaultNodeModel } from './DefaultNodeModel';


/**
 * @author Dylan Vorster
 */
export class Application {
	protected activeModel: SRD.DiagramModel;
	protected diagramEngine: SRD.DiagramEngine;

	constructor() {
		this.diagramEngine = SRD.default();
		this.activeModel = new SRD.DiagramModel();
		this.newModel();
	}

	public newModel() {
		this.diagramEngine.setModel(this.activeModel);
		
		//3-A) create a default node
		var node1 = new DefaultNodeModel('Node 1', 'rgb(0,192,255)');
		node1.addOutPort('Out');
		node1.setPosition(100, 100);

		//3-B) create another default node
		  
		var node2 =  new DefaultNodeModel('table', 'rgb(0,192,255)');
		
		node2.setPosition(400, 100);
		


		this.activeModel.addAll(node1, node2);
		
	}

	public getActiveDiagram(): SRD.DiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): SRD.DiagramEngine {
		return this.diagramEngine;
	}
}


