import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setCateField, setCateTalent } from "../store/filter";
import { setCateType } from "../store/findjob";
import MainSlide from "../components/MainSlide";
import MainOnline from "../components/MainOnline";
import MainOffline from "../components/MainOffline";
import style from "../css/Main.module.css";

const Main = () => {
  const { t } = useTranslation();
  // const cateType = useSelector((state) => state.findjob.cateType);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fieldLinkClick = (field, cateType) => {
    dispatch(setCateField(field));
    dispatch(setCateType({ cateType }));
    dispatch(setCateTalent("all"));
    navigate("/findjob");
  };
  const talentLinkClick = (talent, cateType) => {
    dispatch(setCateField("all"));
    dispatch(setCateType({ cateType }));
    dispatch(setCateTalent(talent));
    navigate("/findjob");
  };
  const goFindJob = (cateType) => {
    dispatch(setCateField("all"));
    dispatch(setCateTalent("all"));
    dispatch(setCateType({ cateType }));
    navigate("/findjob");
  };

  return (
    <main className={`${style.main} main`}>
      <MainSlide />
      <section className={`${style.category} mw`}>
        <div onClick={() => fieldLinkClick("배포/체험단", "onLine")}>
          <img src={`/img/common/cate1.png`} alt="cate1" />
          {t("main.reviewCrew")}
        </div>
        <div onClick={() => fieldLinkClick("SNS", "onLine")}>
          <img src={`/img/common/cate2.png`} alt="cate1" />
          SNS
        </div>
        <div onClick={() => fieldLinkClick("참여형", "onLine")}>
          <img src={`/img/common/cate5.png`} alt="cate1" />
          {t("filter.participation")}
        </div>
        <div onClick={() => fieldLinkClick("대행업무", "offLine")}>
          <img src={`/img/common/cate3.png`} alt="cate1" />
          {t("filter.agency")}
        </div>
        <div onClick={() => fieldLinkClick("서비스", "offLine")}>
          <img src={`/img/common/cate4.png`} alt="cate1" />
          {t("filter.service")}
        </div>
      </section>
      <section className={`${style.MainOnline}`}>
        <h2>
          <img src={`${process.env.PUBLIC_URL}/img/common/main_h2_online.svg`} alt="logo" />
          {t("page.findJob")}
        </h2>
        <div className="mw">
          <MainOnline />
          <button onClick={() => goFindJob("onLine")} className="btn primary">
            {t("common.more")}
          </button>
        </div>
      </section>
      <section className={`${style.MainOffline}`}>
        <h2>
          <img src={`${process.env.PUBLIC_URL}/img/common/main_h2_offline.svg`} alt="logo" />
          {t("page.findJob")}
        </h2>
        <div className="mw">
          <MainOffline />
          <button onClick={() => goFindJob("offLine")} className="btn primary green">
            {t("common.more")}
          </button>
        </div>
      </section>
      <section className={style.talent}>
        <h2>
          {t("main.talentCategory")}
          <span>
            {t("main.talentCategoryDesc")}
          </span>
        </h2>
        <div className="mw">
          <div onClick={() => talentLinkClick("디자인", "onLine")}>
            <strong>{t("filter.design")}</strong>
            <p>
              {t("main.webMobileDesign")}
              <br />{t("main.graphicVideoEdit")}
            </p>
            <img src={`${process.env.PUBLIC_URL}/img/common/mcate1.png`} alt={t("filter.design")} />
          </div>
          <div onClick={() => talentLinkClick("IT·기술", "onLine")}>
            <strong>{t("filter.itTech")}</strong>
            <p>
              {t("main.programming")}
              <br />{t("main.systemNetwork")}
            </p>
            <img src={`${process.env.PUBLIC_URL}/img/common/mcate2.png`} alt={t("filter.itTech")} />
          </div>
          <div onClick={() => talentLinkClick("교육·강사", "offLine")}>
            <strong>{t("filter.education")}</strong>
            <p>
              {t("main.entranceForeign")}
              <br />{t("main.dispatchedInstructor")}
            </p>
            <img src={`${process.env.PUBLIC_URL}/img/common/mcate3.png`} alt={t("filter.education")} />
          </div>
          <div onClick={() => talentLinkClick("서비스", "offLine")}>
            <strong>{t("filter.service")}</strong>
            <p>
              {t("main.deliveryAgency")}
              <br />
              {t("main.cs")}
            </p>
            <img src={`/img/common/mcate4.png`} alt="cate1" />
          </div>
        </div>
      </section>
      <section className={style.guruBanner}>
        <div className="mw">
          <div className={style.BannerImg}>
            <img src={`${process.env.PUBLIC_URL}/img/common/guru_banner.png`} alt="banner" />
          </div>
          <div className={style.BannerText}>
            <h3>
              <img src={`${process.env.PUBLIC_URL}/img/common/logo.svg`} alt="Guru" />
              <br />
              {t("main.bannerTitle")}
            </h3>
            <p>{t("main.bannerBody")}</p>
            <Link to="/findjob" className="btn primary">
              {t("main.findJobCta")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Main;
