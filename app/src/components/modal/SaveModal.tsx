import {Container, Typography, Button,
        TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Autocomplete, TextField } from "@mui/material";
import {Box} from "@mui/system";
import React, { useEffect, useState } from "react";
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

const options = ['INSERT', 'SAVE'];

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
    const [curType, setCurType] = useState('INSERT');
    const [table, setTable] = useState([]);

    useEffect(() => {
        axios
            .get(
                "http://localhost:5000/test"
            )
            .then((response) => {
                setTable(response.data);
                console.log(table);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

/*     const country = [...new Set(data.map((item) => item.country))];
    

    const handleCountry = (event, value) => {
        let states = data.filter((state) => state.country === value);
        states = [...new Set(states.map((item) => item.name))];
        states.sort();

        setTable(value);
        //setColumn(states);
    }; */

    const handleClickSubmit = () => {
        alert('저장');
        console.log(curType)
        props.setOnModal(false);
    }

    const handleType = (event: React.ChangeEvent, value: string) => {
        setCurType(value);
        console.log(curType);
    }

    const handleTable = (event: React.ChangeEvent, value: string) => {
        console.log('handle table');
    }

    return (
        <Modal>
            <Container>
                <Typography>유형</Typography>
                <Autocomplete
                        onChange={(event, value) => handleType(event, value)}
                        id="type"
                        //getOptionLabel={(options) => `${options}`}
                        options={options}
                        noOptionsText={"No Available Type"}
                        renderOption={(props, options) => (
                            <Box component="li" {...props} key={options} value={curType}>
                                {options}
                            </Box>
                        )}
                        renderInput={(params) => <TextField {...params}/>}
                />

                <Typography>테이블</Typography>
                <Autocomplete
                        onChange={(event, value) => handleTable(event, value)}
                        id="table"
                        getOptionLabel={(table) => `${table}`}
                        options={table}
                        noOptionsText={"No Available Table"}
                        renderOption={(props, options) => (
                            <Box component="li" {...props} value={table}>
                                {}
                            </Box>
                        )}
                        renderInput={(params) => <TextField {...params}/>}
                />
                <div style={{ 
                    height: 300, 
                    width: '100%' ,
                    marginTop: '10px'
                }}>
                    <DataGrid rows={rows2} columns={columns} />
                </div>
                <ButtonBox style={{ 
                    marginTop: '10px' 
                }}>
                    <Button onClick={handleClickSubmit} variant="contained">저장</Button>
                    <Button onClick={() => props.setOnModal(false)} variant="text">닫기</Button>
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
