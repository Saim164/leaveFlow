import { useNavigate } from "react-router-dom";
import UserWelcome from "./UserWelcome";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <button
        type="button"
        className="navbar__logo"
        onClick={() => {
          navigate("/");
        }}
      >
        Leave<span>Flow</span>
      </button>
      <UserWelcome />
    </header>
  );
}

export default Navbar;
