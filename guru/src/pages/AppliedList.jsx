import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setPageInfo } from "../store/pageInfo";
import { url } from "../store/ref";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import ModalAlert from "../components/ModalAlert";
import Lnb from "../components/Lnb";
import JobItem from "../components/JobItem";

const AppliedList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [jobList, setJobList] = useState([]);
  const [filteredJobList, setFilteredJobList] = useState([]);
  const [onOFffilter, setOnOffFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadPage, setLoadPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lnbHas, setLnbHas] = useState(false);
  const [modalAlert, setModalAlert] = useState(null);

  /*스크롤 이벤트 중복 방지*/
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

  useEffect(() => {
    dispatch(
      setPageInfo({
        menuKR: "page.appliedList",
        menuEn: "page.appliedListEn",
        currentPage: { pageName: "page.appliedList", path: "/applied-list" },
      })
    );
  }, [dispatch]);

  useEffect(() => {
    setLoadPage(1);
    fetchData(1, onOFffilter, statusFilter, true);
  }, [onOFffilter, statusFilter]);

  useEffect(() => {
    if (loadPage > 1) {
      fetchData(loadPage, onOFffilter, statusFilter, false);
    }
  }, [loadPage]);

  const fetchData = async (page, jobType, status, reset) => {
    const token = localStorage.getItem("token");
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(`${url}/applied?page=${page}&jobType=${jobType}&status=${status}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setJobList((prevJobList) => {
          if (reset) return data;
          const newJobList = [...prevJobList, ...data];
          return newJobList;
        });
        const totalCount = parseInt(response.headers.get("X-Total-Count"), 10);
        setTotalJobs(totalCount);
      } else {
        setModalAlert("notAuthorized");
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  /*스크롤 증가 이벤트*/
  const scrollEv = throttle(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    if (windowHeight + scrollTop >= documentHeight - 210 && !loading) {
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

  /* 필터링 */
  const onOffChange = useCallback((filter) => {
    setOnOffFilter(filter);
  }, []);
  const statusChange = useCallback((filter) => {
    setStatusFilter(filter);
  }, []);
  /* 모달 */
  const showAlert = useCallback((content) => {
    setModalAlert(content);
  }, []);
  const closeAlert = useCallback(() => {
    setModalAlert(null);
  }, []);
  const lnbHandler = () => {
    setLnbHas(!lnbHas);
  };

  return (
    <main className={`subPage appliedList ${lnbHas ? "has" : ""}`}>
      {loading && <Loading />}
      <section className="mw">
        <Lnb onOFfFilter={onOFffilter} statusFilter={statusFilter} onOffChange={onOffChange} statusChange={statusChange} lnbHas={lnbHas} lnbHandler={lnbHandler} />
        <div className="contents">
          <div className="conTitle">
            <button className="LobHandler" onClick={lnbHandler}></button>
          </div>
          <ul className="boxContainer">
            {jobList.length === 0 ? (
              <li className="noneList">{t("common.appliedJobEmpty")}</li>
            ) : (
              jobList.map((item) => (
                <li key={item._id}>
                  <JobItem item={item} applied={true} />
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
      {modalAlert && (
        <Modal show={modalAlert !== null} onClose={closeAlert} type="alert">
          {modalAlert === "notAuthorized" && <ModalAlert close={closeAlert} desc={t("common.loginRequired")} error={true} confirm={false} goPage={"/login"} />}
        </Modal>
      )}
    </main>
  );
};

export default AppliedList;
