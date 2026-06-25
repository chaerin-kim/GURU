import { useState } from "react";
import axios from "axios";
import { url } from "../store/ref";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import ModalAlert from "../components/ModalAlert";
import form from "../css/Form.module.css";
import mem from "../css/Memb.module.css";

const ResetPassword = () => {
  const [modalAlert, setModalAlert] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const search = useLocation().search;
  const token = new URLSearchParams(search).get("token");
  const emailID = new URLSearchParams(search).get("email");
  const navigate = useNavigate();

  const closeAlert = () => {
    setModalAlert(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 4) {
      setModalAlert("pwrequired");
      return;
    }

    if (password !== confirmPw) {
      setModalAlert("pwnotmatch");
      return;
    }
    try {
      const response = await axios.post(`${url}/resetpassword`, {
        password,
        token,
        emailID,
      });
      setModalAlert("resetcomplete");
    } catch (error) {
      setModalAlert("resetfailed");
    }
  };

  const confirmReset = () => {
    navigate("/login");
  };

  return (
    <main className="login fullLayout">
      <h2>비밀번호 재설정</h2>
      <section className={`boxCon ${mem.boxCon}`}>
        <div className={mem.loginCon}>
          <form className={`${mem.form}`} onSubmit={handleSubmit}>
            <div className="full">
              <div className={`${mem.loginLabel} ${mem.findLabel}`}>
                <input className={`${mem.memInput} ${form.row}`} type="password" value={password} placeholder=" " onChange={(e) => setPassword(e.target.value)} required />
                <label htmlFor="password" className={mem.placeholder}>
                  비밀번호
                </label>
              </div>
              <div className={`${mem.loginLabel} ${mem.findLabel}`}>
                <input className={`${mem.memInput} ${form.row}`} type="password" placeholder=" " value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} required />
                <label htmlFor="password" className={mem.placeholder}>
                  비밀번호 확인
                </label>
              </div>
            </div>
            <div className={`${mem.btnWrap} ${mem.findBtn}`}>
              <button type="submit" className={`btn primary yellow ${mem.innerBtn}`}>
                재설정하기
              </button>
            </div>
          </form>
        </div>
      </section>
      {modalAlert && (
        <Modal show={modalAlert !== null} onClose={closeAlert} type="alert">
          {modalAlert === "pwrequired" && <ModalAlert close={closeAlert} desc={`비밀번호는 4자 이상으로 만들어주세요.`} error={true} confirm={false} />}
          {modalAlert === "resetcomplete" && <ModalAlert close={closeAlert} desc={`비밀번호가 재설정되었습니다. 다시 로그인해주세요.`} error={false} confirm={true} onConfirm={confirmReset} />}
          {modalAlert === "pwnotmatch" && <ModalAlert close={closeAlert} desc={`비밀번호가 일치하지 않습니다.`} error={true} confirm={false} />}
          {modalAlert === "resetfailed" && <ModalAlert close={closeAlert} desc={`재설정이 완료되지 않았습니다.`} error={true} confirm={false} />}
        </Modal>
      )}
    </main>
  );
};

export default ResetPassword;
