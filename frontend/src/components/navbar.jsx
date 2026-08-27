import { useNavigate } from "react-router-dom";

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
    </div>
  );
}

export default Navbar;
