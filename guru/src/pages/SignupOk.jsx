import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const SignupOk = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  useEffect(() => {
    const emailID = query.get("emailID");
    const userName = query.get("userName");
    const nickName = query.get("nickName");
    const phone = query.get("phone");
    // const account = query.get("account");
    console.log("가입완료:", { emailID, userName, nickName, phone });
  }, [location.search]);

  return (
    <main className='login fullLayout'>
      <h2>
        회원가입 완료
        <span> GURU 회원가입을 진심으로 환영합니다.</span>
      </h2>
      <section className='boxCon'>
        <div className='textList'>
          <p>
            <span>이메일</span>
            <strong>{query.get("emailID")}</strong>
          </p>
          <p>
            <span>이름</span>
            <strong>{query.get("userName")}</strong>
          </p>
          <p>
            <span>닉네임</span>
            <strong>{query.get("nickName")}</strong>
          </p>
          <p>
            <span>연락처</span>
            <strong>{query.get("phone")}</strong>
          </p>
          {/* <p>
            <span>계좌번호</span>
            <strong>{query.get("account")}</strong>
          </p> */}
        </div>
      </section>
      <div className='btnWrap'>
        <Link to='/login' className='btn primary yellow'>
          로그인
        </Link>
      </div>
    </main>
  );
};

export default SignupOk;
