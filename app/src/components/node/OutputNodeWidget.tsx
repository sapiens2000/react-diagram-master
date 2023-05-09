import React, {FC, useState} from "react";
import { BaseModel, DiagramEngine } from "@projectstorm/react-diagrams";
import {SaveNode} from "./OutputNodeModel";

import {Container} from "@mui/material";
import SaveModal from "../modal/SaveModal";
import * as S from "../../adstyled";
import EastIcon from '@mui/icons-material/East';
import { GridRowsProp } from "@mui/x-data-grid";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export interface SaveNodeWidgetProps {
    node: SaveNode;
    engine: DiagramEngine;
}

const rows: GridRowsProp = [
    {
      id: 1,
      tableFieldName: 'LOG_DATE',
      type: '',
      mappingField: '',
      defaultValue: '',
    },
    {
        id: 2,
        tableFieldName: 'LOG_TIME',
        type: '',
        mappingField: '',
        defaultValue: '',
    },
    {
        id: 3,
        tableFieldName: 'LOG_USER_ID',
        type: '',
        mappingField: '',
        defaultValue: '',
    },
    {
        id: 4,
        tableFieldName: 'LOG_PAY_ACC',
        type: '',
        mappingField: '',
        defaultValue: '',
      }
  ];
  


const SaveNodeWidget : FC<SaveNodeWidgetProps> = ({engine, node}) => {
    const [onModal, setOnModal] = useState(false);
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
      } | null>(null);
    const [curType, setCurType] = useState('');
    const [curRows, setCurRows] = useState(rows);
    const [curAttr, setCurAttr] = useState(node.prog_work_Flow);


    const handleModalOpen = () => {
        setOnModal(true);
    }   

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
              ? {
                  mouseX: event.clientX + 2,
                  mouseY: event.clientY - 6,
                }
              : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                // Other native context menus might behave different.
                // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                null,
          );
        };

    const handleClose = () => {
        setContextMenu(null)
    }
    
    const renderModal = () => {
        return (
          <SaveModal
            dataSet={null}
            prog_work_Flow_mng={node.prog_work_Flow}
            setOnModal={setOnModal}
            curType={curType}
            setCurType={setCurType}
            setCurRows={setCurRows}
            curRows={curRows}
            curAttr={curAttr}
            setCurAttr={setCurAttr}
          />
        );
      };

    const handleDelete = () => {
      node.setSelected(true);
      engine.getActionEventBus()

      node.setSelected(false);
      setContextMenu(null);
    }

    const handleCopy = () => {
      // need connection with db
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
      setContextMenu(null);

      engine.repaintCanvas();
    }

    return (
        <div className="output" onDoubleClick={handleModalOpen} onContextMenu={handleContextMenu}>
            <S.Widget>
                <S.InPort
                    port={node.inPort}
                    engine={engine}
                    style={{ left: -4, top: "50%" }}
                />
                <Container>
                    <EastIcon fontSize="large"/>
                </Container>    
            </S.Widget>
            {onModal && renderModal()}
            <Menu
                open={contextMenu !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                  contextMenu !== null
                    ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                    : undefined
                }
              >
                <MenuItem onClick={handleDelete}>삭제</MenuItem>
                <MenuItem onClick={handleCopy}>복사</MenuItem>
            </Menu>
        </div>
    );
}

export default SaveNodeWidget;