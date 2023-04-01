import { DefaultLinkFactory, DefaultLinkModel } from "@projectstorm/react-diagrams";
import { ArrowLinkModel } from "./ArrowLinkModel";
import { ArrowLinkWidget } from "./ArrowLinkWidget";

export class ArrowLinkFactory extends DefaultLinkFactory {
	constructor() {
		super('advanced');
	}

	generateModel(): ArrowLinkModel {
		return new ArrowLinkModel();
	}

	generateReactWidget(event: { model: DefaultLinkModel; }): JSX.Element {
		return <ArrowLinkWidget link={event.model} diagramEngine={this.engine} />;
	}
}