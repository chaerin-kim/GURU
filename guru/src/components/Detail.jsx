import { useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setDates } from '../store/findjob';
import { updateItemStatus } from '../store/updateItemStatus';
import { isMockMode, url } from '../store/ref';
import { getMockUser, mockJobs } from '../mock/jobs';
import { getProfileImageSrc } from '../utils/imageSrc';
import Modal from '../components/Modal';
import ModalAlert from '../components/ModalAlert';
import SatisfactionModal from './SatisfactionModal';
import CommentForm from './CommentForm';
import Map from '../pages/Map';
import ProgressBar from './ProgressBar';
import PaymentModal from '../components/PaymentModal'; // PaymentModal 컴포넌트 임포트
import style from '../css/Detail.module.css';

const Detail = ({ _id, closeDetail }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [modalAlert, setModalAlert] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false); // Payment 모달 상태 추가
  const [evaluationVisible, setEvaluationVisible] = useState(false); // 평가 모달 상태 추가
  const [item, setItem] = useState(null);
  const [author, setAuthor] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState([]);
  const [btnWrapStatus, setBtnWrapStatus] = useState(0);
  const [location, setLocation] = useState({});
  const data = useSelector((state) => state.findjob);
  const memoizedData = useMemo(() => data[item?._id] || {}, [data, item?._id]);

  const [matchedUser, setMatchedUser] = useState(null);

  /*지원여부 확인 */
  const applicatsCk = item?.applicants?.find(
    (applicant) => applicant.status === 1
  );
  /*매칭된 유저 찾기*/
  const matchingUser = item?.applicants?.find((applicant) => applicant.matched);
  const matchingID = matchingUser ? matchingUser.emailID : null;

  const openModal = (item) => {
    setItem(item);
    setPopupVisible(true);
  };

  const closeAlert = useCallback(() => {
    setPopupVisible(false); // 모달 닫기
  }, []);

  useEffect(() => {
    if (!_id) {
      showAlert('none_id');
    } else {
      if (isMockMode) {
        const result = mockJobs.find((job) => job._id === _id);
        if (!result) {
          showAlert('none_id');
          return;
        }
        dispatch(
          updateItemStatus({
            id: _id,
            status: result.status,
            applicants: result.applicants,
          })
        );
        setStatus(result.applicants);
        setBtnWrapStatus(result.status);
        setItem(result);
        return;
      }

      const fetchJob = async () => {
        try {
          const res = await fetch(`${url}/JobDetail/${_id}`);
          const result = await res.json();
          dispatch(
            updateItemStatus({
              id: _id,
              status: result.status,
              applicants: result.applicants,
            })
          );
          setStatus(result.applicants);
          setBtnWrapStatus(result.status);
          setItem(result);
          // console.log('result',result);
        } catch (error) {
          console.error(error);
        }
      };
      fetchJob();
    }
  }, [_id, dispatch]);

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
      setStatus(item.applicants);
      setLocation({ lat: item.location.mapY, lon: item.location.mapX });
    }
  }, [item, dispatch]);

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

  useEffect(() => {
    if (item) {
      const matchedApplicant = item.applicants.find(
        (applicant) => applicant.status === 2 && applicant.matched === true
      );
      if (matchedApplicant) {
        setMatchedUser(matchedApplicant);
      }
    }
  }, [item]);

  const showAlert = useCallback((content) => {
    setModalAlert(content);
  }, []);

  const closeAlertModal = useCallback(() => {
    if (modalAlert === 'appCencellOk') {
      if (closeDetail) {
        window.location.reload();
        closeDetail();
      }
    }
    setModalAlert(null);
  }, [modalAlert, navigate, closeDetail]);

  const deleteJob = useCallback(async () => {
    if (isMockMode) {
      showAlert('deleteOk');
      return;
    }

    try {
      const response = await fetch(`${url}/deleteJob/${_id}`, {
        method: 'DELETE',
      });
      const res = await response.json();
      if (res.message === 'ok') {
        showAlert('deleteOk');
      }
    } catch (error) {
      console.error(error);
    }
  }, [_id, showAlert]);

  const application = async () => {
    if (isMockMode) {
      showAlert('appOk');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${url}/application/${_id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setStatus(data.applicants);
        setBtnWrapStatus(data.status);
        dispatch(
          updateItemStatus({
            id: _id,
            status: data.status,
            applicants: data.applicants,
          })
        );
        showAlert('appOk');
      } else {
        setErrorMessage(data.message);
        showAlert('appError');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const appCancell = async () => {
    if (isMockMode) {
      showAlert('appCencellOk');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${url}/appCancell/${_id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(
          updateItemStatus({
            id: _id,
            status: data.jobPost.status,
            applicants: data.jobPost.applicants,
          })
        );
        setStatus(data.jobPost.applicants);
        setBtnWrapStatus(data.jobPost.status);
        showAlert('appCencellOk');
      } else {
        setErrorMessage(data.message);
        showAlert('appError');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 마감일
  let appliStatus = { text: '', val: 'stat1' };
  if (item) {
    if (item.status === 2) {
      appliStatus = { text: '예약중', val: 'stat2' };
    } else if (item.status === 3 || item.status === 4) {
      appliStatus = { text: '완료대기', val: 'stat3' };
    } else if (item.status === 5) {
      appliStatus = { text: '완료', val: 'stat5' };
    } else if (item.status === -1) {
      appliStatus = { text: '취소', val: 'stat-1' };
    } else {
      appliStatus = { text: memoizedData.dFormat || '-', val: 'stat1' };
    }
  }
  let statusText;
  if (item) {
    if (item.status === 1) {
      statusText = '모집중';
    } else if (item.status === 2) {
      statusText = '예약중';
    } else if (item.status === 3 || item.status === 4) {
      statusText = '완료대기';
    } else if (item.status === 5) {
      statusText = '완료';
    } else if (item.status === -1) {
      statusText = '취소완료';
    } else {
      appliStatus = '-';
    }
  }
  // 온오프 상태
  const onOff = useMemo(() => {
    if (item?.category?.jobType === 'onLine') {
      return '온라인';
    } else if (item?.category?.jobType === 'offLine') {
      return '오프라인';
    }
    return null;
  }, [item?.category?.jobType]);

  const handlePaymentSuccess = () => {
    setPaymentModalVisible(false);
    setEvaluationVisible(true);
  };

  return (
    <>
      <section
        className={`${style.topSection} ${style[item?.category.jobType]}`}
      >
        <div className="mw">
          <div className={style.thumb}>
            <img src={getProfileImageSrc(author?.image)} alt={author?.image ? '프로필 이미지' : '이미지 없음'} />
          </div>
          <div className={style.titleWrap}>
            <div className={style.cateWrap}>
              <span className={`${style.status} ${style[appliStatus.val]}`}>
                {statusText}
              </span>
              <span>{item?.category?.talent}</span>
              <span>{item?.category?.field}</span>
            </div>
            <h2>{item?.title}</h2>
            <label htmlFor="satisfied">
              <strong>
                {item?.nickName}
                <span>님</span>
              </strong>
              <span>신뢰도</span>
              <ProgressBar user={author} id={_id} />
            </label>
          </div>
        </div>
      </section>
      <section
        className={`${style.midSection} ${style[item?.category.jobType]} mw`}
      >
        <ul className={style.midUl}>
          <li>
            <i className="fa-solid fa-won-sign"></i>
            <p>
              <span>금액</span>
              {item?.pay.toLocaleString('ko-KR')}원
            </p>
          </li>
          <li>
            <i className="fa-solid fa-d"></i>
            <p>
              <span>모집마감</span>
              {appliStatus.text}
            </p>
          </li>
          <li>
            <i className="fa-regular fa-calendar-check"></i>
            <p>
              <span>약속날짜</span>
              {memoizedData.workStartDate?.date || '-'}
            </p>
          </li>
          <li>
            <i className="fa-regular fa-clock"></i>
            <p>
              <span>약속시간</span>
              {memoizedData.workStartDate?.time || '-'}~
              {memoizedData.workEndDate?.time || '-'}
            </p>
          </li>
          <li>
            <i className="fa-solid fa-location-dot"></i>
            <p>
              <span>근무형태</span>
              {onOff}
            </p>
          </li>
        </ul>

        <h2>상세설명</h2>
        <pre>{item?.desc}</pre>
        {item?.category?.jobType === 'offLine' && (
          <div className={style.mapArea}>
            <h2>
              주소
              <span>
                {item?.location.address} {item?.location.detailedAddress}
              </span>
            </h2>
            {item && location.lat && location.lon && (
              <Map jobList={[item]} location={location} />
            )}
          </div>
        )}
        <CommentForm btnWrapStatus={btnWrapStatus} id={_id} />
        <div className={`btnWrap ${style.detailBtnWRap}`}>
          {btnWrapStatus === 1 && (
            <>
              {user?.emailID === item?.emailID ? (
                <>
                  {item?.applicants.length === 0 || !applicatsCk ? (
                    <button
                      className="btn tertiary"
                      onClick={(e) => {
                        setModalAlert('deleteJob');
                      }}
                    >
                      삭제하기
                    </button>
                  ) : null}

                  <button
                    className="btn tertiary"
                    onClick={() =>
                      navigate('/job-edit', { state: { _id: item._id } })
                    }
                  >
                    수정하기
                  </button>
                  <button className="btn primary" onClick={() => navigate(-1)}>
                    뒤로가기
                  </button>
                </>
              ) : (
                <>
                  {status?.some(
                    (applicant) =>
                      applicant.emailID === user?.emailID &&
                      applicant.status === 1
                  ) ? (
                    <>
                      <button className="btn tertiary" onClick={appCancell}>
                        지원취소
                      </button>
                      <button
                        className="btn primary"
                        onClick={() => navigate(-1)}
                      >
                        뒤로가기
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn primary"
                        onClick={() => navigate(-1)}
                      >
                        뒤로가기
                      </button>
                      <button className="btn yellow" onClick={application}>
                        지원하기
                      </button>
                    </>
                  )}
                </>
              )}
            </>
          )}
          {btnWrapStatus === 2 &&
            (user?.emailID === item?.emailID ? (
              <button
                className="btn yellow"
                onClick={() => {
                  setPaymentModalVisible(true); // '결제 및 완료' 버튼을 클릭하면 PaymentModal을 표시합니다.
                }}
              >
                결제하기
              </button>
            ) : (
              <button
                className="btn yellow"
                onClick={() => {
                  setPopupVisible(true); 
                }}
              >
                만족도조사 및 완료
              </button>
            ))}

          {btnWrapStatus === 3 && (
            <>
              {user?.emailID === item?.emailID ? (
                <>
                  <button className="btn primary" onClick={() => navigate(-1)}>
                    뒤로가기
                  </button>
                  <button
                    className="btn yellow"
                    onClick={() => {
                      setPaymentModalVisible(true); // '결제 및 완료' 버튼을 클릭하면 PaymentModal을 표시합니다.
                    }}
                  >
                    결제 및 완료
                  </button>
                </>
              ) : (
                <>
                  <p>상대방이 완료처리 전입니다.</p>
                  <button className="btn primary" onClick={() => navigate(-1)}>
                    뒤로가기
                  </button>
                </>
              )}
            </>
          )}
          {btnWrapStatus === 4 && (
            <>
              {user?.emailID === matchingID ? (
                <button
                  className="btn yellow"
                  onClick={() => {
                    setPopupVisible(true); // '결제 및 완료' 버튼을 클릭하면 PaymentModal을 표시합니다.
                  }}
                >
                  결제 및 완료
                </button>
              ) : (
                <>
                  <p>상대방이 완료처리 전입니다.</p>
                  <button className="btn primary" onClick={() => navigate(-1)}>
                    뒤로가기
                  </button>
                </>
              )}
            </>
          )}
          {btnWrapStatus === 5 || btnWrapStatus === -1 ? (
            <button className="btn primary" onClick={() => navigate(-1)}>
              뒤로가기
            </button>
          ) : null}
        </div>
      </section>
      {popupVisible && (
        <SatisfactionModal
          onClose={closeAlert}
          type="alert"
          item={item}
          author={author}
        />
      )}
      {modalAlert && (
        <Modal
          show={modalAlert !== null}
          onClose={closeAlertModal}
          type="alert"
        >
          {modalAlert === 'deleteJob' && (
            <ModalAlert
              close={closeAlertModal}
              title={'상세페이지 메시지'}
              desc={'정말 삭제하시겠습니까?'}
              error={true}
              confirm={true}
              throwFn={deleteJob}
            />
          )}
          {modalAlert === 'appCancell' && (
            <ModalAlert
              close={closeAlertModal}
              title={'삭제 메시지'}
              desc={
                <>
                  지금 취소하시면 패널티를 받을수 있습니다.
                  <br />
                  정말 취소하시겠습니까?
                </>
              }
              error={true}
              confirm={true}
              throwFn={appCancell}
            />
          )}
          {modalAlert === 'deleteOk' && (
            <ModalAlert
              close={closeAlertModal}
              title={'상세페이지 메시지'}
              desc={'구인글이 삭제되었습니다.'}
              error={true}
              confirm={false}
            />
          )}
          {modalAlert === 'none_id' && (
            <ModalAlert
              close={closeAlertModal}
              title={'상세페이지 메시지'}
              desc={'잘못된 접근입니다.'}
              error={true}
              confirm={false}
              goPage={'/'}
            />
          )}
          {modalAlert === 'appError' && (
            <ModalAlert
              close={closeAlertModal}
              title={'상세페이지 메시지'}
              desc={errorMessage}
              error={true}
              confirm={false}
            />
          )}
          {modalAlert === 'appOk' && (
            <ModalAlert
              close={closeAlertModal}
              title={'상세페이지 메시지'}
              desc={'지원이 정상적으로 처리되었습니다.'}
              error={false}
              confirm={false}
            />
          )}
          {modalAlert === 'appCencellOk' && (
            <ModalAlert
              close={closeAlertModal}
              title={'상세페이지 메시지'}
              desc={'지원취소가 정상적으로 처리되었습니다.'}
              error={true}
              confirm={false}
            />
          )}
        </Modal>
      )}
      {paymentModalVisible && (
        <PaymentModal
          onClose={() => setPaymentModalVisible(false)}
          onSuccess={handlePaymentSuccess}
          author={author}
          matchedUser={matchedUser}
          item={item}
        />
      )}
      {evaluationVisible && (
        <SatisfactionModal
          onClose={() => setEvaluationVisible(false)}
          type="alert"
          item={item}
          author={author}
        />
      )}
    </>
  );
};

export default Detail;
