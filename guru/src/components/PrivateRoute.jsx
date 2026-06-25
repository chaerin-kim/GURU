import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../assets/AuthContext";
import Modal from "../components/Modal";
import ModalAlert from "../components/ModalAlert";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [modalAlert, setModalAlert] = useState(null);

  useEffect(() => {
    if (!isAuthenticated && !modalAlert) {
      setModalAlert("notAuthorized");
    }
  }, [isAuthenticated, modalAlert]);

  const closeAlert = () => {
    setModalAlert(null);
    navigate("/login");
  };

  if (!isAuthenticated) {
    return (
      <>
        {modalAlert && (
          <Modal show={modalAlert !== null} onClose={closeAlert} type="alert">
            {modalAlert === "notAuthorized" && <ModalAlert close={closeAlert} desc={"로그인이 필요한 페이지입니다."} error={true} confirm={false} goPage={"/login"} />}
          </Modal>
        )}
      </>
    );
  }

  return children;
};

export default PrivateRoute;
