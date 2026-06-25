import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setDates } from "../store/findjob";
import { isMockMode, url } from "../store/ref";
import { getMockUser } from "../mock/jobs";
import style from "../css/Main.module.css";

const MainJobItem = ({ item, tpye }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state) => state.findjob);
  const memoizedData = useMemo(() => data[item?._id] || {}, [data, item?._id]);
  const [author, setAuthor] = useState(null);
  const newAddress = item.location.address.split(" ").slice(0, 2).join(" ");
  const categoryLabel = (value) => {
    const labels = {
      재능무관: t("filter.anyTalent"),
      디자인: t("filter.design"),
      "IT·기술": t("filter.itTech"),
      "교육·강사": t("filter.education"),
      서비스: t("filter.service"),
      분야무관: t("filter.anyField"),
      "배포/체험단": t("filter.sampling"),
      SNS: t("filter.sns"),
      대행업무: t("filter.agency"),
      참여형: t("filter.participation"),
    };
    return labels[value] || value;
  };

  /*모집상태 바인딩*/
  let appliStatus;
  if (item.status === 2) {
    appliStatus = { text: t("filter.reserved"), val: "stat2" };
  } else if (item.status === 3) {
    appliStatus = { text: t("filter.complete"), val: "stat3" };
  } else if (item.status === -1) {
    appliStatus = { text: t("filter.canceled"), val: "stat-1" };
  } else {
    appliStatus = { text: memoizedData.dFormat, val: "stat1" };
  }
  useEffect(() => {
    if (item) {
      const { workStartDate, workEndDate, endDate } = item;
      dispatch(
        setDates({
          id: item._id,
          workStartDate,
          workEndDate,
          endDate,
        })
      );
    }
  }, [item, dispatch]);

  /* 작성자 확인 */
  useEffect(() => {
    if (item?.emailID) {
      if (isMockMode) {
        setAuthor(getMockUser(item.emailID));
        return;
      }

      const fetchUser = async () => {
        try {
          const res = await fetch(`${url}/findUserData/${item.emailID}`);
          const result = await res.json();
          setAuthor(result);
        } catch (error) {
          console.error(error);
        }
      };
      fetchUser();
    }
  }, [item]);
  /*디테일페이지 모달 or 페이지이동*/
  const goDetail = () => {
    navigate("/job-detail", { state: { _id: item._id } });
  };
  return (
    <div className={style.itemWrap} onClick={goDetail}>
      <div>
        <div className={style.itemTop}>
          <h3>{item?.title}</h3>
          {tpye === "offLine" && <span>{newAddress}</span>}
          <span>#{categoryLabel(item?.category?.talent)}</span>
          <span>#{categoryLabel(item?.category?.field)}</span>
        </div>
        <strong>{appliStatus.text}</strong>
      </div>
      <div>
        <div>
          {t("common.perTask")} <strong>{item?.pay.toLocaleString("ko-KR")}</strong>
          <span>{t("common.currency")}</span>
        </div>
        <div className={style.thumb}>
          {!author?.image ? <img src={`${process.env.PUBLIC_URL}/img/common/no_img.jpg`} alt={t("common.imageMissing")} /> : <img src={`${url}/${author?.image}`} alt={t("common.profileImage")} />}
        </div>
      </div>
    </div>
  );
};

export default MainJobItem;
