import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { url } from "../store/ref";
import MainJobItem from "./MainJobItem";
import Map from "../pages/Map";
import style from "../css/Main.module.css";

const MainOffline = () => {
  const { t } = useTranslation();
  const [jobList, setJobList] = useState([]);
  const [location, setLocation] = useState({ lat: 37.529325, lon: 126.965706 });

  const fetchJobs = async (latitude, longitude) => {
    try {
      const response = await fetch(`${url}/mainOffline?&lat=${latitude}&lon=${longitude}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setJobList(data);
      } else {
        console.log("notAuthorized");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          fetchJobs(latitude, longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          fetchJobs(location.lat, location.lon); // 기본 위치로 데이터 가져오기
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      fetchJobs(location.lat, location.lon); // 기본 위치로 데이터 가져오기
    }
  }, []);

  return (
    <div className={style.offWrap}>
      <div className={style.mainMap}>
        <Map jobList={jobList} location={location} />
      </div>
      <ul className={style.jobList}>
        {jobList.length === 0 ? (
          <li className={style.emptyJob}>
            <strong>{t("main.emptyOfflineTitle")}</strong>
            <span>{t("main.emptyOfflineDesc")}</span>
          </li>
        ) : (
          jobList.map((item) => (
            <li key={item._id}>
              <MainJobItem item={item} tpye={"offLine"} />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default MainOffline;
