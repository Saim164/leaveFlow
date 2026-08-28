import { useNavigate } from "react-router-dom";
import UserWelcome from "./UserWelcome";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          navigate("/");
        }}
      >
        LeaveFlow
      </button>
      <UserWelcome />
    </div>
  );
}

export default Navbar;
