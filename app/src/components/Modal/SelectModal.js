import {Autocomplete, Container, TextField, Typography, Button} from "@mui/material";
import {Box} from "@mui/system";
import React, {useEffect, useState} from "react";
import axios from "axios";

const SelectModal = ({dataSet}) => {
    const [data, setData] = useState([]);
    const [getTable, setTable] = useState([]);
    const [getColumn, setColumn] = useState([]);

    const handleClickSubmit = () => {
        dataSet.table = getTable;
        dataSet.column = getColumn;
        dataSet.value = getColumn;
        console.log("submit");
    };

    // DB에서 끌어다 쓰자
    useEffect(() => {
        axios
            .get(
                "https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json"
            )
            .then((response) => {
                console.log(response)
                setData(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const country = [...new Set(data.map((item) => item.country))];

    const handleCountry = (event, value) => {
        let states = data.filter((state) => state.country === value);
        states = [...new Set(states.map((item) => item.name))];
        states.sort();

        setTable(value);
        setColumn(states);
    };

    return (
        <div>
            <Container>
                <Typography>FROM</Typography>
                <Autocomplete
                    onChange={(event, value) => handleCountry(event, value)}
                    id="table"
                    getOptionLabel={(country) => `${country}`}
                    options={country}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    noOptionsText={"No Available Data"}
                    defaultValue={dataSet.table}
                    renderOption={(props, country) => (
                        <Box component="li" {...props} key={country} value={getTable}>
                            {country}
                        </Box>
                    )}
                    renderInput={(params) => <TextField {...params} label={"Table"}/>}
                />
                <br/>
                <Typography>SELECT</Typography>
                <Autocomplete
                    id="column"
                    getOptionLabel={(getColumn) => `${getColumn}`}
                    options={getColumn}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    noOptionsText={"No Available User"}
                    defaultValue={dataSet.column}
                    renderOption={(props, getColumn) => (
                        <Box component="li" {...props} key={getColumn}>
                            {getColumn}
                        </Box>
                    )}
                    renderInput={(params) => <TextField {...params} label="Column" />}
                />
                <br/>
                <div>
                    <Button onClick={handleClickSubmit} variant="contained">확인</Button>
                </div>
            </Container>
        </div>
    );
};

export default SelectModal;
