//https://codesandbox.io/s/github/Abhipatil0105/Calculator/tree/main/?file=/src/styled.ts:0-692
import styled from "@emotion/styled";
import { PortWidget } from "@projectstorm/react-diagrams";

export const Memo = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  border: 1px solid #f1f1f1;
  min-width: 290px;
  min-height: 70px;
  max-height: 500px;
  background: #ffffcc;
  border-radius: 10px;
  padding: 10px;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: space-between;
  overflow-x: auto;
  overflow-y: auto;
`;

export const Widget = styled.div`
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.2);
  width: 100px;
  height: 80px;
  background: #fff;
  border-radius: 8px;
  position: relative;
  box-sizing: border-box;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: space-between;
`;

export const OutPort = styled(PortWidget)`
  margin: -7px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid #000000;
  transition: ease-in 0.2s;
  cursor: pointer;
  transform: scale(1.7);
  position: absolute;
  opacity: 0.4;
`;

export const InPort = styled(PortWidget)`
  margin: -7px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 5px solid #000000;
  transition: ease-in 0.2s;
  cursor: pointer;
  transform: scale(1.7);
  position: absolute;
  opacity: 0.4;
`;

export const Input = styled.input`
  border: none;
  font-size: 2em;
  width: 100%;
`;

export const Result = styled.p`
  margin: 0;
  font-size: 2em;
`;
