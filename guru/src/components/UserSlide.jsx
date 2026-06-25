import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useEffect, useState } from "react";
import Modal from "../components/Modal";
import UserProfile from "./UserProfile";
import { isMockMode, url } from "../store/ref";
import { getMockUsers } from "../mock/jobs";
import ProgressBar from "./ProgressBar";

const UserSlide = ({ item }) => {
  const [swiperIndex, setSwiperIndex] = useState(0);
  const [swiper, setSwiper] = useState(null);
  const [itemAppli, setItemAppli] = useState();
  const [userList, setUserList] = useState([]);
  const [modal, setModal] = useState(null);

  const prevPage = () => {
    swiper?.slidePrev();
  };
  const nextPage = () => {
    swiper?.slideNext();
  };

  useEffect(() => {
    if (swiper) {
      swiper.on("slideChange", () => {
        setSwiperIndex(swiper.realIndex);
      });
    }
  }, [swiper]);

  useEffect(() => {
    if (item) {
      setItemAppli(item.applicants);
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      if (itemAppli) {
        if (isMockMode) {
          setUserList(getMockUsers(itemAppli));
          return;
        }

        try {
          const response = await fetch(`${url}/userList`, {
            method: "POST",
            body: JSON.stringify({
              itemAppli,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserList(data);
          } else {
            console.error("서버에러");
          }
        } catch (error) {
          console.error("Fetch error:", error);
        }
      }
    };
    fetchData();
  }, [itemAppli]);

  const showPopup = useCallback((content, user) => {
    setModal({ content, user });
  }, []);
  const closePopup = useCallback(() => {
    setModal(null);
  }, []);

  const userProfile = (user) => {
    showPopup("userProfile", user);
  };
  return (
    <div className="userSlide">
      <Swiper
        centeredSlides={true}
        onSlideChange={(e) => setSwiperIndex(e.realIndex)}
        onSwiper={(e) => {
          setSwiper(e);
        }}
        breakpoints={{
          320: {
            slidesPerView: 2,
            spaceBetween: 8,
          },
          660: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
        }}>
        {userList.map((user) => (
          <SwiperSlide key={user?._id}>
            <div className="userCard" onClick={() => userProfile(user)}>
              <div className="thumb">
                {!user?.image ? <img src={`${process.env.PUBLIC_URL}/img/common/no_img.jpg`} alt="이미지 없음" /> : <img src={`${url}/${user?.image}`} alt="프로필 이미지" />}
              </div>
              <div className="userInfo">
                <strong>
                  {user?.nickName}
                  <span>님</span>
                </strong>
                <label htmlFor="trust">신뢰도</label>
                <ProgressBar user={user} />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className={`userPrevBtn ${swiperIndex === 0 ? "disabled" : ""}`} disabled={swiperIndex === 0} onClick={prevPage}>
        <img src={`${process.env.PUBLIC_URL}/img/common/userSlide_arrow.svg`} alt="prev 없음" />
      </button>
      <button className={`userNextBtn ${swiperIndex === userList.length - 1 ? "disabled" : ""}`} disabled={swiperIndex === userList.length - 1} onClick={nextPage}>
        <img src={`${process.env.PUBLIC_URL}/img/common/userSlide_arrow.svg`} alt="next" />
      </button>
      {modal && (
        <Modal show={modal !== null} onClose={closePopup} type="userProfile">
          {modal.content === "userProfile" && (
            <div>
              <UserProfile show={modal !== null} onClose={closePopup} user={modal.user} item={item} />
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default UserSlide;
