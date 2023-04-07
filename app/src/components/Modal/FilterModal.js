import {Autocomplete, Container, TextField, Typography, Button} from "@mui/material";
import {Box} from "@mui/system";
import React, {useState} from "react";

const op = ["Between", "Like", "Equal"];

const FilterModal = ({dataSet}) => {

    const [getOp, setOp] = useState('');
    const [getCond, setCond] = useState('');

    console.log(dataSet);

    const handleOp = (event, value) => {
        setOp(value);
    };
    const handleCond = (event) => {
        setCond(event.target.value);
    };
    const handleClickSubmit = () => {
        dataSet.op = getOp
        dataSet.cond = getCond
        alert("save");
        console.log("submit");
    };

    return (
        <div>
            <Container>
                <Typography>OPERATOR</Typography>
                <Autocomplete
                    onChange={(event, value) => handleOp(event, value)}
                    id="operator"
                    getOptionLabel={(op) => `${op}`}
                    options={op}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    noOptionsText={"No Available Data"}
                    defaultValue={dataSet.op}
                    renderOption={(props, op) => (
                        <Box component="li" {...props} key={op} value={getOp}>
                            {op}
                        </Box>
                    )}
                    renderInput={(params) => <TextField {...params} label={"Op"}/>}
                />
                <br/>
                <Typography>CONDITION</Typography>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '& > :not(style)': { m:0 },
                    }}
                >
                    <TextField
                        helperText="B: 최소 최대 | E/L: 문자"
                        id="demo-helper-text-misaligned"
                        label="Condition"
                        defaultValue={dataSet.cond}
                        required
                        onChange={handleCond}
                    />
                </Box>
                <br/>
                <div>
                    <Button onClick={handleClickSubmit} variant="contained">확인</Button>
                </div>
            </Container>
        </div>
    );
};

export default FilterModal;
