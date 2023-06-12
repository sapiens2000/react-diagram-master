'use strict'
import {Container, Typography, Button, Select, MenuItem, Grid,SelectChangeEvent } from "@mui/material";
import React, { useEffect, useState } from "react";

import '../../App.css';
import styled from "@emotion/styled";
import axios from "axios";
import CustomDataGrid from "./Datagrid";
import { RowField } from "../node/OutputNodeModel";

const options = ['insert', 'update', 'delete', 'csv'];

export interface OutputModalProps {
    progWorkFlowMng: any;
    setOnModal: (state: boolean) => void;
    selectFieldNames: string[];
    gridRows: any;
    setGridRows: (newRows: any) => void;
    savedFieldStates: any;
}

const OutputModal: React.FC<OutputModalProps> = (props: OutputModalProps) => {
    const [curType, setCurType] = useState('');
    const [curGridRows, setCurGridRows] = useState([]);
    const [curTargetTable, setCurTargetTable] = useState('');
    const [targetTableList, setTargetTableList] = useState([]);
    const [targetTableCols, setTargetTableCols] = useState([]);
    const [targetMappingFields, setTargetMappingFields] = useState({});
    const [selectMappingFields, setSelectMappingFields] = useState([]);
    const [pk, setPk] = useState([]);
    const [selectFieldNames, setSelectFieldNames] = useState([]);

    const generateGridRows = (TargetTableColNames: string[]): RowField[] => {
        return TargetTableColNames.map((fieldName, index) => {
            return {
                id: index,
                tableFieldName: fieldName,
                mappingField: '',
                defaultValue: '',
            };
        });
    };

    async function getTargetTables() {
        try {
          const response = await axios.get('/diagram/project/get-tables');
          const data = response.data;
          setTargetTableList(data); 
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    }

    const getTargetTableCols = async (table: string) => {
        try {
        const response = await axios.get(`/diagram/project/${table}`);
        const data = response.data;
        setTargetTableCols(data);
        } catch (error) {
        console.log(error);
        }
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                await getTargetTables(); 

                // if(props.gridRows.length === 0){
                //     var tmp_rows = generateGridRows(selectFieldNames)
                //     setCurGridRows([...tmp_rows]);
                // }else{
                //     setCurGridRows(props.gridRows);
                // }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();  
        //saved 
        if(Object.keys(props.progWorkFlowMng.flowAttr).length !== 0){
            let tmp_flowAttr = JSON.parse(props.progWorkFlowMng.flowAttr)
            setCurTargetTable(tmp_flowAttr.table_name)
            setCurType(tmp_flowAttr.type)
            getTargetTableCols(tmp_flowAttr.table_name); 
            setCurGridRows([...props.gridRows])

            let json_mappingFields = (
                tmp_flowAttr.col_info.reduce((result: any, value: any, index: any) => {
                  result[index] = value;
                  return result;
                }, {}))
            setTargetMappingFields(json_mappingFields);
        }else{
            setCurTargetTable("")
            setCurType("insert");
            setSelectFieldNames(props.selectFieldNames)
            var tmp_rows = generateGridRows(selectFieldNames)
            setCurGridRows([...tmp_rows]);
            
            props.gridRows.splice(0)
            tmp_rows.forEach((row: RowField) => {
                props.gridRows.push(row);
            })           
        }
	}, []);

    const handleSave = () => {
        var curFlowAttr: {
            [key: string]: any;
        } = {};
        
        curFlowAttr['type'] = curType; 
        curFlowAttr['pk'] = pk.flatMap(([field, mappingField]) => [field, mappingField]);
        curFlowAttr['table_name'] = curTargetTable;
        curFlowAttr['col_info'] = [...Object.values(targetMappingFields)]

        curFlowAttr.col_info.forEach((value: string, index: number) => {
              const { tableFieldName , mappingField, defaultValue } = curGridRows[index];
              curGridRows[index].mappingField = value
              if (tableFieldName !== '') {
                curFlowAttr[mappingField] = [defaultValue, tableFieldName];
              } else {
                curFlowAttr[mappingField] = [defaultValue, ''];
              }
            });

        props.gridRows.splice(0)
        curGridRows.forEach((row: RowField) => {
            props.gridRows.push(row);
        })
        
        console.log(props.gridRows)
        props.progWorkFlowMng.flowAttr = JSON.stringify(curFlowAttr)

        const UpdateNode = async () => {
            try {
                const response =
                    await axios.post(`/diagram/project/update-node/${props.progWorkFlowMng.progId}/${props.progWorkFlowMng.flowId}`
                        , props.progWorkFlowMng, {maxRedirects: 0});
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        console.log(props.progWorkFlowMng)
        UpdateNode();
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
    };

    useEffect(() => {
        const fetchTableCols = async () => {
            try {
                const response = await axios.get(`/diagram/project/${curTargetTable}`);
                const data = response.data;
                setTargetTableCols(data);

                if(props.gridRows.length === 0){
                    var tmp_rows = generateGridRows(selectFieldNames)
                    setCurGridRows([...tmp_rows]);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchTableCols();
    }, [curTargetTable])

    const handleTable = (value: string) => {
        console.log('change target table')
        setCurTargetTable(value);
    };

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
                            value={curTargetTable}
                            onChange={(e) => handleTable(e.target.value)}
                        >
                            {targetTableList.map((table) => (
                                <MenuItem key={table} value={table}>
                                    {table}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                </Grid>
                </div>
                {curType !== 'CSV' && (
                    <div style={{
                    height: 300,
                    width: '100%',
                    marginTop: '10px'
                    }}>
                    <CustomDataGrid
                            gridRows={curGridRows}
                            setGridRows={setCurGridRows}
                            filteredTableCols={targetTableCols}
                            targetTableCols={targetTableCols}
                            targetMappingFields={targetMappingFields}
                            setTargetMappingFields={setTargetMappingFields} 
                            selectFieldNames={selectFieldNames}
                            pk={pk}
                            setPk={setPk}
                    />
                    </div>
                )}
                {curType === 'csv' && (
                    <div>

                    </div>
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