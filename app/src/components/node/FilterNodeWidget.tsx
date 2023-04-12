import React, {FC, useState} from "react";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import {FilterNode} from "./FilterNode";

import {Container, Button, IconButton, Typography} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';

import ModalPortal from "../modal/ModalPortal";
import FilterModal from "../modal/FilterModal";
import * as S from "../../adstyled";
import "../../styles.css";

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
                    <Typography>FILTER</Typography>
                    <IconButton onClick={handleOpen}><SettingsIcon /></IconButton>
                    {modalOpened && (
                        <ModalPortal closePortal={handleClose} flag={"filter"}>
                            <FilterModal dataSet={node.dataSet}/>
                        </ModalPortal>
                    )}
                </Container>
            </S.Widget>
            <div id="filter-modal"></div>
        </div>
    );
}

export default FilterNodeWidget;