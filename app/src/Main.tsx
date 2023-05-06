import styled from "@emotion/styled";
import Button from "@mui/material/Button";


const Dialog = styled.div `
    width: 300px;
    height: 320px;
    left: 309px;
    top: 145px;
    z-index: 10004;

    position: absolute;
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
    text-align: center;
    white-space: nowrap;
    padding-top: 0px;
    padding-bottom: 20px;
    max-height: 100%;
    overflow-x: hidden;
`;

export const Main: any = () => {
    return (
        <Dialog>
            <Box>
                <Button style={{float: 'right'} }variant="contained">불러오기</Button>
                <Button style={{float: 'right'}} variant="text">새 프로젝트</Button>
            </Box>
        </Dialog>
    )
}
