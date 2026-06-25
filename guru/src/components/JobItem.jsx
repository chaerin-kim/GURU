import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { setDates } from "../store/findjob";
import { isMockMode, url } from "../store/ref";
import { getMockUser } from "../mock/jobs";
import Modal from "../components/Modal";
import ModalAlert from "../components/ModalAlert";
import Detail from "./Detail";
import UserSlide from "./UserSlide";
import UserProfile from "./UserProfile";
import style from "../css/JobItem.module.css";

const JobItem = ({ item, jobOffer, findjob }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state) => state.findjob);
  const memoizedData = useMemo(() => data[item?._id] || {}, [data, item?._id]);
  const address = item?.location?.address?.split(" ");
  const newAddress = address?.slice(0, 2).join(" ");
  const [author, setAuthor] = useState(null);
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const [modalAlert, setModalAlert] = useState(null);

  /*매칭된 유저 찾기*/
  const matchingUser = item.applicants.find((applicant) => applicant.matched);
  const matchingID = matchingUser ? matchingUser.emailID : null;
  const matchingStatus = matchingUser ? matchingUser.status : null;

  /*on/off 상태관리*/
  const onOff = useMemo(() => {
    if (item?.category?.jobType === "onLine") {
      return "온라인";
    } else if (item?.category?.jobType === "offLine") {
      return "오프라인";
    }
    return null;
  }, [item?.category?.jobType]);

  /*모집상태 바인딩*/
  //[2 - 예약중 // 3,4 - 완료대기 // 5 - 완료]
  let appliStatus;
  if (item.status === 2) {
    appliStatus = { text: "예약중", val: "stat2" };
  } else if (item.status === 3) {
    appliStatus = { text: "완료대기", val: "stat3" };
  } else if (item.status === 4) {
    appliStatus = { text: "완료대기", val: "stat4" };
  } else if (item.status === 5) {
    appliStatus = { text: "완료", val: "stat5" };
  } else if (item.status === -1) {
    appliStatus = { text: "취소", val: "stat-1" };
  } else if (item.status === -2) {
    appliStatus = { text: "지원마감", val: "stat-2" };
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

  /*지원자 확인 클릭이벤트*/
  const aapliHandler = () => {
    if (item.status === 1 && item.applicants.length === 0) {
      setModalAlert("noneAppli");
    } else if (matchingUser) {
      if (item.status === 2 || item.status === 3 || item.status === 4 || item.status === 5 || item.status === -1) {
        const fetchMatchingUser = async () => {
          if (item.status === -1 && matchingStatus === 2) {
            setModalAlert("cancellJob");
          } else if (matchingID) {
            try {
              const response = await fetch(`${url}/findUserData/${matchingID}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              const user = await response.json();
              if (response.ok) {
                showUser("appliUser", user);
              } else {
                console.error("서버에러");
                alert("serverError");
              }
            } catch (error) {
              console.error("Fetch error:", error);
              alert("fetchError");
            }
          }
        };
        fetchMatchingUser();
      }
    } else if (!matchingUser) {
      if (item.status === -1) {
        setModalAlert("cancellJob");
      } else if (item.status === 1) {
        setShow(!show);
      }
    }
  };

  /*모달*/
  const showPopup = useCallback((content) => {
    setModal(content);
  }, []);
  const closePopup = useCallback(() => {
    setModal(null);
  }, []);
  const showAlert = useCallback((content) => {
    setModalAlert(content);
  }, []);
  const closeAlert = useCallback(() => {
    setModalAlert(null);
  }, []);
  const showUser = useCallback(
    (content, user) => {
      setModalUser({ content, user });
    },
    [modalUser]
  );
  const closeUser = useCallback(() => {
    setModalUser(null);
  }, []);

  return (
    <div className={`${style.itemWrap} ${findjob ? style.findJob : ""}`}>
      <div
        className={`${style.jobItem} ${style[item?.category?.jobType]}`}
        onClick={() => {
          navigate("/job-detail", { state: { _id: item._id } });
        }}>
        <div className={style.jobInfo}>
          {!jobOffer ? (
            <div className={style.thumb}>
              {!author?.image ? <img src={`${process.env.PUBLIC_URL}/img/common/no_img.jpg`} alt="이미지 없음" /> : <img src={`${url}/${author?.image}`} alt="프로필 이미지" />}
            </div>
          ) : null}
          <div className={style.jobDes}>
            {findjob ? (
              <div className={style.cateWrap}>
                <span>#{item?.category?.talent}</span>
                <span>#{item?.category?.field}</span>
              </div>
            ) : null}
            <h4>
              {!findjob ? <span className={style.jobCate}>{onOff}</span> : null}
              {item?.title}
            </h4>
            <div className={style.Price}>
              건당 <strong>{item?.pay.toLocaleString("ko-KR")}</strong>
              <span>원</span>
            </div>
            {jobOffer ? (
              <div className={style.btnWrap}>
                {item.status === 1 && (
                  <button
                    className="btn tertiary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/job-edit", { state: { _id: item._id } });
                    }}>
                    수정하기
                  </button>
                )}
                {item?.status === -2 ? (
                  <p>지원한 사람이 없습니다.</p>
                ) : (
                  <button
                    className="btn yellow"
                    onClick={(e) => {
                      e.stopPropagation();
                      aapliHandler();
                    }}>
                    지원자 확인
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>
        <div className={style.AppInfo}>
          <strong className={`${style[appliStatus.val]}`}>{appliStatus.text}</strong>
          <div>
            {item?.location?.address ? (
              <div className={style.row}>
                <span>약속장소</span>
                <p>{newAddress}</p>
              </div>
            ) : null}
            <div className={style.row}>
              <span>약속시간</span>
              <p>
                {memoizedData.workStartDate?.time || "-"}
                <span>~</span>
                {memoizedData.workEndDate?.time || "-"}
              </p>
            </div>
            <div className={style.row}>
              <span>약속 예정일</span>
              <p>{memoizedData.workStartDate?.date || "-"}</p>
            </div>
          </div>
        </div>
      </div>

      {jobOffer ? (
        <motion.div initial={false} animate={{ height: show ? "auto" : 0 }} style={{ overflow: "hidden" }} transition={{ duration: 0.3 }}>
          <UserSlide item={item} />
        </motion.div>
      ) : null}

      {modal && (
        <Modal show={modal !== null} onClose={closePopup} type="detail">
          {modal === "getDetail" && (
            <main>
              <h3 style={{ marginBottom: "1.4rem" }}>상세보기</h3>
              <Detail _id={item?._id} closeDetail={closePopup} />
            </main>
          )}
        </Modal>
      )}
      {modalUser && (
        <Modal show={modalUser !== null} onClose={closeUser} type="userProfile">
          {modalUser.content === "appliUser" && (
            <div>
              <h3 style={{ marginBottom: "1.4rem" }}>{modalUser.user.nickName}님 상세보기</h3>
              <UserProfile show={modalUser !== null} onClose={closeUser} user={modalUser.user} item={item} mactcing={true} />
            </div>
          )}
        </Modal>
      )}
      {modalAlert && (
        <Modal show={modalAlert !== null} onClose={closeAlert} type="alert">
          {modalAlert === "deleteOk" && <ModalAlert close={closeAlert} title={"구인관리 메시지"} desc={"구인글이 삭제되었습니다."} error={true} confirm={false} />}
          {modalAlert === "cancellJob" && <ModalAlert close={closeAlert} title={"구인관리 메시지"} desc={`${item.nickName}님이 취소 하신 구인글입니다.`} error={true} confirm={false} />}
          {modalAlert === "noneAppli" && (
            <ModalAlert
              close={closeAlert}
              title={"구인관리 메시지"}
              desc={
                <>
                  지원한 지원자가 없습니다.
                  <br />
                  조금더 기다려주세요.
                </>
              }
              error={false}
              confirm={false}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default JobItem;
