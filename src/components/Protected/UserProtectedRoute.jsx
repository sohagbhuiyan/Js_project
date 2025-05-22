
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const UserProtectedRoute = () => {
  const { role, token } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "user") return <Navigate to="/" replace />;

  return <Outlet/>;
};

export default UserProtectedRoute;
