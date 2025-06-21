import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchNetworksByCategory } from '../../../../store/static/networkSlice';
import {
  Card, CardContent, CardMedia, Typography, Box
} from '@mui/material';
import { API_BASE_URL } from '../../../../store/api';

const RelatedNetwork = ({ categoryId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { networks, loading, error, currentNetwork } = useSelector((state) => state.networks);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchNetworksByCategory({ catagoryId: categoryId }));
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

  // Handle card click to navigate to NetworkView
  const handleCardClick = (id) => {
    navigate(`/network/${id}`);
  };

  if (!categoryId) return null;
  if (loading) return <div className="text-center py-4 text-gray-600">Loading related networks...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="px-2 py-3">
      <p className="text-lg md:text-xl font-semibold bg-gray-100 p-2 rounded-t-md text-gray-800">
        Related Networks
      </p>
      <hr className="mb-4 border-gray-300" />
      <Box className="flex flex-col space-y-4">
        {networks.length > 0 ? (
          networks
            .filter((network) => network.id !== currentNetwork?.id)
            .map((network) => {
              const currentPrice = network.specialprice > 0 ? network.specialprice : network.regularprice;
              const discount = network.specialprice > 0
                ? Math.round(((network.regularprice - network.specialprice) / network.regularprice) * 100)
                : 0;

              return (
                <Card
                  key={network.id}
                  onClick={() => handleCardClick(network.id)}
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
                    image={network.imagea || '/images/fallback.jpg'}
                    alt={network.name || 'Network Device'}
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
                      title={network.name}
                      sx={{ mb: 0.5 }}
                    >
                      {network.name || 'Unnamed Network Device'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {network.catagory?.name || 'Uncategorized'}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" color="primary" fontWeight="bold">
                        {formatPrice(currentPrice)}
                      </Typography>
                      {network.specialprice > 0 && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: 'line-through' }}
                        >
                          {formatPrice(network.regularprice)}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              );
            })
        ) : (
          <Typography className="text-center p-4 text-gray-500">No related networks found</Typography>
        )}
      </Box>
    </div>
  );
};

export default RelatedNetwork;
