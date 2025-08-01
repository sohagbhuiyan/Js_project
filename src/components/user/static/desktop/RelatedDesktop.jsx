import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDesktopsByCategory } from '../../../../store/static/desktopSlice';
import {
  Card, CardContent, CardMedia, Typography, Box
} from '@mui/material';
import { API_BASE_URL } from '../../../../store/api';

const RelatedDesktop = ({ categoryId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { desktops, loading, error, currentDesktop } = useSelector((state) => state.desktops);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchDesktopsByCategory({ catagoryId: categoryId }));
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

  // Handle card click to navigate to DesktopView
  const handleCardClick = (id) => {
    navigate(`/desktop/${id}`);
  };

  if (!categoryId) return null;
  if (loading) return <div className="text-center py-4 text-gray-600">Loading related desktops...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="px-2 py-3">
      <p className="text-lg md:text-xl font-semibold bg-gray-100 p-2 rounded-t-md text-gray-800">
        Related Desktops
      </p>
      <hr className="mb-4 border-gray-300" />
      <Box className="flex flex-col space-y-4">
        {desktops.length > 0 ? (
          desktops
            .filter((desktop) => desktop.id !== currentDesktop?.id)
            .map((desktop) => {
              const currentPrice = desktop.specialprice > 0 ? desktop.specialprice : desktop.regularprice;
              const discount = desktop.specialprice > 0
                ? Math.round(((desktop.regularprice - desktop.specialprice) / desktop.regularprice) * 100)
                : 0;

              return (
                <Card
                  key={desktop.id}
                  onClick={() => handleCardClick(desktop.id)}
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
                    image={desktop.imagea || '/images/fallback.jpg'}
                    alt={desktop.name || 'Desktop'}
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
                      title={desktop.name}
                      sx={{ mb: 0.5 }}
                    >
                      {desktop.name || 'Unnamed Desktop'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {desktop.catagory?.name || 'Uncategorized'}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" color="primary" fontWeight="bold">
                        {formatPrice(currentPrice)}
                      </Typography>
                      {desktop.specialprice > 0 && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: 'line-through' }}
                        >
                          {formatPrice(desktop.regularprice)}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              );
            })
        ) : (
          <Typography className="text-center p-4 text-gray-500">No related desktops found</Typography>
        )}
      </Box>
    </div>
  );
};

export default RelatedDesktop;
