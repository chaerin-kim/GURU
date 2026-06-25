import { useState } from "react";
import { url } from "../store/ref";
import Modal from "../components/Modal";
import ModalAlert from "../components/ModalAlert";
import form from "../css/Form.module.css";
import mem from "../css/Memb.module.css";

const FindAcct = () => {
  const [modalAlert, setModalAlert] = useState(null);
  const [tab, setTab] = useState("findId");
  const [findEmail, setFindEmail] = useState("");

  const closeAlert = () => {
    setModalAlert(null);
  };

  const switchTab = (tab) => {
    setTab(tab);
  };
  const [formData, setFormData] = useState({
    userName: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };

  const idFindSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${url}/findacct/id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: formData.userName,
          phone: formData.phone,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setFindEmail(data.emailID);
        setModalAlert("idfindsuccess");
      } else {
        setModalAlert("findfailed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fwFindSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${url}/findacct/pw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailID: formData.emailID }),
      });
      if (response.ok) {
        setModalAlert("certain");
      } else {
        setModalAlert("findfailed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const confirmreset = () => {
    window.location.href = "/resetconfirm";
  };

  return (
    <main className={`login fullLayout`}>
      <section className={`${mem.boxCon} ${mem.findCon}`}>
        <div className={mem.loginCon}>
          <div className={mem.tab}>
            <button
              className={tab === "findId" ? mem.active : ""}
              onClick={() => switchTab("findId")}
            >
              아이디
            </button>
            <button
              className={tab === "findPw" ? mem.active : ""}
              onClick={() => switchTab("findPw")}
            >
              비밀번호
            </button>
          </div>
          {tab === "findId" && (
            <form className={`${mem.form}`} onSubmit={idFindSubmit}>
              <div className={`full ${mem.findForm}`}>
                <span className={mem.findmsg}>
                  ※ 회원가입시 입력한 이름과 연락처를 입력해주세요.
                </span>
                <div className={`${mem.loginLabel} ${mem.findLabel}`}>
                  <input
                    className={`${mem.memInput} ${form.row}`}
                    type='text'
                    name='userName'
                    placeholder=' '
                    onChange={handleChange}
                  />
                  <label htmlFor='userName' className={mem.placeholder}>
                    이름
                  </label>
                </div>
                <div className={`${mem.loginLabel} ${mem.findLabel}`}>
                  <input
                    className={`${mem.memInput} ${form.row}`}
                    type='text'
                    name='phone'
                    placeholder=' '
                    onChange={handleChange}
                  />
                  <label htmlFor='phone' className={mem.placeholder}>
                    연락처
                  </label>
                </div>
              </div>
              <div className={`${mem.btnWrap} ${mem.findBtn}`}>
                <button
                  type='submit'
                  className={`btn primary yellow ${mem.innerBtn}`}
                >
                  아이디 찾기
                </button>
              </div>
            </form>
          )}
          {tab === "findPw" && (
            <form className={`${mem.form}`} onSubmit={fwFindSubmit}>
              <div className={`full ${mem.findForm}`}>
                <span className={mem.findmsg}>
                  ※ 회원가입시 입력한 이메일아이디를 입력해주세요.
                </span>
                <div className={`${mem.loginLabel} ${mem.findLabel}`}>
                  <input
                    className={`${mem.memInput} ${form.row}`}
                    type='email'
                    name='emailID'
                    placeholder=' '
                    onChange={handleChange}
                  />
                  <label htmlFor='emailID' className={mem.placeholder}>
                    이메일
                  </label>
                </div>
              </div>
              <div className={`${mem.btnWrap} ${mem.findBtn}`}>
                <button
                  type='submit'
                  className={`btn primary yellow ${mem.innerBtn}`}
                >
                  비밀번호 찾기
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
      {modalAlert && (
        <Modal show={modalAlert !== null} onClose={closeAlert} type='alert'>
          {modalAlert === "idfindsuccess" && (
            <ModalAlert
              close={closeAlert}
              desc={`회원님의 아이디는 ${findEmail} 입니다.`}
              error={false}
              confirm={true}
            />
          )}
          {modalAlert === "certain" && (
            <ModalAlert
              close={closeAlert}
              desc={"비밀번호 재설정을 위한 이메일이 전송됩니다."}
              error={false}
              confirm={true}
              onConfirm={confirmreset}
            />
          )}
          {modalAlert === "findfailed" && (
            <ModalAlert
              close={closeAlert}
              desc={"입력하신 정보를 다시 확인해주세요."}
              error={true}
              confirm={false}
            />
          )}
        </Modal>
      )}
    </main>
  );
};

export default FindAcct;
