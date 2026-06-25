import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, A11y } from "swiper/modules";

const MainSlide = () => {
  const { t } = useTranslation();
  const [swiperIndex, setSwiperIndex] = useState(0);
  const [swiper, setSwiper] = useState(null);
  const prevPage = () => {
    swiper?.slidePrev();
  };
  const nextPage = () => {
    swiper?.slideNext();
  };
  const goIndex = (index) => {
    swiper?.slideTo(index);
  };
  const slideStop = () => {
    swiper?.autoplay.stop();
  };

  const slidePlay = () => {
    swiper?.autoplay.start();
  };
  return (
    <section className="mainSwiper mw">
      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay]}
        slidesPerView={1}
        loop={true}
        speed={500}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        onActiveIndexChange={(e) => setSwiperIndex(e.realIndex)}
        onSwiper={(e) => {
          setSwiper(e);
        }}>
        <SwiperSlide>
          <div
            className="mainSlider slider01"
            style={{
              backgroundImage: `url("${process.env.PUBLIC_URL}/img/common/Main_Vis1.jpg")`,
            }}>
            <div className="sliderTxt">
              <img src={`${process.env.PUBLIC_URL}/img/common/VisLogo.png`} alt="VisLogo" />
              {t("main.slideHelper")}
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="mainSlider slider02"
            style={{
              backgroundImage: `url("${process.env.PUBLIC_URL}/img/common/Main_Vis2.jpg")`,
            }}>
            <div className="sliderTxt">
              <img src={`${process.env.PUBLIC_URL}/img/common/VisLogo.png`} alt="VisLogo" />
              {t("main.slideShortJob")}
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="mainSlider slider03"
            style={{
              backgroundImage: `url("${process.env.PUBLIC_URL}/img/common/Main_Vis3.jpg")`,
            }}>
            <div className="sliderTxt">
              <img src={`${process.env.PUBLIC_URL}/img/common/VisLogo.png`} alt="VisLogo" />
              {t("main.slideDogWalk")}
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <div className="pagination">
        <button onClick={prevPage}>
          <img src={`${process.env.PUBLIC_URL}/img/common/slide_arrow.svg`} alt="stop" />
        </button>
        <div className="slidePager">
          {swiper &&
            swiper.slides &&
            Array.from({ length: swiper.slides.length }).map((_, index) => <span key={index} className={`bullet ${swiperIndex === index ? "active" : ""}`} onClick={() => goIndex(index)}></span>)}
        </div>
        <button onClick={slideStop}>
          <img src={`${process.env.PUBLIC_URL}/img/common/slide_stop.svg`} alt="stop" />
        </button>
        <button onClick={slidePlay}>
          <img src={`${process.env.PUBLIC_URL}/img/common/slide_play.svg`} alt="stop" />
        </button>
        <button onClick={nextPage}>
          <img src={`${process.env.PUBLIC_URL}/img/common/slide_arrow.svg`} alt="stop" />
        </button>
      </div>
    </section>
  );
};

export default MainSlide;
