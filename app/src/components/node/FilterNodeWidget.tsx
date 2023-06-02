import React, {FC, useState, useEffect} from "react";
import {BaseModel, DiagramEngine} from "@projectstorm/react-diagrams";
import {FilterNodeModel, Field} from "./FilterNodeModel";

import {Modal, Container, IconButton, Menu, MenuItem, Typography, Popover, TextareaAutosize} from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import EditNoteIcon from '@mui/icons-material/EditNote';

import ModalPortal from "../modal/ModalPortal";
import FilterModal from "../modal/FilterModal";
import GetFilteredData from "./GetFilteredData";
import * as S from "../../adstyled";
import "../../styles.css";
import { ContextDelete, ContextCopy, ContextLock } from "./ContextMenuOptions";
import axios from "axios";

export interface FilterNodeWidgetProps {
	node: FilterNodeModel;
	engine: DiagramEngine;
}

const FilterNodeWidget : FC<FilterNodeWidgetProps> = ({engine, node}) => {

	const initTable = node.selectFlowAttrInfo ? node.selectFlowAttrInfo.col : null;

	const [filterModalOpened, setFilterModalOpened] = useState(false);
	const [tableField, setTableField] = useState(initTable);
	const [isFirstRender, setIsFirstRender] = useState(true);
	const [fieldChanged, setFieldChanged] = useState(false);

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
		setContextMenu(null);
	};
	///////////////////////////////////
	//////////////MODAL////////////////
	const handleModalOpen = () => {
		node.setLocked(true);
		setFilterModalOpened(true);
	};

	const handleModalClose = () => {
		node.setLocked(false);
		setFilterModalOpened(false);
	};

	node.refresh();
	console.log(node.selectFlowAttrInfo);

	useEffect(() => {
		if(node.selectFlowAttrInfo && node.selectFlowAttrInfo.col) {
			setTableField(node.selectFlowAttrInfo.col);
		}
	}, [node.selectFlowAttrInfo]);

	// useEffect(() => {
	// 	if(node.fieldStates) {
	// 		node.filteredData = GetFilteredData(node.dummy, node.fieldStates);
	// 		console.log(node.filteredData);
	// 	}
	// }, [node.fieldStates]);

	const handleFieldStatesUpdate = (updatedFieldStates : Field) => {
		node.setFieldState(updatedFieldStates);
		setFieldChanged(!fieldChanged)
	};

	///////////////////////////////////
	useEffect(() => {
		if(isFirstRender) {
			setIsFirstRender(false);
			console.log("nooo");
			return;
		}
		else {
			let mergedObject: any = {
				"col_info": node.selectFlowAttrInfo.col,
			};

			for (let key in node.fieldStates) {
				if (node.fieldStates.hasOwnProperty(key) && key !== 'col' && key !== '') {
					mergedObject[key] = Object.values(node.fieldStates[key]);
				}
			}

			node.progWorkFlowMng = {
				...node.progWorkFlowMng,
				flowAttr: JSON.stringify(mergedObject)
			};
			console.log(node.progWorkFlowMng);
			const fetchData = async () => {
				try {
					const response =
						await axios.post(`/diagram/project/update-node/${node.progWorkFlowMng.progId}/${node.progWorkFlowMng.flowId}`
							, node.progWorkFlowMng, {maxRedirects: 0});
					console.log("Response data:", response.data);
				} catch (error) {
					console.error("Error fetching data:", error);
				}
			};

			fetchData();
		}
	}, [fieldChanged]);

	return (
		<div className="filter" onContextMenu={handleContextMenu}>
			<S.Widget>
				<S.OutPort
					port={node.outPort}
					engine={engine}
					style={{ right: -4, top: "50%" }}
				/>
				<S.InPort
					port={node.inPort}
					engine={engine}
					style={{ left: -4, top: "50%" }}
				/>
				<Container style={{position: 'absolute', top: 15, right: 0}}>
					<IconButton onClick={handleModalOpen}><FilterAltIcon fontSize='large'/></IconButton>
					{filterModalOpened && (
						<ModalPortal closePortal={handleModalClose} flag={"filter"} id={node.getOptions().id}>
							<FilterModal
								dataSet={node.dataSet}
								onFieldStatesUpdate={handleFieldStatesUpdate}
								savedFieldStates= {node.fieldStates}
								// savedFieldStates = {fieldStates}
								tableField = {tableField}
							/>
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
			<div id={`filter-modal-${node.getOptions().id}`}></div>
		</div>
	);
}

export default FilterNodeWidget;