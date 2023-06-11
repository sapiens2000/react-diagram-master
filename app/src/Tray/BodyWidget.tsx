import * as React from 'react';
import * as _ from 'lodash';
import { TrayWidget } from './TrayWidget';
import { TrayItemWidget } from './TrayItemWidget';
import styled from '@emotion/styled';
import { CanvasWidget } from '@projectstorm/react-diagrams';
import { WorkCanvasWidget } from '../WorkCanvasWidget';
import App from '../App';
import SelectNodeModel from '../components/node/SelectNodeModel';
import OutputNodeModel from '../components/node/OutputNodeModel';
import FilterNodeModel from '../components/node/FilterNodeModel';
import MemoNodeModel from '../components/node/MemoNodeModel';
import {Box, Button, Grid, IconButton, Modal, Typography} from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import saveAs from 'file-saver';
import EastIcon from '@mui/icons-material/East';
import StorageIcon from '@mui/icons-material/Storage';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';
import ProjectInfoModal from '../components/modal/ProjectInfoModal';
import SidePanel from './SidePanel';
import { ProjectDiagramModel } from '../components/model/ProjectDiagramModel';
import { channel } from 'diagnostics_channel';
import qs from 'qs';

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
		padding: 0 20px;
		align-items: center;
		justify-content: space-between;
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

	export const ButtonBox = styled.div`
		display: flex;
		justify-content: flex-end;
		align-items: center;
	`
	export const Style = {
		position: 'absolute' as 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 300,
		bgcolor: 'white',
		border: '2px solid #000',
		boxShadow: 24,
		p: 4,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	};

	export const Input = styled.input`
  width: 200px; /* 또는 원하는 너비 */
  height: 20px; /* 또는 원하는 높이 */
  padding: 10px;
`;
}

export class BodyWidget extends React.Component<BodyWidgetProps> {

	state = {
		open: false,
		projectId: -1,
	}

