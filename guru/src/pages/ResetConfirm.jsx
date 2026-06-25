import React from "react";
import { Link } from "react-router-dom";
import mem from "../css/Memb.module.css";

const ResetConfirm = () => {
  return (
    <main className='login fullLayout'>
      <h2 className={mem.spanMsgCon}>
        메일 전송 완료
        <span className={mem.spanMsg}>
          비밀번호 재설정을 위해 메일을 확인해주세요.
        </span>
        <span className={mem.spanMsg}>
          메일이 오지 않았다면 스팸설정을 확인해주세요.
        </span>
      </h2>
      <div className='btnWrap'>
        <Link to='/' className={`btn primary yellow ${mem.mainBtn}`}>
          메인으로
        </Link>
      </div>
    </main>
  );
};

export default ResetConfirm;
