import {Container, Typography, Button, Select, MenuItem, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

import '../../App.css';
import styled from "@emotion/styled";
import { 
    DataGrid, 
    GridColDef, 
    GridRowsProp,
} from '@mui/x-data-grid';
import EditableDataGrid from "./Datagrid";
import axios from "axios";

export const Modal = styled.div`
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.2);
    margin-top: 10px;
    background: #fff;
    width: 600px;
    border-radius: 12px;
    position: relative;
    padding: 8px;
    box-sizing: border-box;
    text-align: center;
    align-items: center;
    justify-content: space-between;
	`;

export const ButtonBox = styled.div`
    margin-top: 15px;
`;

const options = ['INSERT', 'CSV'];

export interface SaveModalProps {
    dataSet: any;
    curType: string;
    curRows: any;
    curAttr: any;
    prog_work_Flow_mng: any;
    setOnModal: (state: boolean) => void;
    setCurType: (type: string) => void;
    setCurRows: (data: any) => void;
    setCurAttr: (data: any) => void;
}

// hard codded  
const fields = ["LOG_DATE", "LOG_TIME", "LOG_USER_ID", "LOG_PAY_ACC"];
const filter_test_data = [
    {
    "LOG_DATE": "2023-04-25",
    "LOG_TIME": "15:30:00",
    "LOG_USER_ID": "user123",
    "LOG_PAY_ACC": 12345
    },
    {
    "LOG_DATE": "2023-04-24",
    "LOG_TIME": "14:25:00",
    "LOG_USER_ID": "user456",
    "LOG_PAY_ACC": 67890
    }
  ];

const SaveModal: React.FC<SaveModalProps> = (props: SaveModalProps) => {
    const [tables, setTables] = useState(['']);

    const handleSave = () => {
        var updatedProgWorkFlow = null;

        props.curRows.forEach((row: any) => {
            var newProperties: string[] = [];
            var tableFieldName = row["tableFieldName"];

            for (const key in row) {
                newProperties.push(row[key]);
            }

            const updatedFlowAttr = { ...props.prog_work_Flow_mng.flow_attr, [tableFieldName] : newProperties};

            updatedProgWorkFlow = { ...props.prog_work_Flow_mng, flow_attr: updatedFlowAttr };
            console.log(updatedProgWorkFlow)
            props.setCurAttr(updatedProgWorkFlow)
        });
            
        alert("save");
    };

    const handleType = (event: React.ChangeEvent, value: string) => {
        switch(props.curType){
            case 'INSERT':
                props.setCurType('insert');
                console.log('insert');
                break;
            case 'CSV':
                props.setCurType('csv');
                console.log('csv');
                break;
        }
    };

    const handleTable = (event: any, value: string) => {
        console.log('handle table');
    }

    return (
        <Modal>
            <Container>
                <Typography>OUTPUT</Typography>
                <div style={{
                    overflow: 'hidden',
                    marginTop: '10px'
                }}>
                    <Grid container spacing={2} >
                        <Grid item xs={2} alignItems="center">
                            <Typography style={{ 
                                display: "flex", 
                                alignItems: "center", 
                                height: "100%" ,
                                justifyContent: "center"
                            }}>유형</Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <Select
                                fullWidth
                                value={props.curType}
                                onChange={(e) => props.setCurType(e.target.value)}
                            >
                                {options.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                </div>
                <div style={{
                    overflow: 'hidden',
                    marginTop: '10px'
                }}>
                <Grid container spacing={2}>
                <Grid item xs={2} alignItems="center">
                            <Typography style={{ 
                                display: "flex", 
                                alignItems: "center", 
                                height: "100%" ,
                                justifyContent: "center"
                            }}>테이블</Typography>
                        </Grid>
                    <Grid item xs={10}>
                        <Select
                            fullWidth
                            value={''}
                            onChange={(e) => handleTable(e, e.target.value)}
                        >
                            {tables.map((table) => (
                                <MenuItem key={table} value={table}>
                                    {table}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                </Grid>
                </div>
                <div style={{ 
                    height: 300, 
                    width: '100%' ,
                    marginTop: '10px'
                }}>
                    <EditableDataGrid rows={props.curRows} setCurRows={props.setCurRows}/>
                </div>
                <ButtonBox style={{ 
                    marginTop: '10px', 
                    overflow: 'hidden'
                }}>
                    <Button 
                    style={{
                        float: 'right'
                    }}
                    onClick={() => props.setOnModal(false)} variant="text">닫기</Button>
                    <Button 
                    style={{
                        float: 'right'
                    }}
                    onClick={handleSave} variant="contained">저장</Button>
                </ButtonBox>
            </Container>
        </Modal>
        
    );
};

export default SaveModal;