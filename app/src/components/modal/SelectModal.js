import {Container, TextField, Typography, Button, TextareaAutosize, Grid, Paper, TableContainer} from "@mui/material";
import {Box} from "@mui/system";
import React, {useState, useEffect} from "react";
import {makeStyles} from '@mui/styles';
import getColumnInfo from "../node/getColumnInfo"

const useStyles = makeStyles({
	container: {
		backgroundColor: '#000',
		padding: '0.5rem',
		width: '350px',
		height: '450px',
		display: 'flex',
		flexDirection: 'column',
		position: 'relative',
		borderRadius: '12px',

	},
	textarea: {
		backgroundColor: '#000',
		color: '#fff',
		border: '1px solid #ff0',
		resize: 'none',
		marginBottom: '1rem',
		position: 'relative'
	},
	saveButton: {
		bottom: '0rem',
		right: '0rem',
	}
});

const SelectModal = ({flowAttrInfo, onFlowAttrInfoChange}) => {
	const classes = useStyles();
	const [attr, setAttr] = useState(flowAttrInfo.sql || '');

	useEffect(() => {
		setAttr(flowAttrInfo.sql || '');
	}, [flowAttrInfo.sql]);

	const handleSave = () => {
		alert("save");

		const updatedFlowAttrInfo = {
			...flowAttrInfo,
			sql : attr,
			col : getColumnInfo(attr)
		};
		onFlowAttrInfoChange(updatedFlowAttrInfo);
		console.log("submit");
	};

	return (
			<Container>
				<h3>SQL 쿼리 관리</h3>
				<Box className={classes.container}>
					<TextareaAutosize
						className={classes.textarea}
						value={attr}
						onChange={(e) => setAttr(e.target.value)}
						rowsMin={5}
						placeholder="여기에 입력하세요."
					/>
				</Box>
				<br/>
				<div>
					<Button onClick={handleSave} variant="contained" className={classes.saveButton}>확인</Button>
				</div>
			</Container>
	);
};

export default SelectModal;
