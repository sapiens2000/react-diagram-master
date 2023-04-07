import {Container, Typography, Button,
        TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import {Box} from "@mui/system";
import React, {useState} from "react";
import { CSVLink, CSVDownload} from "react-csv";
import moment from 'moment';

interface tableProps {
    country?: string;
}

const headers = [
    { label : 'Country', key: 'country'}
];

const SaveModal = ({dataSet}) => {
    const countryData =
        dataSet.value.map((a) => {
            const data: tableProps = {};

           data.country = a;

            return data;
        });

    const handleClickSubmit = () => {
        if (confirm('csv파일을 다운로드 받겠습니까?')) {
            alert("save");
            console.log("submit");
            return true;
        } else {
            return false;
        }
    };

    console.log("conuntryData :" + countryData);

    return (
        <div>
            <Container>
                <Typography>PREVIEW</Typography>
                <Box
                    sx={{
                        width: 200,
                        height: 300,
                        overflowY: 'scroll',
                        border: '1px solid lightgrey',
                        borderRadius: '5px',
                        padding: '10px',
                    }}
                >
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {headers.map((header) => (
                                        <TableCell key={header.key} sx={{ background: 'lightgrey'}}>
                                            {header.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {countryData.map((data, index) => (
                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>{data.country}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <br/>
                <CSVLink
                    style={{ textDecoration: 'none'}}
                    data={countryData}
                    headers={headers}
                    filename={`테스트 데이터_${moment().format('YYYYMMDD')}`}
                >
                    <Button onClick={handleClickSubmit} variant="contained">저장</Button>
                </CSVLink>
            </Container>
        </div>
    );
};

export default SaveModal;
