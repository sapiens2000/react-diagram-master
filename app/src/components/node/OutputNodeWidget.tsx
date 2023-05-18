import React, {FC, useState} from "react";
import { BaseModel, DiagramEngine } from "@projectstorm/react-diagrams";
import {OutputNodeModel} from "./OutputNodeModel";
import {Modal, Container, IconButton, Typography, Popover, TextareaAutosize} from "@mui/material";
import OutputModal from "../modal/OutputModal";
import * as S from "../../adstyled";
import EastIcon from '@mui/icons-material/East';
import { GridRowsProp } from "@mui/x-data-grid";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export interface OutputNodeWidgetProps {
    node: OutputNodeModel;
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



const OutputNodeWidget : FC<OutputNodeWidgetProps> = ({engine, node}) => {
    const [onModal, setOnModal] = useState(false);
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
      } | null>(null);
    const [curType, setCurType] = useState('');
    const [curRows, setCurRows] = useState(rows);
    const [curAttr, setCurAttr] = useState(node.prog_work_flow_mng);

		////////////////////추가한 부분/////////////////////
	  const [memoAnchorEl, setMemoAnchorEl] = useState<null | HTMLElement>(null);
	  const [memoContent, setMemoContent] = useState('');


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
          <OutputModal
            dataSet={null}
            prog_work_Flow_mng={node.prog_work_flow_mng}
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
      node.remove();
      engine.repaintCanvas();
    }

    const handleCopy = () => {
      // need connection with db and copy data set
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

      console.log('copy')
      engine.repaintCanvas();
    }

    const handleLock = () => {
      if(node.isLocked() === true)
        node.setLocked(true)
      else
        node.setLocked(false)

      console.log('set lock')
      setContextMenu(null);
      engine.repaintCanvas();
    }

		const handleMemoOpen = (event: React.MouseEvent<HTMLElement>) => {
			setMemoAnchorEl(event.currentTarget);
		};

		const handleMemoClose = () => {
			setMemoAnchorEl(null);
		};

		const handleMemoChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
			setMemoContent(event.target.value);
		}

		const memoOpen = Boolean(memoAnchorEl);
		const id = memoOpen ? 'simple-popover' : undefined;


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

					{/******추가한 부분*******/}
					<Popover
						id={id}
						open={memoOpen}
						anchorEl={memoAnchorEl}
						onClose={handleMemoClose}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'center',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'center',
						}}
					>
						<div style={{padding: '20px', width: '200px', backgroundColor: '#686869'}}>
							<TextareaAutosize
								minRows={3}
								value={memoContent}
								onChange={handleMemoChange}
								placeholder="메모를 작성하세요..."
								style={{width: '100%', backgroundColor: '#686869', color: '#fff'}}
							/>
						</div>
					</Popover>
					{/******추가한 부분*******/}
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
						<MenuItem onClick={handleLock}>잠금</MenuItem>
						<MenuItem onClick={handleMemoOpen}>메모</MenuItem>
					</Menu>
        </div>
    );
}

export default OutputNodeWidget;