import * as React from 'react';
import * as _ from 'lodash';
import { TrayWidget } from './TrayWidget';
import { TrayItemWidget } from './TrayItemWidget';
import styled from '@emotion/styled';
import { DefaultNodeModel } from '../components/node/DefaultNodeModel';
import { CanvasWidget } from '@projectstorm/react-diagrams';
import { ArrowPortModel } from '../components/link/ArrowLinkModel';
import { WorkCanvasWidget } from '../WorkCanvasWidget';
import App from '../App';
import SelectNodeModel from '../components/node/SqlNodeModel';
import SaveNodeModel from '../components/node/SaveNodeModel';
import Button from '@mui/material/Button';
import FilterNode from '../components/node/FilterNode';


export interface BodyWidgetProps {
	app: App;
}

namespace S {
	export const Body = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		min-height: 100%;
	`;

	export const Header = styled.div`
		display: flex;
		background: rgb(30, 30, 30);
		flex-grow: 0;
		flex-shrink: 0;
		color: white;
		font-family: Helvetica, Arial, sans-serif;
		padding: 10px;
		align-items: center;
	`;

	export const Content = styled.div`
		display: flex;
		flex-grow: 1;
	`;

	export const Layer = styled.div`
		position: relative;
		flex-grow: 1;
	`;

	export const Content2 = styled.div`
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	`

	export const Nav = styled.div`
		background: rgb(60, 60, 60);
	`
}

// function TabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

// function a11yProps(index: number) {
//   return {
//     id: `simple-tab-${index}`,
//     'aria-controls': `simple-tabpanel-${index}`,
//   };
// }

// function BasicTabs() {
//   const [value, setValue] = React.useState(0);

//   const handleChange = (event: React.SyntheticEvent, newValue: number) => {
//     setValue(newValue);
//   };

//   return (
//     <Box sx={{ width: '100%' }}>
//       <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//         <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
//           <Tab label="Item One" {...a11yProps(0)} />
//         </Tabs>
//       </Box>
//       <TabPanel value={value} index={0}>
//         P1
//       </TabPanel>
//     </Box>
//   );
// }

export class BodyWidget extends React.Component<BodyWidgetProps> {
	render() {
		return (
			<S.Body>
				<S.Content>
					<TrayWidget>
						<TrayItemWidget model={{ type: 'in' }} name="In Node" color="rgb(192,255,0)" />
						<TrayItemWidget model={{ type: 'out' }} name="Out Node" color="rgb(0,192,255)" />
						<TrayItemWidget model={{ type: 'sql' }} name="Select Node" color="rgb(0,192,255)" />
						<TrayItemWidget model={{ type: 'save' }} name="Save Node" color="rgb(0,192,255)" />
						<TrayItemWidget model={{ type: 'filter' }} name="Filter Node" color="rgb(0,192,255)" />
					</TrayWidget>
					<S.Content2>
						<S.Header>
							<div className="title">Demo
							</div>
						</S.Header>
						<S.Layer
							onDrop={(event) => {
								var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
								var nodesCount = _.keys(this.props.app.getDiagramEngine().getModel().getNodes()).length;

								var node: DefaultNodeModel | SelectNodeModel | SaveNodeModel = null;
								if (data.type === 'in') {
									node = new DefaultNodeModel('In ' + (nodesCount + 1), 'rgb(192,255,0)');
									node.addPort(new ArrowPortModel(true, 'in'));
								} else if (data.type === 'out'){
									node = new DefaultNodeModel('Out ' + (nodesCount + 1), 'rgb(0,192,255)');
									node.addPort(new ArrowPortModel(false, 'Out'));
								} else if (data.type === 'sql'){
									node = new SelectNodeModel(this.props.app.getDiagramEngine());
								} else if (data.type === 'save'){
									node = new SaveNodeModel(this.props.app.getDiagramEngine());
								} else if (data.type === 'filter'){
									node = new FilterNode(this.props.app.getDiagramEngine());
								}
								var point = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
								node.setPosition(point);
								this.props.app.getDiagramEngine().getModel().addNode(node);
								this.forceUpdate();
							}}
							onDragOver={(event) => {
								event.preventDefault();
							}}
						>
							<WorkCanvasWidget>
								<CanvasWidget engine={this.props.app.getDiagramEngine()} />
							</WorkCanvasWidget>
							
						</S.Layer>
					</S.Content2>
				</S.Content>
			</S.Body>
		);
	}
}
