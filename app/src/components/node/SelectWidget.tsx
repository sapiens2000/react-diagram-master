import React, {FC, useRef, useState, useEffect} from "react";
import { DiagramEngine } from "@projectstorm/react-diagrams";
import {SelectNode} from "./SelectNode";

import {Container, IconButton, Typography} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ModalPortal from "../modal/ModalPortal";
import SelectModal2 from "../modal/SelectModal2";

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

    const handleOpen = () => {
        setModalOpened(true);
    };

    const handleClose = () => {
        setModalOpened(false);
    };

    useEffect(() => {
        console.log('node.flow_attr has changed:', node.prog_work_Flow_mng.flow_attr);
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/data', {
                    params: {
                        prog_work_Flow_mng : node.prog_work_Flow_mng
                    }
                });
                console.log('Response data:', response.data);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [node.prog_work_Flow_mng.flow_attr]);

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
                            <SelectModal2 prog_work_Flow_mng={node.prog_work_Flow_mng}/>
                        </ModalPortal>
                    )}
                </Container>
            </S.Widget>
            <div id="select-modal"></div>
        </div>
    );
};

export default SelectNodeWidget;
