import { DefaultLinkModel, DefaultPortModel } from "@projectstorm/react-diagrams";

export class ArrowLinkModel extends DefaultLinkModel {
	constructor() {
		super({
			type: 'arrow-link',
			width: 4
		});
	}
}

export class ArrowPortModel extends DefaultPortModel {
	createLinkModel(): ArrowLinkModel | null {
		return new ArrowLinkModel();
	}
}