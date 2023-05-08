import {
    Container,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Select,
    MenuItem,
    Grid,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";

const FilterModal2 = ({ dataSet }) => {
    const fields = ["LOG_DATE", "LOG_TIME", "LOG_USER_ID", "LOG_PAY_ACC"];
    // >> node.flow_attr.column_info
    const conditions = [">", "<", ">=", "<=", "=", "LIKE", "IN", "NOT LIKE"];

    const initialFieldState = fields.reduce((acc, field) => {
        acc[field] = { condition: "", filterValue: "", memo: "" };
        return acc;
    }, {});

    const [selectedField, setSelectedField] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [memo, setMemo] = useState("");
    const [highlightedRowIndex, setHighlightedRowIndex] = useState(null);
    const [fieldStates, setFieldStates] = useState(initialFieldState);
    const [orFilter, setOrFilter] = useState(false);

    const handleOrFilterChange = (event) => {
        setOrFilter(event.target.checked);
    };

    const handleSave = () => {
        setFieldStates({
            ...fieldStates,
            [selectedField]: {
                condition: selectedCondition,
                filterValue,
                memo,
            },
        });
        alert("저장되었습니다.");
    };

    const handleReset = () => {
        setSelectedField("");
        setSelectedCondition("");
        setFilterValue("");
        setMemo("");
    };

    const handleRowClick = (index) => {
        setHighlightedRowIndex(index);
    };

    return (
        <Container>
            <h3>쿼리 필터</h3>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Select
                                    fullWidth
                                    value={selectedField}
                                    onChange={(e) => setSelectedField(e.target.value)}
                                >
                                    {fields.map((field) => (
                                        <MenuItem key={field} value={field}>
                                            {field}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={4}>
                                <Select
                                    fullWidth
                                    value={selectedCondition}
                                    onChange={(e) => setSelectedCondition(e.target.value)}
                                >
                                    {conditions.map((condition) => (
                                        <MenuItem key={condition} value={condition}>
                                            {condition}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    value={filterValue}
                                    onChange={(e) => setFilterValue(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="메모"
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} container justifyContent="flex-end" spacing={2}>
                    <Grid item>
                        <Button variant="outlined" onClick={handleReset}>
                            초기화
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={handleSave}>
                            저장
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <TableContainer
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
                                    setSelectedField(field);
                                    setSelectedCondition(fieldStates[field].condition);
                                    setFilterValue(fieldStates[field].filterValue);
                                    setMemo(fieldStates[field].memo);
                                    handleRowClick(index);
                                }}
                                style={
                                    highlightedRowIndex === index
                                        ? { backgroundColor: "lightgray" }
                                        : {}
                                }
                            >
                                <TableCell>{field}</TableCell>
                                <TableCell>{fieldStates[field].condition}</TableCell>
                                <TableCell>{fieldStates[field].filterValue}</TableCell>
                                <TableCell>{fieldStates[field].memo}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container spacing={2} alignItems="center" justifyContent="space-between" style={{ marginTop: "16px" }}>
                <Grid item>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={orFilter}
                                onChange={handleOrFilterChange}
                            />
                        }
                        label="필터 항목 OR 적용"
                    />
                </Grid>
                <Grid item>
                    <Button variant="contained">
                        저장
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default FilterModal2;