import { useEffect } from "react";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/users/health").catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main className="landing">
        <header className="landing__intro">
          <h1 className="landing__title">Welcome to LeaveFlow</h1>
          <p className="landing__subtitle">
            A simple portal to request time off and keep your team's leave
            organised.
          </p>
        </header>

        <div className="landing__choices">
          <button
            type="button"
            className="choice-card"
            onClick={() => {
              navigate("/employee/login");
            }}
          >
            <span className="choice-card__label">Employee</span>
            <span className="choice-card__text">
              Request time off and track your leave balance.
            </span>
          </button>

          <button
            type="button"
            className="choice-card"
            onClick={() => {
              navigate("/manager/login");
            }}
          >
            <span className="choice-card__label">Manager</span>
            <span className="choice-card__text">
              Review, approve, and manage your team's requests.
            </span>
          </button>
        </div>
      </main>
    </>
  );
}

export default LandingPage;
