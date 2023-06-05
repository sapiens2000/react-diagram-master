import "./SidePanel.css"
import React, { useState } from 'react';
import { TrayItemWidget } from "./TrayItemWidget";
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import EastIcon from '@mui/icons-material/East';
import StorageIcon from '@mui/icons-material/Storage';

const SidePanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`explorer-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="header" onClick={handleToggleExpansion}>
        노드
      </div>
      {isExpanded && (
        <div className="content">
            <TrayItemWidget model={{ type: 'select' }} name="Select Node" color="rgb(0,192,255)"><StorageIcon fontSize='large'/></TrayItemWidget>
            <TrayItemWidget model={{ type: 'filter' }} name="Filter Node" color="rgb(0,192,255)"><FilterAltIcon fontSize='large'/></TrayItemWidget>
            <TrayItemWidget model={{ type: 'output' }} name="Output Node" color="rgb(0,192,255)"><EastIcon fontSize='large'/></TrayItemWidget>
            <TrayItemWidget model={{ type: 'memo' }} name="Memo Node" color="rgb(0,192,255)"><NoteAltOutlinedIcon fontSize='large'/></TrayItemWidget>
        </div>
      )}
    </div>
  );
};

export default SidePanel;
