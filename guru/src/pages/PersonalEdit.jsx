import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPageInfo } from "../store/pageInfo";
import { url } from "../store/ref";
import { logout } from "../store/userStore";
import form from "../css/Form.module.css";
import mem from "../css/Memb.module.css";
import Modal from "../components/Modal";
import ModalAlert from "../components/ModalAlert";

const PersonalEdit = () => {
  const [modalAlert, setModalAlert] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [authNum, setAuthNum] = useState(null);
  const [veriCode, setVeriCode] = useState("");

  const user = useSelector((state) => state.user.user);
  const emailID = user ? user.emailID : null;
  const userName = user ? user.userName : null;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const pageInfo = useMemo(
    () => ({
      menuKR: "마이 페이지",
      menuEn: "My Page",
      currentPage: { pageName: "회원정보 수정", path: "/mypage/profileedit" },
    }),
    []
  );
  const currentPage = useSelector((state) => state.pageInfo.currentPage);

  useEffect(() => {
    dispatch(setPageInfo(pageInfo));
  }, [dispatch, pageInfo]);

  const closeAlert = () => {
    setModalAlert(null);
  };

  //비번 변경의 경우 닫기함수 따로 만듦(로그아웃시키기)
  const closePwchanged = () => {
    dispatch(logout());
    navigate("/login");
  };

  const accountDel = () => {
    navigate("/mypage/acctdelete");
  };

  const [formData, setFormData] = useState({
    emailID: user ? user.emailID : "",
    password: "",
    userName: user ? user.userName : "",
    nickName: user ? user.nickName : "",
    phone: user ? user.phone : "",
    account: user ? user.account : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const phoneChange = (e) => {
    const input = e.target.value;
    const phoneValue = input.replace(/[^0-9]/g, "");
    // setPhone(phoneValue);
    setFormData({
      ...formData,
      phone: phoneValue,
    });
  };

  const sendSms = () => {
    fetch(`${url}/sendsms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: phone }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("sendsms not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setAuthNum(data.auth);
          setModalAlert("authsend");
        } else {
          setModalAlert("authsendfailed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setModalAlert("authsendfailed");
      });
  };

  const verifyCode = () => {
    fetch(`${url}/verifycode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: phone, code: veriCode }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("verifycode not ok");
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setModalAlert("authsuccess");
        } else {
          setModalAlert("authfailed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setModalAlert("authfailed");
      });
  };

  const editSubmit = async (e) => {
    e.preventDefault();

    //정보수정할때는 비번 입력 필수화시킴
    if (!formData.password) {
      setModalAlert("pwnotsubmit");
      return;
    }

    //비번 일치하지 않을때
    if (formData.password !== confirmPassword) {
      setModalAlert("pwnotmatch");
      return;
    }

    //아무것도 변경되지 않았을때
    if (
      formData.nickName === user.nickName &&
      formData.phone === user.phone &&
      formData.account === user.account &&
      !formData.password //비번 입력되지 않았을때
    ) {
      setModalAlert("notchanged");
      return;
    }

    try {
      const response = await fetch(`${url}/mypage/personaledit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // 경우에 따라 모달띄우기
      if (response.ok) {
        const data = await response.json();
        if (data.isPwChanged) {
          setModalAlert("pwchanged");
        } else if (data.isUpdated) {
          setModalAlert("editsuccess");
        } else {
          setModalAlert("notchanged");
        }
      } else {
        setModalAlert("editfailed");
      }
    } catch (error) {
      console.error("Error:", error);
      setModalAlert("editfailed");
    }
  };

  return (
    <div className="contents">
      <h3>{currentPage.pageName}</h3>
      <form className={` ${form.formStyle} ${mem.editForm}`} onSubmit={editSubmit}>
        <div className={form.formContainer}>
          <div className={`${form.formGrup} `}>
            <span>이메일(아이디)</span>
            <span className={mem.editSpan}>{emailID}</span>
          </div>
          <div className={form.formGrup}>
            <span>이름</span>
            <span className={mem.editSpan}>{userName}</span>
          </div>
          <div className={`${form.formGrup} `}>
            <span>비밀번호</span>
            <div className={form.formCon}>
              <input type="password" name="password" value={formData.password} onChange={handleChange} />
            </div>
          </div>
          <div className={`${form.formGrup} `}>
            <span>비밀번호 확인</span>
            <div className={form.formCon}>
              <input type="password" name="confirmPassword" value={confirmPassword} onChange={handleChange} />
            </div>
          </div>
          <div className={form.formGrup}>
            <span>닉네임</span>
            <div className={form.formCon}>
              <input type="text" name="nickName" value={formData.nickName} onChange={handleChange} />
            </div>
          </div>
          <div className={`${form.formGrup}`}>
            <span>연락처</span>
            <div className={`${form.formCon} ${form.addItem}`}>
              <div className={form.row}>
                <input type="text" className={mem.phoneInput} placeholder="하이픈(-) 제외 숫자만 입력" value={formData.phone} maxLength="11" onChange={phoneChange} />
                <button type="button" className={form.formBtn1} onClick={sendSms}>
                  인증하기
                </button>
              </div>
              <div className={form.row}>
                <input type="text" className={mem.authInput} placeholder="인증번호" value={veriCode} onChange={(e) => setVeriCode(e.target.value)} />
                <button type="button" className={form.formBtn2} onClick={verifyCode}>
                  확인
                </button>
              </div>
            </div>
          </div>

          {/* <div className={form.formGrup}>
              <span>계좌번호</span>
              <input
                type='text'
                name='account'
                placeholder=' '
                value={formData.account}
                onChange={handleChange}
              />
            </div> */}
        </div>
        <div className={mem.accountDel} onClick={accountDel}>
          <span>회원탈퇴</span>
        </div>
        <div className={`${mem.btnWrap} btnWrap`}>
          <button type="submit" className="btn primary yellow">
            정보수정
          </button>
        </div>
      </form>

      {modalAlert && (
        <Modal show={modalAlert !== null} onClose={closeAlert} type="alert">
          {modalAlert === "editsuccess" && <ModalAlert close={closeAlert} desc={"회원정보가 수정되었습니다."} error={false} confirm={true} />}
          {modalAlert === "editfailed" && <ModalAlert close={closeAlert} desc={"회원정보 수정에 실패했습니다."} error={true} confirm={false} />}
          {modalAlert === "pwnotmatch" && <ModalAlert close={closeAlert} desc={"비밀번호가 일치하지 않습니다."} error={true} confirm={false} />}
          {modalAlert === "pwnotsubmit" && <ModalAlert close={closeAlert} desc={"정보수정을 위해 비밀번호를 입력해주세요."} error={true} confirm={false} />}
          {modalAlert === "pwchanged" && <ModalAlert close={closePwchanged} desc={"비밀번호가 변경되었습니다. 다시 로그인해주세요."} error={false} confirm={true} />}
          {modalAlert === "notchanged" && <ModalAlert close={closeAlert} desc={"변경된 정보가 없습니다."} error={true} confirm={false} />}
          {modalAlert === "authsend" && <ModalAlert close={closeAlert} desc={"인증번호 전송이 완료되었습니다."} error={false} confirm={true} />}
          {modalAlert === "authsendfailed" && <ModalAlert close={closeAlert} desc={"입력하신 번호를 확인해주세요"} error={true} confirm={false} />}
          {modalAlert === "authsuccess" && <ModalAlert close={closeAlert} desc={"인증이 완료되었습니다."} error={false} confirm={true} />}
          {modalAlert === "authfailed" && <ModalAlert close={closeAlert} desc={"인증번호를 다시 확인해주세요."} error={true} confirm={false} />}
        </Modal>
      )}
    </div>
  );
};

export default PersonalEdit;
