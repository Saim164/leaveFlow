import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { token, user } = useAuth();
  const loginPath = role === "manager" ? "/manager/login" : "/employee/login";

  if (!token) {
    return <Navigate to={loginPath} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
