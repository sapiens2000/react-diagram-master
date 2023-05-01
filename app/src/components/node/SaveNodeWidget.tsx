import React, {FC, useState} from "react";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import {SaveNode} from "./SaveNodeModel";

import {Container} from "@mui/material";
import SaveModal from "../modal/SaveModal";
import * as S from "../../adstyled";
import EastIcon from '@mui/icons-material/East';
import { GridRowsProp } from "@mui/x-data-grid";


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
    const [curType, setCurType] = useState('');
    const [curRows, setCurRows] = useState(rows);
    const [curAttr, setCurAttr] = useState(node.prog_work_Flow);

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
            {onModal && <SaveModal dataSet={null}
            prog_work_Flow_mng={node.prog_work_Flow}
            setOnModal={setOnModal}
            curType={curType}
            setCurType={setCurType}
            setCurRows={setCurRows} 
            curRows={curRows}
            curAttr={curAttr}
            setCurAttr={setCurAttr}
            />}
        </div>
    );
}

export default SaveNodeWidget;