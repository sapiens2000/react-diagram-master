import {Container, Typography, Button,
        TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Autocomplete, TextField, Select, MenuItem, Grid } from "@mui/material";
import {Box} from "@mui/system";

import React, { useCallback, useEffect, useState } from "react";

import '../../App.css';
import styled from "@emotion/styled";
import axios from "axios";
import { 
    DataGrid, 
    GridColDef, 
    GridRowsProp,
    GridValueGetterParams,
    GridValueSetterParams,
} from '@mui/x-data-grid';

import { createStrictEquality } from "typescript";

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


const options = ['INSERT', 'SAVE', 'UPDATE', 'DELETE'];


export interface SaveModalProps {
    dataSet: any;
    setOnModal: (state: boolean) => void;
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
    {
      field: 'control',
      headerName: '관리',
      width: 180,
      editable: true,
    },
  ];

const SaveModal: React.FC<SaveModalProps> = (props: SaveModalProps) => {
    const [curType, setCurType] = useState('');
    const [tables, setTables] = useState(['']);


   
    const createSql = () => {
        let sql = curType;

        switch(curType){
            case 'INSERT':
                console.log(sql + ' INTO VALUES(');
                break;
        }
    }

    const handleClickSubmit = () => {
        createSql();
        props.setOnModal(false);
    }

    const handleType = (event: React.ChangeEvent, value: string) => {
        setCurType(value);
    
        switch(curType){
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

    const handleTable = (event: React.ChangeEvent, value: string) => {
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
                                value={curType}
                                onChange={(e) => setCurType(e.target.value)}
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
                            value={curType}
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
                    <DataGrid rows={rows2} columns={columns} />
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
                    onClick={handleClickSubmit} variant="contained">저장</Button>
                </ButtonBox>
            </Container>
        </Modal>
        
    );
};

export default SaveModal;

// test data
const rows2: GridRowsProp = [
  {
    id: 1,
    tableFieldName: '테스트필드',
    type: '테스트',
    mappingField: '테스트필드',
    defaultValue: '테스트',
    control: '테스트'
  }
];

const filter_data = [
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
  ]


/* function getFullName(params: GridValueGetterParams) {
  return `${params.row.firstName || ''} ${params.row.lastName || ''}`;
}

function setFullName(params: GridValueSetterParams) {
  const [firstName, lastName] = params.value!.toString().split(' ');
  return { ...params.row, firstName, lastName };
}

function parseFullName(value: any) {
  return String(value)
    .split(' ')
    .map((str) => (str.length > 0 ? str[0].toUpperCase() + str.slice(1) : ''))
    .join(' '); */


// const columns: GridColDef[] = [
//   { field: 'firstName', headerName: 'First name', width: 130, editable: true },
//   { field: 'lastName', headerName: 'Last name', width: 130, editable: true },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     width: 160,
//     editable: true,
//     valueGetter: getFullName,
//     valueSetter: setFullName,
//     valueParser: parseFullName,
//   },
// ];

/* const defaultRows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon' },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei' },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime' },
  { id: 4, lastName: 'Stark', firstName: 'Arya' },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys' },
]; */
