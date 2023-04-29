import React, {FC, useState} from "react";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import {SaveNode} from "./SaveNodeModel";

import {Container} from "@mui/material";
import SaveModal from "../modal/SaveModal";
import * as S from "../../adstyled";
import EastIcon from '@mui/icons-material/East';


export interface SaveNodeWidgetProps {
    node: SaveNode;
    engine: DiagramEngine;
}

const SaveNodeWidget : FC<SaveNodeWidgetProps> = ({engine, node}) => {
    const [onModal, setOnModal] = useState(false);
    const [curType, setCurType] = useState('');

    const handleModalOpen = () => {
        setOnModal(true);
    }   

    return (
        <div className="save" onDoubleClick={handleModalOpen}>
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
            {onModal && <SaveModal dataSet={null} setOnModal={setOnModal} curType={curType} setCurType={setCurType}/>}
        </div>
    );
}

export default SaveNodeWidget;