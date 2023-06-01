import React, {FC, useRef, useState, useEffect} from "react";
import { BaseModel, DiagramEngine } from "@projectstorm/react-diagrams";
import {SelectNodeModel, FlowAttr} from "./SelectNodeModel";

import {Modal, Container, IconButton, Menu, MenuItem, Typography, Popover, TextareaAutosize} from "@mui/material";
import StorageIcon from '@mui/icons-material/Storage';
import ModalPortal from "../modal/ModalPortal";
import SelectModal from "../modal/SelectModal";

import * as S from "../../adstyled";
import "../../styles.css";
import axios from "axios";
import { ProjectDiagramModel } from "../model/ProjectDiagramModel";
import { ContextDelete, ContextCopy, ContextLock } from "./ContextMenuOptions";

export interface SelectNodeWidgetAdvancedProps {
	node: SelectNodeModel;
	engine: DiagramEngine;
}

const SelectNodeWidget : FC<SelectNodeWidgetAdvancedProps> = ({ engine, node}) => {

	const [selectModalOpened, setSelectModalOpened] = useState(false);
	const [data, setData] = useState([]); // NULL
	const [isFirstRender, setIsFirstRender] = useState(true);
	const [sqlChanged, setSqlChanged] = useState(false);

	const [onModal, setOnModal] = useState(false);
	const [contextMenu, setContextMenu] = React.useState<{
		mouseX: number;
		mouseY: number;
	} | null>(null);

	//////////////CONTEXT//////////////
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

	const handleDelete = () => {
		ContextDelete(engine, node)
		setContextMenu(null);
	}

	const handleCopy = () => {
		ContextCopy(engine, node);
		setContextMenu(null);
	}

	const handleLock = () => {
		ContextLock(engine, node)
		setContextMenu(null);
	}

	const handleContextClose = () => {
		setContextMenu(null)
	}
	//////////////////////////////////////
	//////////////MODAL/////////////////
	const handleModalOpen = () => {
		node.setLocked(true);
		setSelectModalOpened(true);
	};

	const handleModalClose = () => {
		node.setLocked(false);
		setSelectModalOpened(false);
	};

	const handleFlowAttrInfoChange = (newFlowAttrInfo : FlowAttr) => {
		// node.flowAttrInfo = newFlowAttrInfo;
		node.setFlowAttr(newFlowAttrInfo);
		setSqlChanged(!sqlChanged);
	}
	////////////////////////////////////////
	// console.log(node.flowAttrInfo);

	useEffect(() => {
		if(isFirstRender) {
			setIsFirstRender(false);
			console.log("nooo");
			return;
		}
		else {
			node.progWorkFlowMng = {
				...node.progWorkFlowMng,
				flowAttr: JSON.stringify(node.flowAttrInfo.sql)
			};
			console.log('Sending data:', JSON.stringify(node.progWorkFlowMng, null, 2));
			const fetchData = async () => {
				try {
					const response = await axios.post("/diagram/project/savenode/" + (engine.getModel() as ProjectDiagramModel).getProgId(),
						node.progWorkFlowMng
					);
					console.log("Response data:", response.data);
					setData(response.data); // 받은 데이터를 상태로 저장
				} catch (error) {
					console.error("Error fetching data:", error);
				}
			};

			fetchData();
		}
	}, [sqlChanged]);

	return (
		<div className="select" onContextMenu={handleContextMenu}>
			<S.Widget>
				<S.OutPort
					port={node.outPort}
					engine={engine}
					style={{ right: -4, top: "50%" }}
				/>
				<Container style={{position: 'absolute', top: 15, right: 0}}>
					<IconButton onClick={handleModalOpen}><StorageIcon fontSize="large" /></IconButton>
					{selectModalOpened && (
						<ModalPortal closePortal={handleModalClose} flag={"select"} id={node.progWorkFlowMng.progId}>
							<SelectModal flowAttrInfo={node.flowAttrInfo} onFlowAttrInfoChange={handleFlowAttrInfoChange}/>
						</ModalPortal>
					)}
				</Container>
			</S.Widget>
			{onModal}
			<Menu
				open={contextMenu !== null}
				onClose={handleContextClose}
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
			</Menu>
			<div id={`select-modal-${node.progWorkFlowMng.progId}`}></div>
		</div>
	);
};

export default SelectNodeWidget;
