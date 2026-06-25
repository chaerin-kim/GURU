import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { url } from "../store/ref";
import Modal from "../components/Modal";
import ModalAlert from "../components/ModalAlert";
import ProgressBar from "../components/ProgressBar";
import style from "../css/Form.module.css";

const Profile = ({ show, onclose, modal, mode }) => {
  const user = useSelector((state) => state.user.user);
  const emailID = user ? user?.emailID : null;
  const [getUser, setGetUser] = useState("");
  const [files, setFiles] = useState("");
  const [imgPath, setImgPath] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [modalAlert, setModalAlert] = useState(null);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const findUser = async () => {
      if (!emailID) return;
      try {
        const res = await fetch(`${url}/findUser/${emailID}`, {
          method: "GET",
        });
        const result = await res.json();
        if (res.ok) {
          setValue("career", result.career || "");
          setValue("certi", result.certi || "");
          setValue("skill", result.skill || "");
          setValue("time", result.time || "");
          setValue("introduce", result.introduce || "");
          setImgPath(result.image ? result.image : null);
          setGetUser(result);
        }
      } catch (e) {
        console.error(e);
      }
    };
    findUser();
  }, [emailID, setValue]);

  const showAlert = (content) => {
    setModalAlert(content);
  };
  const closeAlert = () => {
    if (modalAlert === "isOk" && onclose) {
      onclose();
    }
    setModalAlert(null);
  };
  if (modal) {
    if (!show) {
      return null;
    }
  }

  const imgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp", "image/svg+xml", "image/webp", "image/tiff"];
      if (!validImageTypes.includes(file.type)) {
        setModalAlert("noImageType");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
      setFiles([file]);
    }
  };

  const onSubmit = async (val) => {
    const token = localStorage.getItem("token");
    const { career, certi, skill, time, introduce } = val;
    const data = new FormData();
    data.append("career", career);
    data.append("certi", certi);
    data.append("skill", skill);
    data.append("time", time);
    data.append("introduce", introduce);
    if (files?.[0]) {
      data.set("files", files[0]);
    }
    try {
      const res = await fetch(`${url}/profileWrite`, {
        method: "PUT",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const result = await res.json();
      if (res.ok) {
        showAlert("isOk");
      } else {
        showAlert("failed");
        console.error("Failed to submit profile:", res.statusText);
      }
    } catch (error) {
      showAlert("failed");
      console.error("Error:", error);
    }
  };

  return (
    <div className={style.modalprofile}>
      {modal && <h3>프로필 등록 </h3>}
      <form className={`${style.formStyle} ${style.formProfile}`} onSubmit={handleSubmit(onSubmit)}>
        <div className={style.formContainer}>
          <div className={style.formThumb}>
            {imageSrc ? (
              <img src={imageSrc} alt="변경된 이미지" />
            ) : getUser?.image ? (
              <img src={`${url}/${getUser?.image}`} alt="등록된 이미지" />
            ) : (
              <img src={`${process.env.PUBLIC_URL}/img/common/no_img.jpg`} alt="logo" />
            )}
            <input type="file" name="files" id="files" onChange={imgChange} />
            <i className="fa-solid fa-camera-retro">
              <p>이미지 등록</p>
            </i>
          </div>
          <span>
            {getUser.nickName}
            <span> 님</span>
          </span>
          <ProgressBar user={getUser} />
        </div>
        <div className={`${style.formContainer}`}>
          <div className={style.formGrup}>
            <span>경력</span>
            <div className={`${style.formCon} ${style.addItem}`}>
              <input {...register("career")} placeholder="경력을 입력해주세요." />
            </div>
          </div>
          <div className={style.formGrup}>
            <span>면허 / 자격증</span>
            <div className={`${style.formCon} ${style.addItem}`}>
              <input {...register("certi")} placeholder="면허 / 자격증을 입력해주세요." />
            </div>
          </div>
          <div className={style.formGrup}>
            <span>재능 / 스킬</span>
            <div className={`${style.formCon} ${style.addItem}`}>
              <input {...register("skill")} placeholder="재능 / 스킬을 입력해주세요." />
            </div>
          </div>
          <div className={style.formGrup}>
            <span>시간</span>
            <div className={`${style.formCon} ${style.addItem}`}>
              <input {...register("time")} placeholder="시간을 입력해주세요." />
            </div>
          </div>
          <div className={style.formGrup}>
            <span>자기소개</span>
            <div className={`${style.formCon} ${style.addItem}`}>
              <textarea id="introduce" {...register("introduce")} placeholder="자기소개를 입력해주세요." />
            </div>
          </div>
        </div>
        <div className="btnWrap">
          <button type="submit" className="btn primary yellow">
            프로필 {mode}
          </button>
        </div>
      </form>
      {modalAlert && (
        <Modal show={modalAlert !== null} onClose={closeAlert} type="alert">
          {modalAlert === "isOk" && <ModalAlert close={closeAlert} desc={`프로필이 정상적으로 ${mode}되었습니다.`} error={false} confirm={false} />}
          {modalAlert === "noImageType" && <ModalAlert close={closeAlert} desc={"유효하지 않는 이미지 파일 형식입니다."} error={true} confirm={false} />}
          {modalAlert === "failed" && <ModalAlert close={closeAlert} desc={`프로필 ${mode} 중 오류가 생겼습니다.`} error={true} confirm={false} />}
        </Modal>
      )}
    </div>
  );
};

export default Profile;
