import { useState } from 'react'
import Modal from './Modal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState({
    modal1: false,
    modal2: false
  });

  const handleOpenModal = (modalName) => {
    setIsModalOpen((prev) => ({...prev, [modalName]: true}));
  };

  const handleCloseModal = (modalName) => {
    setIsModalOpen((prev) => ({...prev, [modalName]: false}));
  };

  return (
    <>
      <div>
        <h1>React Modal</h1>
        <button onClick={() => handleOpenModal('modal1')}>버튼</button>
        <button onClick={() => handleOpenModal('modal2')}>버튼2</button>

        <Modal
          isOpen={isModalOpen.modal1} // 현재 값(false)을 넣어줘야 화면에 안뜨기 때문에 상태값을 넣어줌
          onClose={() => handleCloseModal('modal1')}
          title="타이틀"
          content={<div className="modal_inquiry_result">등록 완료 되었습니다.</div>}
          onBtn={[
            { text: "확인", class: "pos", onClick: () => handleCloseModal('modal1') },
            { text: "취소", class: "neg", onClick: () => handleCloseModal('modal1') },
            { text: "기본", onClick: () => handleCloseModal('modal1') }
          ]}
          width="400px"
          height="initial"
        />

        <Modal
          isOpen={isModalOpen.modal2}
          onClose={() => handleCloseModal('modal2')}
          title="두번째 모달"
          content={<div className="modal_inquiry_result">두번째 테스트 모달</div>}
          onBtn={[
            { text: "확인", class: "pos", onClick: () => handleCloseModal('modal2') }
          ]}
          width="400px"
          height="initial"
        />
      </div>
    </>
  )
}

export default App
