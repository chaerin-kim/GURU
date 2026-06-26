import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState, useCallback } from "react";
import { setPageInfo } from "../store/pageInfo";
import { useForm, Controller } from "react-hook-form";
import { isMockMode, url } from "../store/ref";
import DatePicker from "react-datepicker";
import { enUS, ko } from "date-fns/locale";
import Select from "react-select";
import DaumPostcode from "react-daum-postcode";
import Lnb from "../components/Lnb";
import Modal from "../components/Modal";
import ModalAlert from "../components/ModalAlert";
import { geocodeAddress, getDefaultCoords } from "../utils/kakaoMap";
import "react-datepicker/dist/react-datepicker.css";
import style from "../css/Form.module.css";

const JobWrit = () => {
  const { t, i18n } = useTranslation();
  const datePickerLocale = i18n.language === "en" ? enUS : ko;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(null);
  const [modalAlert, setModalAlert] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [jobType, setJobType] = useState("onLine");
  const [workDate, setWorkDate] = useState(null);
  const [workStartTime, setWorkStartTime] = useState(null);
  const [workEndTime, setWorkEndTime] = useState(null);
  const [filteredEndTimeOp, setFilteredEndTimeOp] = useState([]);
  const [zonecode, setZonecode] = useState("");
  const [address, setAddress] = useState("");
  const [mapX, setMapX] = useState(null);
  const [mapY, setMapY] = useState(null);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({});
  const endDate = watch("endDate");

  const setWorkDateFn = useCallback(
    (date) => {
      if (workStartTime && workStartTime.value) {
        const workStartTimeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), workStartTime.value.getHours(), workStartTime.value.getMinutes());
        setWorkStartTime((prev) => ({ ...prev, value: workStartTimeDate }));

        if (workEndTime && workEndTime.value) {
          const workEndTimeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), workEndTime.value.getHours(), workEndTime.value.getMinutes());
          setWorkEndTime((prev) => ({ ...prev, value: workEndTimeDate }));
        }
      }
    },
    [workStartTime, workEndTime]
  );
  const workDateChange = (date, field) => {
    setWorkDate(date);
    setWorkDateFn(date);
    field.onChange(date);
  };

  const selectTimeOp = (workDate) => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourStr = hour < 10 ? `0${hour}` : hour;
        const minuteStr = minute < 10 ? `0${minute}` : minute;
        const dateSet = workDate || new Date();
        const timeValue = new Date(dateSet.getFullYear(), dateSet.getMonth(), dateSet.getDate(), hour, minute);
        times.push({ value: timeValue, label: `${hourStr}:${minuteStr}` });
      }
    }
    return times;
  };
  const workStartTimeOp = useMemo(() => selectTimeOp(workDate), [workDate]);
  const workEndTimeOp = useMemo(() => selectTimeOp(workDate), [workDate]);

  useEffect(() => {
    dispatch(
      setPageInfo({
        menuKR: "page.jobWrite",
        menuEn: "page.jobWriteEn",
        currentPage: { pageName: "page.jobWrite", path: "/job-wirt" },
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (workStartTime) {
      setFilteredEndTimeOp(workEndTimeOp.filter((option) => option.value > workStartTime.value));
    } else {
      setFilteredEndTimeOp(workEndTimeOp);
    }
  }, [workStartTime, workEndTimeOp]);

  useEffect(() => {
    setValue("zonecode", zonecode);
    setValue("address", address);
    if (address) {
      if (isMockMode || !window.kakao?.maps?.services) {
        const setFallbackCoords = async () => {
          try {
            const coords = isMockMode ? getDefaultCoords() : await geocodeAddress(address);
            setMapX(coords.mapX);
            setMapY(coords.mapY);
          } catch (error) {
            const coords = getDefaultCoords();
            console.warn("Failed to geocode address. Falling back to default coordinates.", error);
            setMapX(coords.mapX);
            setMapY(coords.mapY);
          }
        };
        setFallbackCoords();
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setMapY(result[0].y);
          setMapX(result[0].x);
        } else {
          console.error("잘못된 주소", status);
          setMapY(null);
          setMapX(null);
        }
      });
    }
  }, [zonecode, address, setValue]);

  /*유형 성택에 따른 주소영역 핸들링  */
  const jobTypeFn = (e) => {
    setJobType(e.target.value);
    if (e.target.value === "offLine") {
      setIsOffline(true);
    } else {
      setIsOffline(false);
      setZonecode("");
      setAddress("");
      setValue("zonecode", "");
      setValue("detailedAddress", "");
    }
  };

  /* Slect*/
  const customStyles = {
    placeholder: (provided) => ({
      ...provided,
      color: "var(--cr-g1)",
      fontSize: "1.6rem",
      fontWeight: "400",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "var(--cr-bl1)",
      fontSize: "1.6rem",
      fontWeight: "700",
    }),
    control: (provided, state) => ({
      ...provided,
      borderBottomWidth: state.isFocused ? "2px" : "1px",
      borderColor: state.isFocused ? "var(--cr-bl1)" : "var(--cr-line)",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#ccc",
      },
    }),
  };

  const cateTalentOp = [
    { value: "재능무관", label: t("filter.anyTalent") },
    { value: "디자인", label: t("filter.design") },
    { value: "IT·기술", label: t("filter.itTech") },
    { value: "교육·강사", label: t("filter.education") },
    { value: "서비스", label: t("filter.service") },
  ];
  const cateFieldOp = [
    { value: "분야무관", label: t("filter.anyField") },
    { value: "배포/체험단", label: t("filter.sampling") },
    { value: "대행업무", label: t("filter.agency") },
    { value: "SNS", label: "SNS" },
    { value: "참여형", label: t("filter.participation") },
    { value: "서비스", label: t("filter.service") },
  ];

  /*pay */
  const setPayFn = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const intValue = parseInt(value, 10);
    return isNaN(intValue) ? 0 : intValue;
  };
  const formatPay = (value) => {
    return value.toLocaleString("ko-KR");
  };

  /* Modal */
  const showPopup = (content) => {
    setModal(content);
  };
  const closePopup = () => {
    setModal(null);
  };
  const showAlert = (content) => {
    setModalAlert(content);
  };

  const closeAlert = () => {
    setModalAlert(null);
  };

  /* 주소 API */
  const completeHandler = (data) => {
    const { address, zonecode } = data;
    setZonecode(zonecode);
    setAddress(address);
    setModal(false);
    setValue("zonecode", zonecode);
    trigger("zonecode");
  };
  // const closeHandler = (state) => {
  //   if (state === "FORCE_CLOSE" || state === "COMPLETE_CLOSE") {
  //     setModal(false);
  //   }
  // };

  const onSubmit = async (data) => {
    const { title, endDate, detailedAddress, pay, cateTalent, cateField, desc } = data;
    const token = localStorage.getItem("token");
    if (workStartTime && workEndTime) {
      if (isMockMode) {
        showAlert("WriteOk");
        return;
      }

      const workStartTimeUTC = new Date(workStartTime.value).toISOString();
      const workEndTimeUTC = new Date(workEndTime.value).toISOString();
      const response = await fetch(`${url}/jobWrit`, {
        method: "POST",
        body: JSON.stringify({
          title,
          endDate,
          workStartDate: workStartTimeUTC,
          workEndDate: workEndTimeUTC,
          location: {
            zonecode,
            address,
            detailedAddress,
            mapX,
            mapY,
          },
          pay,
          desc,
          category: {
            jobType,
            time: `${Math.floor((new Date(workEndTimeUTC) - new Date(workStartTimeUTC)) / 60000)}`,
            talent: cateTalent.value,
            field: cateField.value,
          },
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        showAlert("WriteOk");
      } else {
        showAlert("Error");
      }
    } else {
      showAlert("Error");
    }
  };

  return (
    <main className="subPage">
      <section className="mw">
        <Lnb />
        <div className="contents">
          <p className="h3Coment noti">{t("common.requiredNotice")}</p>
          <form className={style.formStyle} onSubmit={handleSubmit(onSubmit)}>
            <div className={`${style.formContainer} full`}>
              <div className={`${style.formGrup} ${errors.title ? style["has-error"] : style["has-success"]}`}>
                <span>{t("form.title")}</span>
                <div className={style.formCon}>
                  <input
                    {...register("title", {
                      required: true,
                    })}
                    placeholder={t("form.titlePlaceholder")}
                  />
                  {errors.title && <p className={style["error-message"]}>{t("form.validation.titleRequired")}</p>}
                </div>
              </div>

              <div className={`${style.formGrup} ${style.formLabels}`}>
                <span>{t("form.type")}</span>
                <label>
                  <input type="radio" name="cateType" value={"onLine"} onChange={jobTypeFn} checked={jobType === "onLine"} />
                  <span>{t("filter.online")}</span>
                </label>
                <label>
                  <input type="radio" name="cateType" value={"offLine"} onChange={jobTypeFn} checked={jobType === "offLine"} />
                  <span>{t("filter.offline")}</span>
                </label>
              </div>
              {isOffline && (
                <div className={`${style.formGrup} ${style.address} ${errors.zonecode || errors.detailedAddress ? style["has-error"] : style["has-success"]}`} data-name="address">
                  <span>{t("form.address")}</span>
                  <div className={style.flexWrap}>
                    <input type="text" value={zonecode} className={style.zonecode} placeholder={t("form.postalCode")} readOnly {...register("zonecode", { required: true })} />
                    <button type="button" className={style.addressBtn} onClick={() => showPopup("findAddress")}>
                      {t("form.addressSearch")}
                    </button>
                    <div>{address}</div>
                    <input
                      {...register("detailedAddress", {
                        required: true,
                      })}
                      placeholder={t("form.detailAddressPlaceholder")}
                    />
                    {(errors.zonecode || errors.detailedAddress) && <p className={style["error-message"]}>{t("form.validation.addressRequired")}</p>}
                  </div>
                </div>
              )}
              <div className={`${style.formGrup} ${errors.endDate ? style["has-error"] : style["has-success"]}`}>
                <span>{t("form.deadline")}</span>
                <div className={`${style.formCon} ${style.dateWrap}`}>
                  <Controller
                    name="endDate"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <DatePicker
                        locale={datePickerLocale}
                        dateFormat="yyyy-MM-dd"
                        minDate={new Date()}
                        closeOnScroll={true}
                        placeholderText={t("form.deadlinePlaceholder")}
                        selected={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.endDate && <p className={style["error-message"]}>{t("form.validation.deadlineRequired")}</p>}
                </div>
              </div>

              <div className={`${style.formGrup} ${errors.workDate ? style["has-error"] : style["has-success"]}`}>
                <span>{t("form.workDate")}</span>
                <div className={`${style.formCon} ${style.dateWrap}`}>
                  <Controller
                    name="workDate"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <DatePicker
                        locale={datePickerLocale}
                        dateFormat="yyyy-MM-dd"
                        minDate={endDate || new Date()}
                        closeOnScroll={true}
                        placeholderText={t("form.workDatePlaceholder")}
                        selected={field.value || workDate}
                        onChange={(date) => workDateChange(date, field)}
                      />
                    )}
                  />
                  {errors.workDate && <p className={style["error-message"]}>{t("form.validation.workDateRequired")}</p>}
                </div>
              </div>

              <div className={`${style.formGrup} ${errors.workStartTime || errors.workEndTime ? style["has-error"] : style["has-success"]}`}>
                <span>{t("form.workHours")}</span>
                <div className={`${style.selectWrap} ${style.formCon}`}>
                  <Controller
                    name="workStartTime"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={workStartTimeOp}
                        className={style.select}
                        styles={customStyles}
                        placeholder={t("form.startTime")}
                        onChange={(selectedOption) => {
                          setWorkStartTime(selectedOption);
                          field.onChange(selectedOption);
                        }}
                      />
                    )}
                  />
                  <span className={style.bur}>~</span>
                  <Controller
                    name="workEndTime"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={filteredEndTimeOp}
                        className={style.select}
                        styles={customStyles}
                        placeholder={t("form.endTime")}
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption);
                          setWorkEndTime(selectedOption);
                        }}
                      />
                    )}
                  />
                  {(errors.workStartTime || errors.workEndTime) && <p className={style["error-message"]}>{t("form.validation.workHoursRequired")}</p>}
                </div>
              </div>
              <div className={`${style.formGrup} ${errors.pay ? style["has-error"] : style["has-success"]}`}>
                <span>{t("form.pay")}</span>
                <div className={`${style.formCon} ${style.addItem}`}>
                  <Controller
                    name="pay"
                    rules={{ required: true }}
                    control={control}
                    defaultValue=""
                    render={({ field }) => <input {...field} type="text" placeholder={t("form.payPlaceholder")} value={formatPay(field.value)} onChange={(e) => field.onChange(setPayFn(e))} />}
                  />
                  <span>{t("common.currency")}</span>
                  {errors.pay && <p className={style["error-message"]}>{t("form.validation.payRequired")}</p>}
                </div>
              </div>

              <div className={`${style.formGrup} ${errors.cateTalent ? style["has-error"] : style["has-success"]}`}>
                <span>{t("form.talent")}</span>
                <div className={style.formCon}>
                  <Controller
                    name="cateTalent"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={cateTalentOp}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        styles={customStyles}
                        className={`${style.select} ${style.selectFull}`}
                        placeholder={t("form.talentPlaceholder")}
                      />
                    )}
                  />
                  {errors.cateTalent && <p className={style["error-message"]}>{t("form.validation.talentRequired")}</p>}
                </div>
              </div>

              <div className={`${style.formGrup} ${errors.cateField ? style["has-error"] : style["has-success"]}`}>
                <span>{t("form.category")}</span>
                <div className={style.formCon}>
                  <Controller
                    name="cateField"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={cateFieldOp}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        styles={customStyles}
                        className={`${style.select} ${style.selectFull}`}
                        placeholder={t("form.categoryPlaceholder")}
                      />
                    )}
                  />
                  {errors.cateField && <p className={style["error-message"]}>{t("form.validation.categoryRequired")}</p>}
                </div>
              </div>
              <div className={`${style.formGrup} ${errors.desc ? style["has-error"] : style["has-success"]}`}>
                <span>{t("form.description")}</span>
                <div className={style.formCon}>
                  <textarea
                    id="desc"
                    {...register("desc", {
                      required: true,
                    })}
                    placeholder={t("form.descriptionPlaceholder")}
                  />
                  {errors.desc && <p className={style["error-message"]}>{t("form.validation.descriptionRequired")}</p>}
                </div>
              </div>
            </div>
            <div className="btnWrap">
              <button type="submit" className="btn primary yellow">
                {t("nav.jobWrite")}
              </button>
            </div>
          </form>
        </div>
      </section>
      {modal && (
        <Modal show={modal !== null} onClose={closePopup} type="address">
          {modal === "findAddress" && (
            <div className={style.addressModal}>
              <h3>{t("form.addressSearch")}</h3>
              <DaumPostcode onComplete={completeHandler} />
            </div>
          )}
        </Modal>
      )}
      {modalAlert && (
        <Modal show={modalAlert !== null} onClose={closeAlert} type="alert">
          {modalAlert === "WriteOk" && <ModalAlert close={closeAlert} desc={"구인글이 정상적으로 등록되었습니다."} error={false} confirm={false} goPage={"/job-offer"} />}
          {modalAlert === "Error" && <ModalAlert close={closeAlert} desc={"구인글 등록 중 오류가 발생했습니다."} error={true} confirm={false} />}
          {modalAlert === "notAuthorized" && <ModalAlert close={closeAlert} desc={t("common.loginRequired")} error={true} confirm={false} goPage={"/login"} />}
        </Modal>
      )}
    </main>
  );
};

export default JobWrit;
