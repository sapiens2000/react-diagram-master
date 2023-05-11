import React, {FC, useRef, useState, useEffect} from "react";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import {SelectNode, FlowAttr} from "./SelectNode";

import {Container, IconButton, Typography} from "@mui/material";
import StorageIcon from '@mui/icons-material/Storage';
import ModalPortal from "../modal/ModalPortal";
import SelectModal from "../modal/SelectModal";

import * as S from "../../adstyled";
import "../../styles.css";
import axios from "axios";

export interface SelectNodeWidgetAdvancedProps {
	node: SelectNode;
	engine: DiagramEngine;
}

const SelectNodeWidget : FC<SelectNodeWidgetAdvancedProps> = ({ engine, node}) => {

	const [modalOpened, setModalOpened] = useState(false);
	const [data, setData] = useState([]); // NULL
	const [isFirstRender, setIsFirstRender] = useState(true);
	const [sqlChanged, setSqlChanged] = useState(false);

	const handleOpen = () => {
		setModalOpened(true);
	};

	const handleClose = () => {
		setModalOpened(false);
	};

	const handleFlowAttrInfoChange = (newFlowAttrInfo : FlowAttr) => {
		// node.flowAttrInfo = newFlowAttrInfo;
		node.setFlowAttr(newFlowAttrInfo);
		setSqlChanged(!sqlChanged);
	}

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
					const response = await axios.post("/diagram/project/savenode/19",
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
		<div className="select">
			<S.Widget>
				<S.OutPort
					port={node.outPort}
					engine={engine}
					style={{ right: -4, top: "50%" }}
				/>
				<Container>
					<IconButton onClick={handleOpen}><StorageIcon fontSize="large" /></IconButton>
					{modalOpened && (
						<ModalPortal closePortal={handleClose} flag={"select"}>
							<SelectModal flowAttrInfo={node.flowAttrInfo} onFlowAttrInfoChange={handleFlowAttrInfoChange}/>
						</ModalPortal>
					)}
				</Container>
			</S.Widget>
			<div id="select-modal"></div>
		</div>
	);
};

export default SelectNodeWidget;
