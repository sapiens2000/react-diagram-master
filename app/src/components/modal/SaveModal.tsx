import {Container, Typography, Button, Select, MenuItem, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

import '../../App.css';
import styled from "@emotion/styled";
import { 
    DataGrid, 
    GridColDef, 
    GridRowsProp,
} from '@mui/x-data-grid';

export const Modal = styled.div`
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.2);
    margin-top: 10px;
    background: #fff;
    width: 1000px;
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
    setOnModal: (state: boolean) => void;
    curType: string;
    setCurType: (type: string) => void;
}

const columns: GridColDef[] = [
    { 
      field: 'tableFieldName', 
      headerName: '테이블 필드명', 
      width: 220, 
      editable: false 
    },
    { 
      field: 'type', 
      headerName: '유형', 
      editable: true 
    },
    {
      field: 'mappingField',
      headerName: '매핑 필드',
      width: 220,
      editable: true,
    },
    {
      field: 'defaultValue',
      headerName: '기본값',
      width: 200,
      editable: true,
    },
  ];


const rows: GridRowsProp = [
    {
      id: 1,
      tableFieldName: '테스트필드',
      type: '테스트',
      mappingField: '테스트필드',
      defaultValue: '테스트',
    }
  ];
  
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
    const fields = ["LOG_DATE", "LOG_TIME", "LOG_USER_ID", "LOG_PAY_ACC"];

    const handleSaveChanges = () => {
        console.log(props.curType);
        props.setOnModal(false);
    }

    const handleEditCellChange = (params: any) => {
        const updatedRows = [...rows];
        updatedRows[params.id] = {
        ...updatedRows[params.id],
        [params.field]: params.value,
        };
        // console.log(updatedRows)
    }

    const handleType = (event: React.ChangeEvent, value: string) => {

        switch(props.curType){
            case 'INSERT':
                console.log('insert');
                break;
            case 'SAVE':
                console.log('save');
                break;
            case 'UPDATE':
                console.log('update');
                break;
            case 'DELETE':
                console.log('delete');
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
                    <DataGrid 
                    rows={rows} 
                    columns={columns} 
                    onCellEditStop={handleEditCellChange}
                    />
                </div>
                {/* <TableContainer
                component={Paper}
                style={{ maxHeight: "267px", overflow: "auto", marginTop: "16px" }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>테이블 필드명</TableCell>
                                <TableCell>조건</TableCell>
                                <TableCell>필터값</TableCell>
                                <TableCell>메모</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fields.map((field, index) => (
                                <TableRow
                                    key={field}
                                    onClick={() => {
                                        //setSelectedField(field);                                        
                                        //handleRowClick(index);
                                    }}
                                >
                                    <TableCell>{field}<
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer> */}

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
                    onClick={handleSaveChanges} variant="contained">저장</Button>
                </ButtonBox>
            </Container>
        </Modal>
        
    );
};

export default SaveModal;