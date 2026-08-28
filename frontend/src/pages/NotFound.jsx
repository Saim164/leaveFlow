import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import "./LandingPage.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className="landing">
        <header className="landing__intro">
          <h1 className="landing__title">Page not found</h1>
          <p className="landing__subtitle">
            The page you are looking for doesn't exist.
          </p>
        </header>
        <div className="landing__choices">
          <button
            type="button"
            className="choice-card"
            onClick={() => navigate("/")}
          >
            <span className="choice-card__label">Back to home</span>
            <span className="choice-card__text">
              Return to the LeaveFlow landing page.
            </span>
          </button>
        </div>
      </main>
    </>
  );
}

export default NotFound;
