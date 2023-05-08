import React, {FC, useRef, useState, useEffect} from "react";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import {SqlNodeModel} from "./SqlNodeModel";

import {Container} from "@mui/material";
import StorageIcon from '@mui/icons-material/Storage';
import * as S from "../../adstyled";
import SelectModal2 from "../modal/SelectModal2";



interface SqlNodeWidgetAdvancedProps {
    node: SqlNodeModel;
    engine: DiagramEngine;
}

const SqlNodeWidget : FC<SqlNodeWidgetAdvancedProps> = ({engine, node}) => {
    const [onModal, setOnModal] = useState(false);
    const [sql, setSql] = useState(null);

    const handleModalOpen = () => {
        setOnModal(true);
    }   

    const handleContextMenu = (event: any) => {
        event.preventDefault();
        alert('context');
    }

    return (
        <div className="select" onDoubleClick={handleModalOpen} onContextMenu={handleContextMenu}>
            <S.Widget>
                <S.OutPort
                    port={node.outPort}
                    engine={engine}
                    style={{ right: -4, top: "50%" }}
                />
                <Container>
                    <StorageIcon fontSize="large"/>
                </Container>
            </S.Widget>
            {onModal && <SelectModal2 prog_work_Flow_mng={node.prog_work_Flow_mng}/>}
            
        </div>
        
    );
};

export default SqlNodeWidget;
