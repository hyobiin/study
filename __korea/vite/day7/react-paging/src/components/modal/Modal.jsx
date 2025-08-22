import { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement('#root');

const Modal_ = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return(
        <div>
            <button onClick={openModal} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                도움말 열기
            </button>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="도움말 모달"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 1000,
                    },
                    content: {
                        maxWidth: '500px',
                        margin: 'auto',
                        padding: '20px',
                        borderRadius: '8px',
                    },
                }}
            >
                <h2>도움말</h2>
                <p>
                    이곳은 도움말 내용입니다.<br />
                    원하는 내용을 자유롭게 작성하세요.
                </p>
                <button onClick={closeModal} style={{ marginTop: '20px' }}>
                닫기
                </button>
            </Modal>
        </div>
    )
}

export default Modal_;