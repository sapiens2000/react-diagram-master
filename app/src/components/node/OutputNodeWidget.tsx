import React, {FC, useEffect, useState} from "react";
import {DiagramEngine } from "@projectstorm/react-diagrams";
import {OutputNodeModel} from "./OutputNodeModel";
import { Container} from "@mui/material";
import OutputModal from "../modal/OutputModal";
import * as S from "../../adstyled";
import EastIcon from '@mui/icons-material/East';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ContextLock, ContextCopy, ContextDelete } from "./ContextMenuOptions";

export interface OutputNodeWidgetProps {
    node: OutputNodeModel;
    engine: DiagramEngine;
}

const OutputNodeWidget : FC<OutputNodeWidgetProps> = ({engine, node}) => {
    const [onModal, setOnModal] = useState(false);
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
      } | null>(null);
    
    useEffect(() => {
    //   const fetchData = async () => {
		// 		try {
		// 			const response =
		// 				await axios.post(`/diagram/project/update-node/${node.progWorkFlowMng.progId}/${node.progWorkFlowMng.flowId}`
		// 					, node.progWorkFlowMng, {maxRedirects: 0});
		// 			console.log("Response data:", response.data);
		// 		} catch (error) {
		// 			console.error("Error fetching data:", error);
		// 		}
		// 	};
		// 	fetchData();
      console.log('output render')
    }, []);

    
    if(node.selectFlowAttr.col.length == 0){
      node.refresh();
      console.log(node.selectFlowAttr.col);
    }

    const handleModalOpen = () => {
        setOnModal(true);
    }

    const handleContextClose = () => {
      setContextMenu(null)
    }

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
              ? {
                  mouseX: event.clientX + 2,
                  mouseY: event.clientY - 6,
                }
              :
                null,
          );
        };

    const renderModal = () => {
        return (
          <OutputModal
            progWorkFlowMng={node.progWorkFlowMng}
            setOnModal={setOnModal}
            selectFieldNames={node.selectFlowAttr.col}
            gridRows={node.gridRows}
            setGridRows={node.setGridRows}
          />
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

	return (
        <div className="output"
        onDoubleClick={handleModalOpen}
        onContextMenu={handleContextMenu}>
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
        </div>
    );
}

export default OutputNodeWidget;
