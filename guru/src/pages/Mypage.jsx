import { useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSubPage, resetSubPage } from "../store/pageInfo";
import Lnb from "../components/Lnb";

const Mypage = () => {
  const dispatch = useDispatch();
  const subPage = useMemo(
    () => ({
      subMenu: [
        { pageName: "프로필 수정", path: "/mypage/profileedit" },
        // { pageName: "결제 관리", path: "/mypage/guruPayment" },
        // { pageName: "알람", path: "/mypage/guruAlert" },
        { pageName: "회원정보 수정", path: "/mypage/personaledit" },
      ],
    }),
    []
  );
  useEffect(() => {
    dispatch(setSubPage(subPage));
    return () => {
      dispatch(resetSubPage());
    };
  }, [dispatch, subPage]);
  return (
    <main className='subPage'>
      <section className='mw'>
        <Lnb />
        <Outlet></Outlet>
      </section>
    </main>
  );
};

export default Mypage;
