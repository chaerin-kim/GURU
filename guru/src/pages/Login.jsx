import { Link, Navigate } from "react-router-dom";
import { isMockMode, url } from "../store/ref";
import { useState } from "react";
import { useAuth } from "../assets/AuthContext";
import form from "../css/Form.module.css";
import mem from "../css/Memb.module.css";
import Modal from "../components/Modal";
import ModalAlert from "../components/ModalAlert";

const Login = () => {
  const [emailID, setEmailID] = useState("");
  const [password, setPassWord] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [modalAlert, setModalAlert] = useState(null);
  const { islogin } = useAuth();
  const isDev = process.env.NODE_ENV === "development" || isMockMode;
  const devUser = {
    emailID: "test@guru.local",
    password: "1234",
    userName: "개발테스트",
    nickName: "dev-user",
    phone: "01000000000",
    auth: "user",
    account: "",
  };
  const closeAlert = () => {
    setModalAlert(null);
  };

  const completeLogin = (data) => {
    localStorage.setItem("token", data.token);
    islogin();
    setRedirect(true);
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${url}/login`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ emailID, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        completeLogin(data);
      } else {
        const errorData = await response.json();
        console.log("로그인 중 에러 발생", errorData);
        setModalAlert("loginfailed");
      }
    } catch (error) {
      console.error("로그인 오류 발생:", error);
    }
  };

  const devLogin = async () => {
    if (isMockMode) {
      completeLogin({ token: "mock-token" });
      return;
    }

    try {
      const signupResponse = await fetch(`${url}/signup`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(devUser),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!signupResponse.ok && signupResponse.status !== 409) {
        throw new Error("Failed to create dev user");
      }

      const loginResponse = await fetch(`${url}/login`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          emailID: devUser.emailID,
          password: devUser.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!loginResponse.ok) {
        throw new Error("Failed to login dev user");
      }

      const data = await loginResponse.json();
      completeLogin(data);
    } catch (error) {
      console.error("Dev login failed:", error);
      setModalAlert("loginfailed");
    }
  };

  if (redirect) {
    return <Navigate to='/' />;
  }

  return (
    <main className='login fullLayout'>
      <h2>로그인</h2>
      <section className={`boxCon ${mem.boxCon}`}>
        <div className={mem.loginCon}>
          <form className={`${mem.form}`} onSubmit={login}>
            <div className='full'>
              <div className={`${mem.loginLabel} ${mem.emailLabel}`}>
                <input
                  className={`${mem.memInput} ${form.row}`}
                  type='email'
                  value={emailID}
                  placeholder=' '
                  onChange={(e) => {
                    setEmailID(e.target.value);
                  }}
                />
                <label htmlFor='email' className={mem.placeholder}>
                  이메일
                </label>
              </div>
              <div className={`${mem.loginLabel} ${mem.pwLabel}`}>
                <input
                  className={`${mem.memInput} ${form.row}`}
                  type='password'
                  value={password}
                  placeholder=' '
                  onChange={(e) => {
                    setPassWord(e.target.value);
                  }}
                />
                <label htmlFor='password' className={mem.placeholder}>
                  비밀번호
                </label>
              </div>
            </div>
            <div className={mem.btnWrap}>
              <button
                type='submit'
                className={`btn primary yellow ${mem.innerBtn}`}
              >
                로그인
              </button>
            </div>
            {isDev && (
              <div className={mem.devBtnWrap}>
                <button
                  type='button'
                  className={`btn primary ${mem.innerBtn}`}
                  onClick={devLogin}
                >
                  임시 로그인
                </button>
              </div>
            )}
          </form>
          <p className={mem.links}>
            <Link to='/findacct'>아이디/비밀번호 찾기</Link>
            <Link to='/signup'>회원가입</Link>
          </p>
        </div>
      </section>
      {modalAlert && (
        <Modal show={modalAlert !== null} onClose={closeAlert} type='alert'>
          {modalAlert === "loginfailed" && (
            <ModalAlert
              close={closeAlert}
              desc={"아이디나 비밀번호를 다시 확인해주세요."}
              error={true}
              confirm={false}
            />
          )}
        </Modal>
      )}
    </main>
  );
};

export default Login;
