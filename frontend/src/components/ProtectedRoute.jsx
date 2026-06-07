import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/enter" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectPath =
      user.role === "admin" ? "/admin/dashboard" : "/employee/ask";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default ProtectedRoute;
