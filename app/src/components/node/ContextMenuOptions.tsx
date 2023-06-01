import axios from "axios";
import OutputNodeModel from "./OutputNodeModel";
import { BaseModel, DiagramEngine } from "@projectstorm/react-diagrams";
import FilterNodeModel from "./FilterNodeModel";
import SelectNodeModel from "./SelectNodeModel";
import MemoNodeModel from "./MemoNodeModel";

export const ContextDelete = (engine: DiagramEngine,node: SelectNodeModel | FilterNodeModel | OutputNodeModel | MemoNodeModel) => {
    if(node instanceof MemoNodeModel){

    }
    else{
        axios.post(`/diagram/project/delete-node/${node.progWorkFlowMng.progId}"/${node.progWorkFlowMng.flowId}` , node.progWorkFlowMng, { maxRedirects: 0})
        .catch((Error) => { 
            console.log(Error);
        }).then(response => {
            console.log(response);
        });
    }

    node.remove();
    engine.repaintCanvas();
  }

export const ContextCopy = (engine: DiagramEngine,node: SelectNodeModel | FilterNodeModel | OutputNodeModel | MemoNodeModel) => {
    // need additional db work
    node.setSelected(true);
    let offset = { x: 100, y: 100 };
    let model = engine.getModel()

    let target = model.getSelectedEntities()

    if(target.length > 0){
      let newNode = target[0].clone()

      newNode.setPosition(newNode.getX() + offset.x, newNode.getY() + offset.y);
      model.addNode(newNode);
      (newNode as BaseModel).setSelected(false);

    }
    node.setSelected(false);
    engine.repaintCanvas();
  }

export const ContextLock = (engine: DiagramEngine,node: SelectNodeModel | FilterNodeModel | OutputNodeModel | MemoNodeModel) => {
    if(node.isLocked() === true)
      node.setLocked(true)
    else
      node.setLocked(false)

    engine.repaintCanvas();
  }