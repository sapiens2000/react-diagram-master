import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BodyWidget } from './Tray/BodyWidget';
import { render } from "react-dom";
import ProjectSelection from './ProjectSelection';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

render(
	<ProjectSelection/>,
      // <BodyWidget app={new App(true)}/>
	document.getElementById("root")
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
