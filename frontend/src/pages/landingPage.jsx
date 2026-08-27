import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div>
        <div>
          <h1>welcome to leaveFlow</h1>
          <p>apply for your leave through a modern leave portal</p>
        </div>
        <div>
          <button
            onClick={() => {
              navigate("/employee/login");
            }}
          >
            <h2>Employee</h2>
            <p>Manage your leave requests</p>
          </button>
          <button
            onClick={() => {
              navigate("/manager/login");
            }}
          >
            <h2>Manager</h2>
            <p>Review and manage leave requests</p>
          </button>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
