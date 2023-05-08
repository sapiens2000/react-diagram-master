import './PopupMenu.css'
import React, { useState, useEffect } from 'react';

interface PopupMenuItems {
    label: string;
    onClick: () => void;
}

interface PopupMenuProps {
    items: PopupMenuItems[];
  }
  
export const PopupMenu: React.FC<PopupMenuProps> = ({items}) => {
    const [visible, setVisible] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    
    const handleClose = () => {
        setVisible(false);
    };

    useEffect(() => {
      const handleClick = (event: MouseEvent) => {
        if (!visible) return;
        if (!event.target) return;
        if (!(event.target instanceof Element)) return;
  
        const isOutside = !event.target.closest('.popup-menu');
        if (isOutside) handleClose();
      };
  
      document.addEventListener('mousedown', handleClick);
      return () => {
        document.removeEventListener('mousedown', handleClick);
      };
    }, [visible, handleClose]);
  
    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      setVisible(true);
      setX(event.clientX);
      setY(event.clientY);
    };
  

    return (
      <div className="mxPopupMenu">
          <ul>
            {items.map((item, index) => (
              <div className="mxPopupMenuItem" key={index} onClick={item.onClick}>
                {item.label}
              </div>
            ))}
          </ul>
      </div>
    );
  };
  
  export default PopupMenu;