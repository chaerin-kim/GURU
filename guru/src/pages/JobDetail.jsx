import { useLocation } from "react-router-dom";
import Detail from "../components/Detail";

const JobDetail = () => {
  const location = useLocation();
  const { _id } = location.state || {};

  return (
    <main className="detail">
      <Detail _id={_id} />
    </main>
  );
};

export default JobDetail;
