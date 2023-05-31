import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import React, { useState } from 'react';
import { BodyWidget } from "./Tray/BodyWidget";
import App from "./App";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {Grid} from "@mui/material";

// const Dialog = styled.div `
//     width: 300px;
//     height: 320px;
//     left: 309px;
//     top: 145px;
//     z-index: 10004;

//     position: absolute;
//     background: white;
//     line-height: 1em;
//     overflow: hidden;
//     padding: 30px;
//     border: 1px solid #acacac;
//     -webkit-box-shadow: 0px 0px 2px 2px #d5d5d5;
//     -moz-box-shadow: 0px 0px 2px 2px #d5d5d5;
//     box-shadow: 0px 0px 2px 2px #d5d5d5;
//     z-index: 2;
// `;

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 300,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
};

const Input = styled.input`
  width: 200px; /* 또는 원하는 너비 */
  height: 20px; /* 또는 원하는 높이 */
  padding: 10px;
`;

const Dialog = styled.div `
  width: 300px;
  height: 320px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10004;
  background: white;
  line-height: 1em;
  overflow: hidden;
  padding: 30px;
  border: 1px solid #acacac;
  -webkit-box-shadow: 0px 0px 2px 2px #d5d5d5;
  -moz-box-shadow: 0px 0px 2px 2px #d5d5d5;
  box-shadow: 0px 0px 2px 2px #d5d5d5;
  z-index: 2;
`;

const MyBox = styled.div `
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    padding-top: 0px;
    padding-bottom: 20px;
    max-height: 100%;
    overflow-x: hidden;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
`;

const ProjectSelection: React.FC = () => {
	const [newProject, setNewProject] = useState(false);
	const [loadProject, setLoadProject] = useState(false);

	const [open, setOpen] = React.useState(false);
	const [projectId, setProjectId] = useState<number>();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProjectId(Number(e.target.value));
	};

	const handleLoadProject = () => {
		console.log("Confirmed project id: ", projectId);
		handleClose();
		setNewProject(false);
		setLoadProject(true);
	};

	const handleOpen = () => {
		setOpen(true);
	}

	const handleClose = () => {
		setOpen(false);
		handleNewProject();
	}

	const handleNewProject = () => {
		setNewProject(true);
		setLoadProject(false);
	};

	if (newProject) {
		return <BodyWidget app={new App(0)}/>;
	}

	if (loadProject) {
		return <BodyWidget app={new App(projectId)}/>;
	}

	return (
		<Dialog>
			<MyBox>
				<ButtonContainer>
					<Button
						style={{float: 'right'}}
						variant="contained"
						onClick={handleNewProject}
					>
						새 프로젝트
					</Button>
					<Button
						style={{float: 'right'}}
						variant="text"
						onClick={handleOpen}
					>
						프로젝트 불러오기
					</Button>
					<Modal
						open={open}
						onClose={handleClose}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={style}>
							<Grid container spacing={3} direction="column" justifyContent="center" alignItems="center" alignContent="center">
								<Grid item xs={12}>
									<Typography id="modal-modal-title" variant="h6" component="h2">
										불러올 프로젝트의 ID 입력
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Input type="number" onChange={handleInputChange}/>
								</Grid>
								<Grid item xs={12}>
									<Button
										variant="contained"
										color="primary"
										onClick={handleLoadProject}
									>
										확인
									</Button>
								</Grid>
							</Grid>
						</Box>
					</Modal>
				</ButtonContainer>
			</MyBox>
		</Dialog>
	);
}

export default ProjectSelection;

