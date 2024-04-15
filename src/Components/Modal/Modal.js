import "./Modal.scss";

const Modal = ({ children, show }) => {
  return show ? <div className="modal">{children}</div> : null;
};

export default Modal;
