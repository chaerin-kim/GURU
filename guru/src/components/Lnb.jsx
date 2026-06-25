import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import style from "../css/Lnb.module.css";

const Lnb = ({ onOFfFilter, statusFilter, onOffChange, statusChange, lnbHas, lnbHandler }) => {
  const { t } = useTranslation();
  const menuKR = useSelector((state) => state.pageInfo.menuKR);
  const menuEn = useSelector((state) => state.pageInfo.menuEn);
  const subMenu = useSelector((state) => state.pageInfo.subMenu);
  const currentPage = useSelector((state) => state.pageInfo.currentPage);
  const [show1, setShow1] = useState(true);
  const [show2, setShow2] = useState(true);

  return (
    <div className={`${style.lnb} lnbCompo`}>
      <h2>
        {t(menuKR, menuKR)}
        <span>{t(menuEn, menuEn)}</span>
      </h2>
      {currentPage.path === "/job-offer" || currentPage.path === "/applied-list" ? (
        <div className="filterWrap">
          <div>
            <div className={`${style.filter} ${show1 ? style.on : ""}`}>
              <strong onClick={() => setShow1(!show1)}>{t("filter.type")}</strong>
              <motion.div initial={false} animate={{ height: show1 ? "auto" : 0 }} style={{ overflow: "hidden" }} transition={{ duration: 0.3 }}>
                <button className={onOFfFilter === "all" ? style.active : ""} onClick={() => onOffChange("all")}>
                  {t("filter.all")}
                </button>
                <button className={onOFfFilter === "onLine" ? style.active : ""} onClick={() => onOffChange("onLine")}>
                  {t("filter.online")}
                </button>
                <button className={onOFfFilter === "offLine" ? style.active : ""} onClick={() => onOffChange("offLine")}>
                  {t("filter.offline")}
                </button>
              </motion.div>
            </div>
            <div className={`${style.filter} ${show2 ? style.on : ""}`}>
              <strong onClick={() => setShow2(!show2)}>{t("filter.status")}</strong>
              <motion.div initial={false} animate={{ height: show2 ? "auto" : 0 }} style={{ overflow: "hidden" }} transition={{ duration: 0.3 }}>
                <button className={statusFilter === "all" ? style.active : ""} onClick={() => statusChange("all")}>
                  {t("filter.all")}
                </button>
                <button className={statusFilter === 1 ? style.active : ""} onClick={() => statusChange(1)}>
                  {t("filter.recruiting")}
                </button>
                <button className={statusFilter === -2 ? style.active : ""} onClick={() => statusChange(-2)}>
                  {t("filter.closed")}
                </button>
                <button className={statusFilter === 2 ? style.active : ""} onClick={() => statusChange(2)}>
                  {t("filter.reserved")}
                </button>
                <button className={statusFilter === 3 ? style.active : ""} onClick={() => statusChange(3)}>
                  {t("filter.waitingComplete")}
                </button>
                <button className={statusFilter === 5 ? style.active : ""} onClick={() => statusChange(5)}>
                  {t("filter.complete")}
                </button>
                <button className={statusFilter === -1 ? style.active : ""} onClick={() => statusChange(-1)}>
                  {t("filter.canceled")}
                </button>
              </motion.div>
            </div>
            <button className="filterBtn btn primary yellow" onClick={lnbHandler}>
              {t("filter.search")}
            </button>
          </div>
        </div>
      ) : null}
      {subMenu.length > 0 && (
        <ul>
          {subMenu.map((menu) => (
            <li key={menu.pageName}>
              <Link to={menu.path} className={`${style.menuLink} ${currentPage.pageName === menu.pageName ? style.on : ""}`}>
                {t(menu.pageName, menu.pageName)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Lnb;
