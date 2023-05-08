import React, {FC, useState} from "react";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import {FilterNode} from "./FilterNode";

import {Container, Button, IconButton, Typography} from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ModalPortal from "../modal/ModalPortal";
import * as S from "../../adstyled";
import "../../styles.css";
import FilterModal2 from "../modal/FilterModal2";

export interface FilterNodeWidgetProps {
    node: FilterNode;
    engine: DiagramEngine;
}

const FilterNodeWidget : FC<FilterNodeWidgetProps> = ({engine, node}) => {

    const [modalOpened, setModalOpened] = useState(false);

    node.refresh();

    const handleOpen = () => {
        setModalOpened(true);
    };

    const handleClose = () => {
        setModalOpened(false);
    };

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
                            <FilterModal2 dataSet={node.dataSet}/>
                        </ModalPortal>
                    )}
                </Container>
            </S.Widget>
            <div id="filter-modal"></div>
        </div>
    );
}

export default FilterNodeWidget;