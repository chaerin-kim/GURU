import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { isMockMode, url } from "../store/ref";
import { getMockFindJobs } from "../mock/jobs";
import MainJobItem from "./MainJobItem";
import style from "../css/Main.module.css";

const MainOnline = () => {
  const { t } = useTranslation();
  const [jobList, setJobList] = useState([]);
  useEffect(() => {
    if (isMockMode) {
      setJobList(getMockFindJobs({ jobType: "onLine" }).slice(0, 3));
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`${url}/mainOnline`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          setJobList(data);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={style.onWrap}>
      <ul className={style.jobList}>
        {jobList.length === 0 ? (
          <li className={style.emptyJob}>
            <strong>{t("main.emptyOnlineTitle")}</strong>
            <span>{t("main.emptyOnlineDesc")}</span>
          </li>
        ) : (
          jobList.map((item) => (
            <li key={item._id}>
              <MainJobItem item={item} tpye={"onLine"} />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default MainOnline;
