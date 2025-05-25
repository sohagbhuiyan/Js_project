import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAboutUs, clearAboutUsError } from '../../../store/aboutUsSlice';
import { Typography, Alert, CircularProgress } from '@mui/material';

const AboutUs = () => {
  const dispatch = useDispatch();
  const { aboutUsEntries = [], loading, error } = useSelector((state) => state.aboutUs || {});

  // Fetch About Us data on component mount
  useEffect(() => {
    dispatch(getAllAboutUs());

    // Clear error after 5 seconds
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearAboutUsError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, error]);

  // Skeleton loading component
  const SkeletonLoader = () => (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md animate-pulse">
      <div className="h-6 bg-gray-300 rounded mb-4"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded"></div>
    </div>
  );

  return (
    <div className=" mx-auto p-6">
      <Typography variant="h4" className="font-bold text-gray-800 mb-6 text-center">
        About Us
      </Typography>

      {error && (
        <Alert severity="error" className="mb-6 max-w-2xl mx-auto">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="max-w-2xl mx-auto">
          <SkeletonLoader />
        </div>
      ) : aboutUsEntries.length === 0 ? (
        <Alert severity="info" className="mb-6 max-w-2xl mx-auto">
          No About Us information available.
        </Alert>
      ) : (
        <div className="w-full  bg-white p-6 space-y-4 rounded-lg ">
          <div className="space-y-4">
            <Typography className="text-lg text-gray-800">
              <strong>Mission:</strong> {aboutUsEntries[0].mission}
            </Typography>
            <Typography className="text-lg text-gray-800">
              <strong>Vision:</strong> {aboutUsEntries[0].vision}
            </Typography>
            <Typography className="text-lg text-gray-800">
              <strong>Achievements:</strong> {aboutUsEntries[0].achievements || 'None'}
            </Typography>
            <Typography className="text-lg text-gray-800">
              <strong>Brand/Business Partners:</strong> {aboutUsEntries[0].brandbusinesspartners || 'None'}
            </Typography>
            <Typography className="text-lg text-gray-800">
              <strong>Description:</strong> {aboutUsEntries[0].description}
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUs;