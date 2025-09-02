import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const TestModal = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <button onClick={handleOpen}>모달 열기</button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop:{
                        timeout: 500,
                    }
                }}
            >
                <Box sx={style}>
                <h2 id="modal-title">테스트 모달</h2>
                <p id="modal-description">이건 MUI Modal 테스트입니다.</p>
                <button onClick={handleClose}>닫기</button>
                </Box>
            </Modal>
        </div>
    );
};

export default TestModal;