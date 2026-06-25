import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../components/Modal";
import service from "../assets/termsOfService";
import privacy from "../assets/privacyPolicy";
import footer from "../css/Footer.module.css";
import style from "../css/Modal.module.css";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const [modal, setModal] = useState(null);
  const isEnglish = i18n.language === "en";

  const showPopup = (content) => {
    setModal(content);
  };

  const closePopup = () => {
    setModal(null);
  };

  return (
    <footer className={footer.footerCon}>
      <img src={`${process.env.PUBLIC_URL}/img/common/footerLogo.png`} alt="footerLogo"></img>
      <span onClick={() => showPopup("content1")}>{t("legal.privacyPolicy")}</span>
      <span onClick={() => showPopup("content2")}>{t("legal.termsOfService")}</span>
      <p>Copyright© Guru. All Rights Reserved.</p>
      <Modal show={modal !== null} onClose={closePopup}>
        {modal === "content1" && (
          <div className={style.terms}>
            <h3 className={style.termsTitle}>{t("legal.privacyTitle")}</h3>
            <pre>{isEnglish ? t("legal.privacyText") : privacy}</pre>
          </div>
        )}
        {modal === "content2" && (
          <div className={style.terms}>
            <h3 className={style.termsTitle}>{t("legal.serviceTitle")}</h3>
            <pre>{isEnglish ? t("legal.serviceText") : service}</pre>
          </div>
        )}
      </Modal>
    </footer>
  );
};

export default Footer;
