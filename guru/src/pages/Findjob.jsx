import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setCateType } from "../store/findjob";
import { setCateField, setCateTalent } from "../store/filter";
import { url } from "../store/ref";
import Loading from "../components/Loading";
import JobItem from "../components/JobItem";
import Filter from "../components/Filter";
import Map from "./Map";
import "../css/Findjob.css";

const Findjob = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cateType = useSelector((state) => state.findjob.cateType);
  const cateTalent = useSelector((state) => state.filter.cateTalent);
  const cateField = useSelector((state) => state.filter.cateField);
  const [jobList, setJobList] = useState([]);
  const [filteredJobList, setFilteredJobList] = useState([]);
  const [location, setLocation] = useState({ lat: 37.529325, lon: 126.965706 });
  const [loadPage, setLoadPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cateTime, setCateTime] = useState([0, 1440]);
  const [titleText, setTitleText] = useState("");
  const [lnbHas, setLnbHas] = useState(false);
  const [modalAlert, setModalAlert] = useState(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // 스크롤 이벤트 중복 방지
  const throttle = (func, delay) => {
    let lastCall = 0;
    return (...args) => {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return func(...args);
    };
  };

  // 온라인 일자리 리스트 호출
  const callOnLine = () => {
    dispatch(setCateType({ cateType: "onLine" }));
    dispatch(setCateField("all"));
    dispatch(setCateTalent("all"));
  };

  // 오프라인 일자리 리스트 호출
  const callOffLine = () => {
    dispatch(setCateType({ cateType: "offLine" }));
    dispatch(setCateField("all"));
    dispatch(setCateTalent("all"));
  };

  // 데이터 가져오기
  useEffect(() => {
    setLoadPage(1);
    fetchData(1, cateTalent, cateField, cateTime, true);
  }, [cateTalent, cateField, cateTime, cateType]);

  useEffect(() => {
    if (loadPage > 1) {
      fetchData(loadPage, cateTalent, cateField, cateTime, false);
    }
  }, [loadPage]);

 // 데이터 가져오는 함수 수정
const fetchData = async (page, talent, field, cateTime, reset) => {
  if (loading) return;
  setLoading(true);
  try {
    let queryType = "";
    let endpoint = cateType === "offLine" ? "findoffLine" : "findonLine";
    
    if (cateType === "offLine" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          queryType = `&lat=${latitude}&lon=${longitude}`;
          await fetchJobs(endpoint, page, talent, field, cateTime, queryType, reset);
        },
        async (error) => {
          console.error("Error getting geolocation:", error);
          await fetchJobs(endpoint, page, talent, field, cateTime, queryType, reset);
        }
      );
    } else {
      await fetchJobs(endpoint, page, talent, field, cateTime, queryType, reset);
    }
  } catch (error) {
    console.error(error.message);
    setLoading(false);
  }
};

const fetchJobs = async (endpoint, page, talent, field, cateTime, queryType, reset) => {
  try {
    const response = await fetch(`${url}/${endpoint}?page=${page}&talent=${talent}&field=${field}&startCateTime=${cateTime[0]}&endCateTime=${cateTime[1]}${queryType}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.ok) {
      const totalCount = parseInt(response.headers.get("X-Total-Count"), 10);
      setTotalJobs(totalCount);
      setJobList((prevJobList) => {
        if (reset) return data;
        const newJobList = [...prevJobList, ...data];
        return newJobList;
      });
    } else {
      setModalAlert("notAuthorized");
    }
  } catch (error) {
    console.error(error.message);
  } finally {
    setLoading(false);
  }
};


  const searchTitle = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          dispatch(setCateField("all"));
          dispatch(setCateTalent("all"));
          const queryType = cateType === "offLine" ? `&lat=${latitude}&lon=${longitude}` : "";
          const endpoint = cateType === "offLine" ? "alloffLine" : "allonLine";
          const response = await fetch(`${url}/${endpoint}?titleText=${titleText}${queryType}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if (response.ok) {
            setJobList(Array.isArray(data) ? data : []);
            setTitleText("");
            disableScroll();
          } else {
            setModalAlert("notAuthorized");
          }
          setLoading(false); // 로딩 상태 false로 설정
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          setLoading(false); // 오류 시 로딩 상태 false로 설정
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLoading(false); // 지원되지 않을 경우 로딩 상태 false로 설정
    }
  };

  // 스크롤 비활성화
  const disableScroll = () => {
    window.removeEventListener("scroll", scrollEv);
    setScrollEnabled(false);
  };

  // 스크롤 활성화
  const enableScroll = () => {
    if (!scrollEnabled) {
      window.addEventListener("scroll", scrollEv);
      setScrollEnabled(true);
    }
  };

  // 스크롤 이벤트 처리
  const scrollEv = throttle(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    if (windowHeight + scrollTop >= documentHeight - 210) {
      if (jobList.length < totalJobs) {
        setLoadPage((prevPage) => prevPage + 1);
      }
    }
  }, 200);

  /* 스크롤 이벤트 상태관리*/
  useEffect(() => {
    window.addEventListener("scroll", scrollEv);
    return () => {
      window.removeEventListener("scroll", scrollEv);
    };
  }, [jobList, totalJobs, loading]);

  // 필터링 관련 상태 업데이트
  const talentChange = useCallback(
    (filter) => {
      dispatch(setCateTalent(filter));
    },
    [dispatch]
  );
  const fieldChange = useCallback(
    (filter) => {
      dispatch(setCateField(filter));
    },
    [dispatch]
  );
  const timeChange = useCallback((filter) => {
    setCateTime(filter);
  }, []);

  const lnbHandler = () => {
    setLnbHas(!lnbHas);
  };

  // 모달 관련 상태 업데이트
  const showAlert = useCallback((content) => {
    setModalAlert(content);
  }, []);

  const closeAlert = useCallback(() => {
    setModalAlert(null);
  }, []);
  return (
    <main className={`${cateType} findjob  ${lnbHas ? "has" : ""}`}>
      {loading && <Loading />}
      <section className="topSection">
        <div className="mw">
          <h2>
            {t("page.findJob")}
            <span>{t("page.findJobEn")}</span>
          </h2>
          <div className="tab">
            <button onClick={callOnLine} className={`${cateType === "onLine" ? "on" : ""}`}>
              {t("filter.online")}
            </button>
            <button onClick={callOffLine} className={`${cateType === "offLine" ? "on" : ""}`}>
              {t("filter.offline")}
            </button>
          </div>
          <label>
            <input
              type="text"
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              placeholder={t("common.keywordPlaceholder")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchTitle();
                }
              }}
            />
            <button type="button" onClick={searchTitle}></button>
          </label>
        </div>
      </section>
      <section className="mw midSection">
        <Filter
          cateTalent={cateTalent}
          cateField={cateField}
          cateTime={cateTime}
          talentChange={talentChange}
          fieldChange={fieldChange}
          timeChange={timeChange}
          lnbHas={lnbHas}
          lnbHandler={lnbHandler}
        />
        <div className="contents">
          <div className="conTitle">
            <button className="LobHandler" onClick={lnbHandler}></button>
          </div>
          <ul className="JobList">
            {cateType === "offLine" && (
              <li className="mapApiArea">
                <Map jobList={jobList} location={location} />
              </li>
            )}
            {jobList.length === 0 ? (
              <li className="noneList">{t("common.jobEmpty")}</li>
            ) : (
              jobList.map((item) => (
                <li key={item._id}>
                  <JobItem item={item} findjob={true} />
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default Findjob;
