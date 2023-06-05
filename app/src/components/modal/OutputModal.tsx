import {Container, Typography, Button, Select, MenuItem, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, SelectChangeEvent } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

import '../../App.css';
import styled from "@emotion/styled";
import axios from "axios";
import InsertDataGrid from "./Datagrid";


export const Modal = styled.div`
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.2);
    margin-top: 10px;
    background: #fff;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    border-radius: 12px;
    position: relative;
    padding: 8px;
    box-sizing: border-box;
    text-align: center;
`;

export const ButtonBox = styled.div`
    margin-top: 15px;
`;

const options = ['insert', 'update', 'delete', 'csv'];

export interface OutputModalProps {
    //flowAttrInfo: any;
    progWorkFlowMng: any;
    gridRows: any;
    setOnModal: (state: boolean) => void;
}

const OutputModal: React.FC<OutputModalProps> = (props: OutputModalProps) => {
    const [curType, setCurType] = useState('');
    const [gridRows, setGridRows] = useState(props.gridRows);
    const [curTable, setCurTable] = useState(props.progWorkFlowMng.flowAttr.tableName);
    const [tables, setTables] = useState([]);
    const [tableCols, setTableCols] = useState([]);
    const [rowMappingValues, setRowMappingValues] = useState(props.progWorkFlowMng.flowAttr.col_info);
    const [pk, setPk] = useState({});

    async function getTables() {
        console.log('fetch tables')
        try {
          const response = await axios.get('/diagram/project/get-tables');
          const data = response.data;
          setTables(data); 
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        getTables();
        const getTableCols = async() => await axios.get(`/diagram/project/${curTable}`)
        .then(response => {
            console.log(response.data);
            
            setTableCols(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
        setCurType(props.progWorkFlowMng.flowAttr.type);
        getTableCols();
        
	}, []);

    const handleSave = () => {
        const transformedData: { [key: string]: string | any[]} = {};
        let rows: any[] = [...gridRows];

        transformedData['type'] = curType;
        transformedData['tableName'] = curTable;

        let tmp_col_info: any[]= [];

        rows.map((row: any, index: number) => {
            const { tableFieldName, type, defaultValue } = row;
            const mappingValue = rowMappingValues[index+1]; 
            const finalMappingValue = mappingValue !== undefined ? mappingValue : ''; 
            tmp_col_info[tableFieldName] = [type, finalMappingValue, defaultValue];
            return null;
          });
        

          transformedData['col_info'] = tmp_col_info;

          const transformedPk: { [key: string]: string } = {};
          Object.keys(pk).forEach((index) => {
            if (pk[index as keyof typeof pk]) {
              transformedPk[index] = tmp_col_info[index as keyof typeof tmp_col_info];
            } else {
              transformedPk[index] = '';
            }
          });
          
          props.progWorkFlowMng.flowAttr = {
            ...transformedData,
            pk: transformedPk,
          };
          

          
        console.log(props.progWorkFlowMng.flowAttr)

        alert("save");
    };

    const handleType = (event: SelectChangeEvent, value: string) => {
        switch(value){
            case 'insert':
                setCurType('insert');
                break;
            case 'update':
                setCurType('update');
                break;
            case 'delete':
                setCurType('delete')
                break;
            case 'csv':
                setCurType('csv');
                break;
        }
        props.progWorkFlowMng.flowAttr.type = value
    };

    const handleTable = (event: any, value: string) => {
        setCurTable(value);
        props.progWorkFlowMng.flowAttr.tableName = value;
        const getTableCols = async() => await axios.get(`/diagram/project/${value}`)
        .then(response => {
            console.log(response.data);
            setTableCols(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
        getTableCols();
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
                                value={curType}
                                onChange={(e) => handleType(e, e.target.value)}
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
                            value={curTable}
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
                {curType === 'insert' && (
                    <div style={{
                    height: 300,
                    width: '100%',
                    marginTop: '10px'
                    }}>
                    <InsertDataGrid
                            gridRows={gridRows}
                            setGridRows={setGridRows}
                            tableCols={tableCols}
                            rowMappingValues={rowMappingValues}
                            setRowMappingValues={setRowMappingValues} 
                            pk={pk}
                            setPk={setPk}/>
                    </div>
                )}
                {curType === 'csv' && (
                    <div></div>
                )}
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

export default OutputModal;