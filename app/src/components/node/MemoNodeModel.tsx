import {CanvasEngine, DeserializeEvent} from "@projectstorm/react-canvas-core";
import {
	DefaultPortModel,
	NodeModel,
	NodeModelGenerics,
} from "@projectstorm/react-diagrams";

export class MemoNodeModel extends NodeModel<NodeModelGenerics>{
	memo = '';

	constructor(readonly engine: CanvasEngine) {
		super({ type: "memo-node" });
	}

	setLocked(locked?: boolean) {
		super.setLocked(locked);
	}

	// 저장 및 불러오기에 필요
	serialize() {
		return {
			...super.serialize(),
			memo : this.memo
		};
	}

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.memo = event.data.memo;
	}
}

export default MemoNodeModel;