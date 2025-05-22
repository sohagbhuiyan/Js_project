import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, logout } from "../../../store/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { clearCart } from "../../../store/cartSlice";
import toast, { Toaster } from "react-hot-toast";

export const AdminDropdown = ({ position = "desktop" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, profile, role, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen && user?.email && role === "admin") {
      dispatch(fetchProfile());
    }
  }, [isOpen, user, role, dispatch]);

  useEffect(() => {
    if (error && isOpen) {
      toast.error(`Profile error: ${error}`, {
        duration: 4000,
        style: { background: "#EF4444", color: "#FFFFFF", fontWeight: "bold" },
      });
      dispatch({ type: "auth/clearError" });
    }
  }, [error, isOpen, dispatch]);

  const handleLogout = () => {
    dispatch(clearCart());
    dispatch(logout());
    setIsOpen(false);
    navigate("/");
    toast.success("Admin Logged out successfully", {
      duration: 3000,
      style: { background: "#10B981", color: "#FFFFFF", fontWeight: "bold" },
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const containerClasses = position === "desktop"
    ? "absolute top-8 -left-15 z-99 bg-gray-100 text-black px-3 py-2 rounded-lg shadow-lg min-w-[200px]"
    : "fixed bottom-14 right-0 bg-gray-100 z-99 text-black px-3 py-2 rounded-lg shadow-lg min-w-[200px]";

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaUser className="text-lg hover:text-gray-300" />
        {position === "mobile" && <span className="text-xs ml-1">Admin</span>}
      </div>

      {isOpen && (
        <div className={containerClasses}>
          {user && role === "admin" ? (
            <>
              <div className="mb-2">
                {loading ? (
                  <div className="flex items-center justify-center py-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500 border-solid"></div>
                    <span className="ml-2 text-sm text-gray-600">Loading...</span>
                  </div>
                ) : (
                  <>
                    <p className="bg-green-600 text-white rounded-lg px-2 py-1 text-center text-sm">
                      {user.email}
                    </p>
                    {profile?.name && (
                      <p className="text-sm font-medium mt-1 text-center">
                        Welcome, {user.name}
                      </p>
                    )}
                  </>
                )}
              </div>
              <Link
                to="/admin/dashboard"
                className="block text-sm font-medium text-gray-600 hover:text-gray-500 mb-1 hover:bg-gray-200 p-1 rounded"
                onClick={() => setIsOpen(false)}
              >
                Admin Dashboard
              </Link>

              <Link
                to="/admin/view-profile"
                className="block text-sm font-medium text-gray-600 hover:text-gray-500 mb-1 hover:bg-gray-200 p-1 rounded"
                onClick={() => setIsOpen(false)}
              >
                View Profile
              </Link>
     
              <button
                className="text-left text-sm font-medium cursor-pointer text-red-600 hover:text-red-500 mt-2 hover:bg-gray-200 p-1 rounded w-full"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="z-99">
              <p className="text-sm text-gray-800 mb-2 text-center">Not logged in</p>
              <Link
                to="/login"
                className="block bg-green-500 text-white px-2 py-1 rounded text-center text-sm hover:bg-green-600"
                onClick={() => setIsOpen(false)}
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      )}
      <Toaster position="top-right" />
    </div>
  );
};
