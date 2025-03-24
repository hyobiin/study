import { useState } from 'react'
import Modal from './Modal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div>
        <h1>React Modal</h1>
        <button onClick={handleOpenModal}>버튼</button>
        
        <Modal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="타이틀"
          content={<div className="modal_inquiry_result">등록 완료 되었습니다.</div>}
          onConfirm={handleCloseModal}
          onCancle={handleCloseModal}
          width="400px"
          height="initial"
        />
      </div>
    </>
  )
}

export default App
