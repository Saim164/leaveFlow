import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function UserWelcome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  const initial = user.name ? user.name.charAt(0).toUpperCase() : "";

  return (
    <div>
      <span>Welcome, {user.name}</span>
      <span>{initial}</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default UserWelcome;
