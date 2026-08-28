import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function GuestRoute({ children }) {
  const { token, user } = useAuth();

  if (token) {
    const dashboard =
      user?.role === "manager" ? "/manager/dashboard" : "/employee/dashboard";
    return <Navigate to={dashboard} replace />;
  }

  return children;
}

export default GuestRoute;
