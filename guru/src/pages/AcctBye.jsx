import React from "react";
import { Link } from "react-router-dom";
import mem from "../css/Memb.module.css";

const AcctBye = () => {
  return (
    <main className='login fullLayout'>
      <h2 className={mem.spanMsgCon}>
        회원탈퇴 완료
        <span className={mem.spanMsg}>
          회원탈퇴가 정상적으로 처리되었습니다.
        </span>
        <span className={mem.spanMsg}>
          그동안 저희 GURU를 이용해주셔서 감사합니다.
        </span>
      </h2>
      <div className='btnWrap'>
        <Link to='/' className='btn primary yellow'>
          메인으로
        </Link>
      </div>
    </main>
  );
};

export default AcctBye;
