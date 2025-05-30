import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, } from "../../../../store/authSlice";
import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

const ProfileEdit = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { user, profile, loading, error } = useSelector((state) => state.auth);

  // // Form state for profile fields
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   phoneNo: "",
  //   address: "",
  //   gender: "",
  // });

  // // Form state for password fields
  // const [passwordData, setPasswordData] = useState({
  //   oldPassword: "",
  //   newPassword: "",
  //   confirmPassword: "",
  // });

  // State for image upload
  // const [image, setImage] = useState(null);

  // Initialize form with profile data when available
  useEffect(() => {
    if (user?.id && !profile) {
      dispatch(fetchProfile());
    }
    // if (profile) {
    //   setFormData({
    //     name: profile.name || "",
    //     email: profile.email || "",
    //     phoneNo: profile.phoneNo || "",
    //     address: profile.address || "",
    //     gender: profile.gender || "",
    //   });
    // }
  }, [dispatch, user?.id, profile]);

  // // Handle form input changes
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  // // Handle password input changes
  // const handlePasswordChange = (e) => {
  //   const { name, value } = e.target;
  //   setPasswordData((prev) => ({ ...prev, [name]: value }));
  // };

  // // Handle image upload
  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setImage(file);
  //     toast.success("Image selected!", {
  //       duration: 2000,
  //       style: { background: "#10B981", color: "#FFFFFF", fontWeight: "bold" },
  //     });
  //   }
  // };

  // // Handle profile form submission
  // const handleProfileSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const updateData = { ...formData };
  //     if (image) {
  //       // Placeholder: Implement actual image upload logic (e.g., to a backend or cloud storage)
  //       // For now, we'll assume the image is handled separately
  //       updateData.image = URL.createObjectURL(image); // Temporary URL for preview
  //     }
  //     await dispatch(updateProfile(updateData)).unwrap();
  //     toast.success("Profile updated successfully!", {
  //       duration: 2000,
  //       style: { background: "#10B981", color: "#FFFFFF", fontWeight: "bold" },
  //     });
  //     navigate("/profile/view"); // Redirect back to ProfileView
  //   } catch (err) {
  //     toast.error(err.message || "Failed to update profile", {
  //       duration: 2000,
  //       style: { background: "#EF4444", color: "#FFFFFF", fontWeight: "bold" },
  //     });
  //   }
  // };

  // // Handle password form submission
  // const handlePasswordSubmit = async (e) => {
  //   e.preventDefault();
  //   if (passwordData.newPassword !== passwordData.confirmPassword) {
  //     toast.error("New password and confirm password do not match", {
  //       duration: 2000,
  //       style: { background: "#EF4444", color: "#FFFFFF", fontWeight: "bold" },
  //     });
  //     return;
  //   }
  //   try {
  //     // Placeholder: Implement password update logic (e.g., via a new async thunk)
  //     // await dispatch(updatePassword({ oldPassword, newPassword })).unwrap();
  //     toast.success("Password updated successfully!", {
  //       duration: 2000,
  //       style: { background: "#10B981", color: "#FFFFFF", fontWeight: "bold" },
  //     });
  //     setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
  //   } catch (err) {
  //     toast.error(err.message || "Failed to update password", {
  //       duration: 2000,
  //       style: { background: "#EF4444", color: "#FFFFFF", fontWeight: "bold" },
  //     });
  //   }
  // };

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg text-center">
        <p className="text-gray-600 mb-4 text-lg">You need to log in to edit your profile</p>
        <Link
          to="/login"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-150"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Edit Profile</h1>

      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-solid"></div>
          <span className="ml-2 text-gray-600">Loading profile...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl text-gray-500 font-semibold mx-auto">
              {profile.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <h2 className="text-md md:text-xl font-semibold text-gray-800 mt-2">{profile.name || "User"}</h2>
            <p className="text-xs md:text-sm text-gray-500">{profile.phoneNo || "No phone number"}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                to="/view-orders"
                className="block text-sm md:text-md bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition duration-150"
              >
                Orders
              </Link>
              <Link
                to="/profile"
                className="block text-sm md:text-md bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition duration-150"
              >
                Profile
              </Link>
      
            </div>
          </div>

          {/* Profile Form */}
          <div className="col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
            <form >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    // value={formData.name}
                    // onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNo"
                    // value={formData.phoneNo}
                    // onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <input
                    type="email"
                    name="email"
                    // value={formData.email}
                    // onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Address</label>
                  <input
                    type="text"
                    name="address"
                    // value={formData.address}
                    // onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
          
              </div>
              <button
                type="submit"
                className="w-full text-sm md:text-md bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition duration-150"
              >
                Update Information
              </button>
            </form>

            {/* Password Form */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Password</h2>
              <form >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Old Password</label>
                    <input
                      type="password"
                      name="oldPassword"
                      // value={passwordData.oldPassword}
                      // onChange={handlePasswordChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      // value={passwordData.newPassword}
                      // onChange={handlePasswordChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      // value={passwordData.confirmPassword}
                      // onChange={handlePasswordChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full text-sm md:text-md bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition duration-150"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-right" />
    </div>
  );
};

export default ProfileEdit;