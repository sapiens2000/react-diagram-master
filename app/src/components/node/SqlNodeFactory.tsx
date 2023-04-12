import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import SqlNodeModel from "./SqlNodeModel";
import SqlNodeWidget from "./SqlNodeWidget";


class SqlNodeFactory extends AbstractReactFactory<SqlNodeModel,DiagramEngine> {
    constructor() {
        super("sql");
    }

    generateReactWidget(event: any) {
        return <SqlNodeWidget node={event.model} engine={this.engine} />;
    }

    generateModel(event: any) {
        return new SqlNodeModel(this.engine);
    }
}

export default SqlNodeFactory;
