import './App.css';

import createEngine, { 
  DefaultLinkModel, 
  DiagramModel 
} from '@projectstorm/react-diagrams';


import { DefaultNodeFactory } from './components/node/DefaultNodeFactory';
import CustomContextAction from './CustomContextAction';
import { BodyWidget } from './Tray/BodyWidget';
import { DefaultNodeModel } from './components/node/DefaultNodeModel';
import { ArrowLinkFactory } from './components/link/ArrowLinkFactory'
import { ArrowPortModel } from './components/link/ArrowLinkModel';

function App() {
  // create an instance of the engine with all the defaults
  const engine = createEngine();
  engine.getNodeFactories().registerFactory(new DefaultNodeFactory());
  engine.getLinkFactories().registerFactory(new ArrowLinkFactory());


  const model = new DiagramModel();

  var node1 = new DefaultNodeModel('Node 1','rgb(0, 192, 255)');
  var port1 = node1.addPort(new ArrowPortModel(false, 'out', 'out'));
  node1.setPosition(100, 100);

  var node2 = new DefaultNodeModel('Node 2', 'rgb(192, 255, 0)');
  var port2 = node2.addPort(new ArrowPortModel(true, 'out', 'in'));
  node2.setPosition(400, 100);

  let link1 = port1.link(port2);

  var node3 = new DefaultNodeModel('Node 3', 'rgb(192, 255, 0)');
  node3.setPosition(100, 500);

  var node4 = new DefaultNodeModel('Node 4', 'rgb(192, 255, 0)');
  node4.setPosition(500, 450);

  model.addAll(node1, node2, link1, node3, node4);
  engine.setModel(model);
  engine.getActionEventBus().registerAction(new CustomContextAction());

  return (
      <BodyWidget engine={engine}/>
    );
}

export default App;


