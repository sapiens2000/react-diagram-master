import React, {FC, useRef, useState, useEffect} from "react";
import { BaseModel, DiagramEngine } from "@projectstorm/react-diagrams";
import {Modal, Container, IconButton, Menu, MenuItem, Typography, Popover, TextareaAutosize, Box} from "@mui/material";
import * as S from "../../adstyled";
import "../../styles.css";
import MemoNodeModel from "./MemoNodeModel";

import { EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { Resizable } from 're-resizable';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export interface MemoNodeWidgetAdvancedProps {
	node: MemoNodeModel;
	engine: DiagramEngine;
}

const MemoNodeWidget : FC<MemoNodeWidgetAdvancedProps> = ({ engine, node}) => {
	const [editorState, setEditorState] = useState(() =>
		node.memo ? EditorState.createWithContent(convertFromRaw(JSON.parse(node.memo))) : EditorState.createEmpty()
	);
	const [resizeState, setResizeState] = useState(false);

	const [contextMenu, setContextMenu] = React.useState<{
		mouseX: number;
		mouseY: number;
	} | null>(null);
	const [onModal, setOnModal] = useState(false);

	const onEditorStateChange = (editorState: EditorState) => {
		setEditorState(editorState);
		const contentState = editorState.getCurrentContent();
		node.memo = JSON.stringify(convertToRaw(contentState));
	};

	const handleNodeLock = () => {
		node.setLocked(true);
	}

	const handleNodeUnlock = () => {
		if (!resizeState) {
			node.setLocked(false);
		}
	}

	const handleResizeStart = () => {
		setResizeState(true);
		node.setLocked(true);
	}

	const handleResizeStop = () => {
		setResizeState(false);
		node.setLocked(false);
	}

	//////////////CONTEXT//////////////
	const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		setContextMenu(
			contextMenu === null
				? {
					mouseX: event.clientX + 2,
					mouseY: event.clientY - 6,
				}
				: // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
					// Other native context menus might behave different.
					// With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
				null,
		);
	};

	const handleDelete = () => {
		node.remove();
		engine.repaintCanvas();
	}

	const handleCopy = () => {
		// need connection with db and copy data set
		node.setSelected(true);
		let offset = { x: 100, y: 100 };
		let model = engine.getModel()

		let target = model.getSelectedEntities()

		if(target.length > 0){
			let newNode = target[0].clone()

			newNode.setPosition(newNode.getX() + offset.x, newNode.getY() + offset.y);
			model.addNode(newNode);
			(newNode as BaseModel).setSelected(false);
		}
		node.setSelected(false);
		setContextMenu(null);

		console.log('copy')
		engine.repaintCanvas();
	}

	const handleLock = () => {
		if(node.isLocked() == true)
			node.setLocked(true)
		else
			node.setLocked(false)

		console.log('set lock')
		setContextMenu(null);
		engine.repaintCanvas();
	}

	const handleContextClose = () => {
		setContextMenu(null)
	}
	//////////////////////////////////////


	return (
		<div className="memo" onContextMenu={handleContextMenu} style={{ cursor: 'text' }}>
				<S.Memo style={{overflow: 'visible'}}>
					<Resizable minWidth={240} minHeight={50} onResizeStart={handleResizeStart} onResizeStop={handleResizeStop}>
						<Box sx={{ width: '100%', height: '100%', overflow: 'visible'}}>
							<div>
								<Editor
									toolbarClassName="toolbarClassName"
									wrapperClassName="wrapperClassName"
									editorClassName="editorClassName"
									editorState={editorState}
									onEditorStateChange={onEditorStateChange}
									onFocus={handleNodeLock}
									onBlur={handleNodeUnlock}
									toolbarOnFocus
									toolbar={{
										options: ['inline', 'fontSize', 'colorPicker'],
										inline: {
											inDropdown: false,
											options: ['bold', 'italic', 'underline']
										},
										fontSize: {
											options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
											className: undefined,
											component: undefined,
											dropdownClassName: undefined,
											isDropDown: true,
										},
									}}
								/>
							</div>
						</Box>
					</Resizable>
				</S.Memo>
			{onModal}
			<Menu
				open={contextMenu !== null}
				onClose={handleContextClose}
				anchorReference="anchorPosition"
				anchorPosition={
					contextMenu !== null
						? { top: contextMenu.mouseY, left: contextMenu.mouseX }
						: undefined
				}
			>
				<MenuItem onClick={handleDelete}>삭제</MenuItem>
				<MenuItem onClick={handleCopy}>복사</MenuItem>
				<MenuItem onClick={handleLock}>잠금</MenuItem>
			</Menu>
		</div>
	);
};

export default MemoNodeWidget;
