import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../../../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const AdminProfileView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, profile, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProfile());
    }
  }, [dispatch, user?.id]);
  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <p className="mb-4">You need to login to view your profile</p>
        <Link to="/login" className="text-blue-500 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-md md:text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>

      {profile && !loading && !error ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <h3 className="text-xs md:text-sm font-medium text-gray-500">Full Name</h3>
            <p className="text-xs md:text-lg">{profile.name}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-xs md:text-sm font-medium text-gray-500">Email</h3>
            <p className="text-xs md:text-lg">{profile.email}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-xs md:text-sm font-medium text-gray-500">Phone Number</h3>
            <p className="text-xs md:text-lg">{profile.phoneNo}</p>
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex justify-between">

        <button
          onClick={() => navigate('/admin/dashboard')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default AdminProfileView;
