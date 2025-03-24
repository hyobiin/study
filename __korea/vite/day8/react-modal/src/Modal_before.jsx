import './Modal.css'

const Modal = ({ isOpen, onClose, title, content, onConfirm, onCancle, width, height }) => {
  if(!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal_inner">
        <div className="modal_content" style={{ width, height }}>
          <div className="modal_header">
            <span className="close" onClick={onClose}>&times;</span>
            <div className="modal_title">{title}</div>
          </div>
          <div className="modal_body">{content}</div>
          <div className="modal_footer">
            {
              onConfirm ?
              <button className='btn btn_style1 modal_confirm neg' onClick={{onCancle}}>취소</button>
              :
              <button className='btn btn_style1 modal_confirm pos' onClick={{onConfirm}}>확인</button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal;