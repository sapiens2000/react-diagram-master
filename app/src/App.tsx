import React from 'react';
import { DemoCanvasWidget } from './DemoCanvasWidget';
import { TrayWidget } from './Tray/TrayWidget';
import { TrayItemWidget } from './Tray/TrayItemWidget';
import { BodyWidget } from './Tray/BodyWidget';
import './App.css';
import { Application } from './Application';

import createEngine, { 
  DefaultLinkModel, 
  DefaultNodeModel,
  DiagramModel 
} from '@projectstorm/react-diagrams';

import {
  CanvasWidget
} from '@projectstorm/react-canvas-core';


function App() {
  // create an instance of the engine with all the defaults
  const engine = createEngine();

  
  const model = new DiagramModel();
  // model.addAll(node1, node2, link);
  engine.setModel(model);

  return (
    <>
      <DemoCanvasWidget>
        <CanvasWidget className="canvas" engine={engine} />
      </DemoCanvasWidget>
    </>
  );
}

export default () => {
	var app = new Application();
	return <BodyWidget app={app} />;
};

