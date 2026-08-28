import { useNavigate } from "react-router-dom";
import UserWelcome from "./UserWelcome";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div>
      <h2
        onClick={() => {
          navigate("/");
        }}
      >
        LeaveFlow
      </h2>
      <UserWelcome />
    </div>
  );
}

export default Navbar;
