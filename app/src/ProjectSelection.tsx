import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import React, { useState } from 'react';
import { BodyWidget } from "./Tray/BodyWidget";
import App from "./App";

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

const Box = styled.div `
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

  const handleNewProject = () => {
    setNewProject(true);
    setLoadProject(false);
  };

  const handleLoadProject = () => {
    setNewProject(false);
    setLoadProject(true);
  };

  return (
    <div>
      <Dialog>
        <Box>
          <ButtonContainer>
            <Button
              style={{ float: 'right' }}
              variant="contained"
              onClick={handleNewProject}
            >
              새 프로젝트
            </Button>
            <Button
              style={{ float: 'right' }}
              variant="text"
              onClick={handleLoadProject}
            >
              프로젝트 불러오기
            </Button>
          </ButtonContainer>
        </Box>
        {newProject && <BodyWidget app={new App(true)}/>}
        {/* {loadProject && <BodyWidget app={new App(false)}/>} */}
      </Dialog>
    </div>
  );
};

export default ProjectSelection;

