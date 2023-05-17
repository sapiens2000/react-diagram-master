import {IconButton} from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import React, {useEffect, useRef, useState} from "react";
import { createPortal } from "react-dom";

const ModalPortal = ({ children, closePortal, flag }) => {
    const [mounted, setMounted] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        setMounted(true);
        if (document && flag == "filter") {
            const dom = document.getElementById("filter-modal");
            ref.current = dom;
        }
        else if (document && flag == "select") {
            const dom = document.getElementById("select-modal");
            ref.current = dom;
        }
        else if (document && flag == "save") {
					const dom = document.getElementById("save-modal");
					ref.current = dom;
				}
				else if (document && flag == "memo") {
					const dom = document.getElementById("memo-modal");
					ref.current = dom;
				}
        return () => {
            setMounted(false);
        };
    }, []);

    if (ref.current && mounted) {
        return createPortal(
            <div className="modal">
                <div
                    className="modal-background"
                    role="presentation"
                    onClick={closePortal}
                />
                <div className="modal-content">
                    <div className="modal-content__close">
                        <IconButton onClick={closePortal}><CloseIcon /></IconButton>
                    </div>
                    <div className="modal-content__main" >
                        {children}
                    </div>
                </div>
            </div>,
            ref.current
        );
    }
    return null;
};

export default ModalPortal;
