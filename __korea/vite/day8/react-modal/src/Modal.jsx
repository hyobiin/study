import './Modal.css'

const Modal = ({ isOpen, onClose, title, content, onBtn = [], width, height }) => {
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
              onBtn.map((btn, index) => (
                <button
                  key={index}
                  className={`btn btn_style1 modal_confirm ${btn.class}`}
                  onClick={btn.onClick}
                >{btn.text}</button>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal;