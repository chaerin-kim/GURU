import style from "../css/Modal.module.css";

const Modal = ({ show, onClose, children, type }) => {
  //type = noneBtn, userPop, profile, alert, detail

  if (!show) {
    return null;
  }
  return (
    <div className={`${style.modalOverlay} ${type !== undefined ? style[type] : ""}`}>
      <div className={style.modalContent}>
        {type !== "profile" && type !== "alert" && (
          <button className={style.closeBtn} onClick={onClose}>
            &times;
          </button>
        )}
        {children}
        {(type === null || type === undefined || type === "") && (
          <div className={style.modalBtn}>
            <button className={`btn primary yellow ${style.modalInnerBtn}`} onClick={onClose}>
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
