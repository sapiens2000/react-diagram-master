import React, {FC, useState, useEffect} from "react";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import {FilterNode, Field} from "./FilterNode";

import {Container, Button, IconButton, Typography} from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import ModalPortal from "../modal/ModalPortal";
import FilterModal from "../modal/FilterModal";
import GetFilteredData from "./GetFilteredData";
import * as S from "../../adstyled";
import "../../styles.css";

export interface FilterNodeWidgetProps {
	node: FilterNode;
	engine: DiagramEngine;
}

const FilterNodeWidget : FC<FilterNodeWidgetProps> = ({engine, node}) => {

	const initTable = Object.keys(node.dummy[0]);

	const [modalOpened, setModalOpened] = useState(false);
	// const [fieldStates, setFieldStates] = useState(null);
	const [tableField, setTableField] = useState(initTable);
	const [isFirstRender, setIsFirstRender] = useState(true);
	const [fieldChanged, setFieldChanged] = useState(false);

	node.refresh();
	console.log(node.fieldStates);

	useEffect(() => {
		if(node.dummy) {
			setTableField(Object.keys(node.dummy[0]));
		}
	}, [node.dummy]);

	useEffect(() => {
		if(node.fieldStates) {
			node.filteredData = GetFilteredData(node.dummy, node.fieldStates);
			console.log(node.filteredData);
		}
	}, [node.fieldStates]);

	const handleOpen = () => {
		setModalOpened(true);
	};

	const handleClose = () => {
		setModalOpened(false);
	};

	const handleFieldStatesUpdate = (updatedFieldStates : Field) => {
		node.setFieldState(updatedFieldStates);
		setFieldChanged(!fieldChanged)
	};

	useEffect(() => {
		if(isFirstRender) {
			setIsFirstRender(false);
			console.log("nooo");
			return;
		}
		else {
			node.progWorkFlowMng = {
				...node.progWorkFlowMng,
				flowAttr: JSON.stringify(node.fieldStates)
			};
			console.log(node.progWorkFlowMng);
		}
	}, [fieldChanged]);

	return (
		<div className="filter">
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
				<Container>
					<IconButton onClick={handleOpen}><FilterAltIcon fontSize='large'/></IconButton>
					{modalOpened && (
						<ModalPortal closePortal={handleClose} flag={"filter"}>
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
			<div id="filter-modal"></div>
		</div>
	);
}

export default FilterNodeWidget;