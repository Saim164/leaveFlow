import { useAuth } from "../context/AuthContext";
import "./UserWelcome.css";

function UserWelcome() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initial = user.name ? user.name.charAt(0).toUpperCase() : "";

  return (
    <div className="user-welcome">
      <span className="user-welcome__greeting">
        Welcome, <span className="user-welcome__name">{user.name}</span>
      </span>
      <span className="user-welcome__avatar">{initial}</span>
      <button type="button" className="user-welcome__logout" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default UserWelcome;
