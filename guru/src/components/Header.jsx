import React, { useState, useEffect } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { userState } from "../store/userStore";
import { url } from "../store/ref";
import { useAuth } from "../assets/AuthContext";
import Modal from "../components/Modal";
import ModalAlert from "../components/ModalAlert";
import Profile from "../components/Profile";
import style from "../css/Header.module.css";

const Header = () => {
  const { t, i18n } = useTranslation();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isMypage, setIsMypage] = useState(false);
  const [isIconChanged, setIsIconChanged] = useState(false);
  const [modal, setModal] = useState(null);
  const [modalAlert, setModalAlert] = useState(null);
  const [visible, setVisible] = useState(true);
  const emailID = user ? user?.emailID : null;
  const nickName = user ? user?.nickName : null;
  const certified = user ? user?.certified : null;
  const { isAuthenticated, isLogout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("로그인하지 않은 상태입니다.");
          setLoading(false);
          return;
        }
        const response = await fetch(`${url}/profile`, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const userInfo = await response.json();
          dispatch(userState(userInfo));
        } else {
          const errorData = await response.json();
          console.error("fetchProfile 에러:", errorData.message);
          setModalAlert("invalidaccess");
        }
      } catch (error) {
        console.error("fetchProfile 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [dispatch, location]);

  useEffect(() => {
    if (isAuthenticated) {
      if (certified === false) {
        showPopup("profile");
      }
    }
  }, [certified]);

  useEffect(() => {
    setIsMypage(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };
    const windowWidth = () => {
      if (window.innerWidth >= 990) {
        setIsMypage(false);
        setIsIconChanged(false);
        window.addEventListener("scroll", handleScroll);
      } else {
        window.removeEventListener("scroll", handleScroll);
      }
    };
    windowWidth();
    window.addEventListener("resize", windowWidth);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", windowWidth);
    };
  }, []);

  const logout = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${url}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        setVisible(false);
        dispatch(userState(null));
        isLogout();
        window.location.href = "/";
      } else {
        console.error("로그아웃 실패:", response.statusText);
      }
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  const closeAlert = () => {
    setModalAlert(null);
  };
  const showPopup = (content) => {
    setModal(content);
  };
  const closePopup = () => {
    setModal(null);
  };
  const mypageClick = () => {
    setIsIconChanged(!isIconChanged);
    setIsMypage(!isMypage);
  };
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  };

  return (
    <header className={style.header}>
      <h1>
        <Link to="/">
          <img src={`${process.env.PUBLIC_URL}/img/common/logo.svg`} alt="logo" />
        </Link>
      </h1>
      <div className={style.gnb}>
        <nav>
          <NavLink to="/findjob" className={({ isActive }) => (isActive ? `${style.active}` : "")}>
            {t("nav.findJob")}
          </NavLink>
          <NavLink to="/applied-list" className={({ isActive }) => (isActive ? `${style.active}` : "")}>
            {t("nav.appliedList")}
          </NavLink>
          <NavLink to="/job-offer" className={({ isActive }) => (isActive ? `${style.active}` : "")}>
            {t("nav.jobOffer")}
          </NavLink>
          <NavLink to="/job-write" className={({ isActive }) => (isActive ? `${style.active}` : "")}>
            {t("nav.jobWrite")}
          </NavLink>
        </nav>
        <div className={style.langToggle} aria-label={t("language.label")}>
          <button type="button" className={i18n.language === "ko" ? style.activeLang : ""} onClick={() => changeLanguage("ko")}>
            KO
          </button>
          <button type="button" className={i18n.language === "en" ? style.activeLang : ""} onClick={() => changeLanguage("en")}>
            EN
          </button>
        </div>
        {isAuthenticated ? (
          <div className={style.loginDiv}>
            <div className={style.thumb} onClick={mypageClick}>
              {!user?.image ? <img src={`${process.env.PUBLIC_URL}/img/common/no_img.jpg`} alt={t("common.imageMissing")} /> : <img src={`${url}/${user?.image}`} alt={t("common.profileImage")} />}
            </div>
          </div>
        ) : (
          <div className={style.logoutDiv}>
            <Link to="/login" className={`${style.goJoin} btn primary yellow`}>
              {t("nav.login")}
            </Link>
          </div>
        )}
      </div>
      <button className={style.ham} onClick={mypageClick}>
        <i className={isIconChanged ? "fa-solid fa-x" : "fa-solid fa-bars"}></i>
      </button>

      <div className={style.mypage} style={{ display: isMypage && visible ? "flex" : "none" }}>
        {isAuthenticated ? (
          <>
            <span>{t("menu.currentAccount")}</span>
            <div className={style.myprofile}>
              <div className={style.profileThumb}>
                {!user?.image ? <img src={`${process.env.PUBLIC_URL}/img/common/no_img.jpg`} alt={t("common.imageMissing")} /> : <img src={`${url}/${user?.image}`} alt={t("common.profileImage")} />}
              </div>
              <div>
                <h2>{nickName ? nickName : t("menu.noNickname")}</h2>
                <p>{emailID}</p>
              </div>
            </div>
          </>
        ) : (
          <div className={style.logoutBtn}>
            <Link to="/login" className={`${style.goLogin} btn primary yellow`}>
              {t("nav.login")}
            </Link>
          </div>
        )}
        <ul>
          {isAuthenticated ? <li>{t("menu.quickMenu")}</li> : <li>{t("menu.menu")}</li>}
          <li>
            <Link to="/findjob">{t("nav.findJob")}</Link>
          </li>
          <li>
            <Link to="/applied-list">{t("nav.appliedList")}</Link>
          </li>
          <li>
            <Link to="/job-write">{t("nav.jobWrite")}</Link>
          </li>
          <li>
            <Link to="/job-offer">{t("nav.jobOffer")}</Link>
          </li>
        </ul>
        {isAuthenticated && (
          <ul>
            <li>
              <Link to="/mypage/profileedit">{t("menu.profileEdit")}</Link>
            </li>
            <li>
              <Link to="/mypage/personaledit">{t("menu.personalEdit")}</Link>
            </li>
            <li>
              <Link to="/logout" onClick={logout}>
                {t("nav.logout")}
              </Link>
            </li>
          </ul>
        )}
      </div>
      {modal && (
        <Modal show={modal !== null} onclose={closePopup} type={"profile"}>
          {modal === "profile" && <Profile show={modal !== null} onclose={closePopup} mode={"등록"} modal={true} />}
        </Modal>
      )}
      {modalAlert && (
        <Modal show={modalAlert !== null} onClose={closeAlert} type="alert">
          {modalAlert === "invalidaccess" && <ModalAlert close={closeAlert} desc={t("common.loginError")} error={true} confirm={false} />}
        </Modal>
      )}
    </header>
  );
};

export default Header;
