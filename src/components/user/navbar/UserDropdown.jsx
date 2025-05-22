import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, logout } from "../../../store/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { clearCart } from "../../../store/cartSlice"; 
import { Toaster } from "react-hot-toast";

export const UserDropdown = ({ position = "desktop" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get auth state from Redux (which now persists via localStorage)
  const { user, profile } = useSelector((state) => state.auth);

  // Fetch fresh profile data when dropdown opens
  useEffect(() => {
    if (isOpen && user?.email) {
      dispatch(fetchProfile());
    }
  }, [isOpen, dispatch]);

  const handleLogout = () => {
    dispatch(clearCart()); // 👈 Clear user's cart before logging out
    dispatch(logout());
    setIsOpen(false);
    navigate("/");
  };

  // Close dropdown when clicking outside
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
    : "fixed bottom-14 right-0 z-99 bg-gray-100 text-black px-3 py-2 rounded-lg shadow-lg min-w-[200px]";

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="flex flex-col items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaUser className="text-lg hover:text-gray-300" />
        {position === "mobile" && <span className="text-xs ml-1">Profile</span>}
      </div>
      {isOpen && (
        <div className={containerClasses}>
          {user ? (
            <>
              <div className="mb-2">
                <p className="bg-green-600 text-white rounded-lg px-2 py-1 text-center">
                  {user.email}
                </p>
                {profile?.name && (
                  <p className="text-sm font-medium mt-1">Welcome, {profile.name}</p>
                )}
              </div>
              
              <Link
                to="/profile"
                className="block text-sm font-medium text-gray-600 hover:text-gray-500 mb-1 hover:bg-gray-100 py-1 rounded"
                onClick={() => setIsOpen(false)}
              >
                My Account
              </Link>
              <button
                className=" text-left text-sm font-medium cursor-pointer text-red-600 hover:text-red-500 mt-2 hover:bg-gray-100 p-1 rounded"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="z-99">
              <p className="text-sm text-gray-800 mb-2">Not logged in</p>
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
