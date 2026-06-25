import { useNavigate } from "react-router-dom";
import style from "../css/Modal.module.css";

const ModalAlert = ({
  close,
  title,
  desc,
  error,
  confirm,
  onConfirm,
  goPage,
  throwFn,
}) => {
  const navigate = useNavigate();
  const okSubmit = () => {
    if (onConfirm) {
      onConfirm();
    } else if (goPage) {
      navigate(goPage);
    } else if (throwFn) {
      throwFn();
    } else {
      close();
    }
  };
  return (
    <div className={`${style.terms} ${error ? style["error"] : ""} `}>
      <h3 className={style.termsTitle}>GURU</h3>
      <p>{desc}</p>
      {error ? (
        <div className={style.modalBtn}>
          {confirm ? (
            <>
              <button className={style.alertBtn} onClick={close}>
                취소
              </button>
              <button
                className={`${style.alertBtn} ${style.primary}`}
                onClick={okSubmit}
              >
                확인
              </button>
            </>
          ) : (
            <button
              className={`${style.alertBtn} ${style.primary}`}
              onClick={okSubmit}
            >
              확인
            </button>
          )}
        </div>
      ) : (
        <div className={style.modalBtn}>
          {confirm ? (
            <>
              <button className={style.alertBtn} onClick={close}>
                취소
              </button>
              <button
                className={`${style.alertBtn} ${style.primary}`}
                onClick={okSubmit}
              >
                확인
              </button>
            </>
          ) : (
            <button
              className={`${style.alertBtn} ${style.primary}`}
              onClick={okSubmit}
            >
              확인
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ModalAlert;
