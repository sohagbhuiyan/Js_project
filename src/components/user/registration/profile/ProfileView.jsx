import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../../../../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiShoppingBag } from 'react-icons/fi';

const ProfileView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, profile, loading, error } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProfile());
    }
  }, [dispatch, user?.id]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg text-center">
        <p className="text-gray-600 mb-4 text-lg">You need to log in to view your profile</p>
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
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">My Account</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'profile'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          <FiUser className="w-5 h-5" />
          Profile
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'orders'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('orders')}
        >
          <FiShoppingBag className="w-5 h-5" />
          Orders
        </button>
      </div>

      {/* Profile Section */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl text-gray-500 font-semibold">
              {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="ml-4">
              <h2 className="text-md md:text-xl font-semibold text-gray-800">{profile?.name || 'User'}</h2>
              <p className="text-xs md:text-sm text-gray-500">{profile?.email || 'No email'}</p>
            </div>
          </div>

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

          {profile && !loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                <p className="text-sm md:text-md text-gray-800">{profile.name || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="text-sm md:text-md text-gray-800">{profile.email || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                <p className="text-sm md:text-md text-gray-800">{profile.phoneNo || 'N/A'}</p>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/profile/edit')}
              className="text-sm md:text-md bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition duration-150"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-sm md:text-md bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition duration-150"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      {/* Orders Section */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Orders</h2>
          <p className="text-gray-600 mb-4">
            View your order history by visiting the Orders page.
          </p>
          <Link
            to="/view-orders"
            className="inline-block text-sm md:text-md bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition duration-150"
          >
            View All Orders
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