	// Functions for Modal handling
	handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({projectId: Number(e.target.value)});
	};

	handleLoadProject = () => {
		console.log("Confirmed project id: ", this.state.projectId);
		this.handleClose();

		this.props.app.isLoaded = true;

		let projectModel = this.props.app.getDiagramEngine().getModel();
		let progMstValue: any;

		// prog_mst 추출
		Object.keys(projectModel).forEach((key) => {
			if (key in projectModel) {
				if (key === 'prog_mst') {
					progMstValue = (projectModel as any)[key];
				}
			}
		});

		axios.post(`/diagram/project/load/${this.state.projectId}`, this.state.projectId, {maxRedirects: 0})
			.then(response => {
				console.log('Response data:', response.data);

				let viewAttr = JSON.parse(response.data.viewAttr);
				console.log('ViewAttr: ', viewAttr);
				const newModel = new ProjectDiagramModel();
				newModel.setProgMst(response.data);
				this.props.app.getDiagramEngine().getModel().deserializeModel(
					viewAttr, this.props.app.getDiagramEngine());
			})
			.catch((Error) => {
				console.log(Error);
			});

		this.props.app.isLoaded = false;
	};

	handleOpen = () => {
		this.setState({open: true});
	}

	handleClose = () => {
		this.setState({open: false});
	}

	handlePlay = () => {
		console.log('play project')

		this.props.app.workflow.splice(0)
		const links = this.props.app.getDiagramEngine().getModel().getLinks();

		for (let key in links) {
			const link = links[key];

			let targetPort = link.getTargetPort();
			let sourceNode = link.getSourcePort().getParent();
			let targetNode = link.getTargetPort().getParent();

			var tempSourceNode : SelectNodeModel | FilterNodeModel | OutputNodeModel = null;
			var tempTargetNode : SelectNodeModel | FilterNodeModel | OutputNodeModel = null;

			if (sourceNode instanceof SelectNodeModel) {
				console.log(`sourceNodeModel property: $ ${sourceNode.progWorkFlowMng.flowId}`);
				tempSourceNode = sourceNode;
			} else if (sourceNode instanceof FilterNodeModel) {
				console.log(`sourceNodeModel property: $ ${sourceNode.progWorkFlowMng.flowId}`);
				tempSourceNode = sourceNode;
			} else if (sourceNode instanceof OutputNodeModel) {
				console.log(`sourceNodeModel property: $ ${sourceNode.progWorkFlowMng.flowId}`);
				tempSourceNode = sourceNode;
			}

			if (targetNode instanceof FilterNodeModel) {
				console.log(`targetNodeModel property: ${targetNode.progWorkFlowMng.flowId}`);
				tempTargetNode = targetNode;
			} else if (targetNode instanceof SelectNodeModel) {
				console.log(`targetNodeModel property: ${targetNode.progWorkFlowMng.flowId}`);
				tempTargetNode = targetNode;
			} else if (targetNode instanceof OutputNodeModel) {
				console.log(`targetNodeModel property: ${targetNode.progWorkFlowMng.flowId}`);
				tempTargetNode = targetNode;
			}

			let targetPortAlignment = targetPort.getOptions().alignment;

			if(targetPortAlignment == 'left') {
				let tempFlowList = [tempSourceNode.progWorkFlowMng.flowId, tempTargetNode.progWorkFlowMng.flowId];
				this.props.app.workflow.push(tempFlowList);
			}
			else if(targetPortAlignment == 'right') {
				let tempFlowList = [tempTargetNode.progWorkFlowMng.flowId, tempSourceNode.progWorkFlowMng.flowId];
				this.props.app.workflow.push(tempFlowList);
			}

			// console.log(this.props.app.workflow);

			// console.log(`Link ${key} connects node ${sourceNode.getID()} to ${targetNode.getID()}`);
			// console.log(`It uses port ${link.getSourcePort().getID()} on the source node and port ${link.getTargetPort().getID()} on the target node`);
		}

		let chains = this.props.app.workflow.map(a => [...a]);


		for (let i = 0 ; i < chains.length; i++) {
			for (let j = 0 ; j < chains.length; j++) {
				if( i != j && chains[i][chains[i].length - 1] == chains[j][0]) {
					chains[i] = [...chains[i], ...chains[j].slice(1)];
					chains[j] = [];
				}
			}
		}

		var progId = (this.props.app.getDiagramEngine().getModel() as ProjectDiagramModel).getProgId()
		let _flowSeq = chains.filter(item => item.length > 0);

		
		let tmp_flowSeq = [_flowSeq[0][0].toString(), _flowSeq[0][1].toString(), _flowSeq[0][2].toString()];

		// const encodedFlowSeq = (tmp_flowSeq as string[]).map(seq => encodeURIComponent(seq));

		const play_seq = async() => await axios.get(`/diagram/project/sql-result/${progId}`, {
			params: {
				flowSeq: tmp_flowSeq
			},
			paramsSerializer: params => {
				return qs.stringify(params, { arrayFormat: 'repeat' });
			  }
		  })
        .then(response => {
			let result: any[] = []
            response.data.forEach((row : any) => {
				result.push(row)
			})

			alert(`노드 타입 : ${result[0].nodeType}, 처리 개수 : ${result[0].resultNum}, 실행 시간 : ${result[0].timeDiff}\n` +
			`노드 타입 : ${result[1].nodeType}, 처리 개수 : ${result[1].resultNum}, 실행 시간 : ${result[1].timeDiff}\n`+
			`노드 타입 : ${result[2].nodeType}, 처리 개수 : ${result[2].resultNum}, 실행 시간 : ${result[2].timeDiff}\n`)
        })
        .catch((error) => {
            console.log(error);
        });

		play_seq();
	}

	handleSaveProject = () => {
		let project_json = this.props.app.getDiagramEngine().getModel().serialize();
		let projectModel = this.props.app.getDiagramEngine().getModel();
		let progMstValue: any;

		// prog_mst 추출
		Object.keys(projectModel).forEach((key) => {
			if (key in projectModel) {
				if (key === 'prog_mst') {
					progMstValue = (projectModel as any)[key];
				}
			}
		});

		console.log(project_json);
		progMstValue = {
		  ...progMstValue,
		  viewAttr: JSON.stringify(project_json, null, 2)
		};
		
		console.log(progMstValue);

		axios.post(`/diagram/project/update/${progMstValue.progId}`, progMstValue, { maxRedirects: 0})
			.then(response => {
				console.log(response.data);
			})
			.catch((Error) => {
				console.log(Error);
		});

		this.props.app.getDiagramEngine().repaintCanvas();
	}

	handleUseChange = (e: any) => {
		(this.props.app.getDiagramEngine().getModel() as ProjectDiagramModel).setUseYn();
	}

	render() {
		return (
			<S.Body>
				<Modal
					open={this.state.open}
					onClose={this.handleClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box sx={S.Style}>
						<Grid container spacing={3} direction="column" justifyContent="center" alignItems="center" alignContent="center">
							<Grid item xs={12}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									불러올 프로젝트의 ID 입력
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<S.Input type="number" onChange={this.handleInputChange}/>
							</Grid>
							<Grid item xs={12}>
								<Button
									variant="contained"
									color="primary"
									onClick={this.handleLoadProject}
								>
									확인
								</Button>
							</Grid>
						</Grid>
					</Box>
				</Modal>
				<S.Content>
					<TrayWidget>
						<div>
							<TrayItemWidget model={{ type: 'select' }} name="Select Node" color="rgb(0,192,255)"><StorageIcon fontSize='large'/></TrayItemWidget>
							<TrayItemWidget model={{ type: 'filter' }} name="Filter Node" color="rgb(0,192,255)"><FilterAltIcon fontSize='large'/></TrayItemWidget>
							<TrayItemWidget model={{ type: 'output' }} name="Output Node" color="rgb(0,192,255)"><EastIcon fontSize='large'/></TrayItemWidget>
							<TrayItemWidget model={{ type: 'memo' }} name="Memo Node" color="rgb(0,192,255)"><NoteAltOutlinedIcon fontSize='large'/></TrayItemWidget>
						</div>
					</TrayWidget>
					<S.Content2>
						<S.Header>
						<div
						className="title"
						onDoubleClick={(event) => (event.target as HTMLDivElement).setAttribute("contentEditable", "true")}
						onBlur={(event) => (event.target as HTMLDivElement).removeAttribute("contentEditable")}
						// onKeyDown={(event) => (event.target as HTMLDivElement).blur()}
						>
						프로젝트명
						</div>
							<S.ButtonBox>
								<FormControlLabel control={<Checkbox/>} onChange={this.handleUseChange} label="사용" />
								<IconButton onClick={this.handlePlay}>
									<PlayCircleFilledWhiteOutlinedIcon fontSize='large' style={{color: 'white'}}/>
								</IconButton>
								<IconButton onClick={this.handleSaveProject}>
									<SaveOutlinedIcon fontSize='large'  style={{color: 'white'}}/>
								</IconButton>
								<IconButton onClick={this.handleOpen}>
										<FolderOpenIcon fontSize="large" style={{ color: 'white' }} />
								</IconButton>
								{/* {isProjectInfoModalOpen && (
									<div className="modal-overlay">
										<div className="modal-container">
											<ProjectInfoModal
											onClose={this.handleCloseModal}
											onProjectSelect={this.handleProjectSelect}
											/>
										</div>
									</div>
								)} */}
							</S.ButtonBox>
						</S.Header>
						<S.Layer
							onDrop={(event) => {
								var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
								var nodesCount = _.keys(this.props.app.getDiagramEngine().getModel().getNodes()).length;

								var node: FilterNodeModel | SelectNodeModel | OutputNodeModel | MemoNodeModel= null;

								if (data.type === 'select'){
									node = new SelectNodeModel(this.props.app.getDiagramEngine());
									node.setIsLoadedCallback(() => this.props.app.isLoaded);
									node.init();
								} else if (data.type === 'output'){
									node = new OutputNodeModel(this.props.app.getDiagramEngine());
									node.setIsLoadedCallback(() => this.props.app.isLoaded);
									node.init();
								} else if (data.type === 'filter'){
									node = new FilterNodeModel(this.props.app.getDiagramEngine());
									node.setIsLoadedCallback(() => this.props.app.isLoaded);
									node.init();
								} else if (data.type === 'memo') {
									node = new MemoNodeModel(this.props.app.getDiagramEngine());
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
