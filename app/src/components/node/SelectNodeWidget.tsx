import React, {FC, useRef, useState, useEffect} from "react";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import {SelectNodeModel} from "./SelectNodeModel";

import {Container, IconButton, Typography} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ModalPortal from "../Modal/ModalPortal";
import SelectModal from "../Modal/SelectModal";
import * as S from "../../adstyled";
//import "../../styles.css";

export interface SelectNodeWidgetAdvancedProps {
    node: SelectNodeModel;
    engine: DiagramEngine;
}

const SelectNodeWidget : FC<SelectNodeWidgetAdvancedProps> = ({ engine, node}) => {
    const [modalOpened, setModalOpened] = useState(false);

    const handleOpen = () => {
        setModalOpened(true);
    };

    const handleClose = () => {
        setModalOpened(false);
    };

    return (
        <div className="select">
            <S.Widget>
                <S.OutPort
                    port={node.outPort}
                    engine={engine}
                    style={{ right: -4, top: "50%" }}
                />
                <Container>
                    <Typography>SELECT</Typography>
                    <IconButton onClick={handleOpen}><SettingsIcon /></IconButton>
                    {modalOpened && (
                        <ModalPortal closePortal={handleClose} flag={"select"}>
                            <SelectModal dataSet={node.dataSet}/>
                        </ModalPortal>
                    )}
                </Container>
            </S.Widget>
            <div id="select-modal"></div>
        </div>
    );
};

export default SelectNodeWidget;
