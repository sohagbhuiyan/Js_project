import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCamerasByCategory } from '../../../../store/static/cameraSlice';
import {
  Card, CardContent, CardMedia, Typography, Box
} from '@mui/material';
import { API_BASE_URL } from '../../../../store/api';

const RelatedCamera = ({ categoryId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cameras, loading, error, currentCamera } = useSelector((state) => state.cameras);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchCamerasByCategory({ catagoryId: categoryId }));
    }
  }, [dispatch, categoryId]);

  // Memoize formatPrice to avoid redefinition
  const formatPrice = useCallback(
    (amount) =>
      new Intl.NumberFormat('en-BD', { maximumFractionDigits: 0 })
        .format(amount)
        .replace(/(\d+)/, 'Tk $1'),
    []
  );

  // Handle card click to navigate to CameraView
  const handleCardClick = (id) => {
    navigate(`/camera/${id}`);
  };

  if (!categoryId) return null;
  if (loading) return <div className="text-center py-4 text-gray-600">Loading related cameras...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="px-2 py-3">
      <p className="text-lg md:text-xl font-semibold bg-gray-100 p-2 rounded-t-md text-gray-800">
        Related Cameras
      </p>
      <hr className="mb-4 border-gray-300" />
      <Box className="flex flex-col space-y-4">
        {cameras.length > 0 ? (
          cameras
            .filter((camera) => camera.id !== currentCamera?.id)
            .map((camera) => {
              const currentPrice = camera.specialprice > 0 ? camera.specialprice : camera.regularprice;
              const discount = camera.specialprice > 0
                ? Math.round(((camera.regularprice - camera.specialprice) / camera.regularprice) * 100)
                : 0;

              return (
                <Card
                  key={camera.id}
                  onClick={() => handleCardClick(camera.id)}
                  className="w-full max-w-md mx-auto cursor-pointer relative"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    },
                    borderRadius: '12px',
                    overflow: 'hidden',
                    bgcolor: 'white',
                  }}
                >
                  {discount > 0 && (
                    <Box
                      className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                    >
                      {discount}% OFF
                    </Box>
                  )}
                  <CardMedia
                    component="img"
                    image={camera.imagea || '/images/fallback.jpg'}
                    alt={camera.name || 'Camera'}
                    sx={{
                      objectFit: 'contain',
                      width: { xs: 100, sm: 120 },
                      height: { xs: 100, sm: 120 },
                      padding: 2,
                      backgroundColor: '#f5f5f5',
                    }}
                    onError={(e) => {
                      e.currentTarget.src = '/images/fallback.jpg';
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, py: 2, px: 3, '&:last-child': { pb: 2 } }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      title={camera.name}
                      sx={{ mb: 0.5 }}
                    >
                      {camera.name || 'Unnamed Camera'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {camera.catagory?.name || 'Uncategorized'}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" color="primary" fontWeight="bold">
                        {formatPrice(currentPrice)}
                      </Typography>
                      {camera.specialprice > 0 && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: 'line-through' }}
                        >
                          {formatPrice(camera.regularprice)}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              );
            })
        ) : (
          <Typography className="text-center p-4 text-gray-500">No related cameras found</Typography>
        )}
      </Box>
    </div>
  );
};

export default RelatedCamera;
