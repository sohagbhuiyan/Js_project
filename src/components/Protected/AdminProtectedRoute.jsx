import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AdminProtectedRoute = () => {
  const { role, token } = useSelector((state) => state.auth);
  const location = useLocation();

  // If no token, redirect to login
  if (!token) return <Navigate to="/login" replace />;

  // If not admin, redirect to home
  if (role !== "admin") return <Navigate to="/" replace />;

  // If admin and route is /admin or any invalid admin route, redirect to /admin/dashboard
  if (location.pathname === "/admin" || !location.pathname.startsWith("/admin/")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Render the admin route
  return <Outlet />;
};

export default AdminProtectedRoute;
