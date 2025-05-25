import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRelatedProducts } from '../../../store/productSlice';
import {
  Card, CardContent, CardMedia, Typography, Box
} from '@mui/material';

import { API_BASE_URL } from '../../../store/api';

const RelatedProduct = ({ categoryId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { relatedProducts, loading, error, currentProduct } = useSelector((state) => state.products);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchRelatedProducts(categoryId));
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

  // Filter out the current product from related products
  const filteredRelatedProducts = relatedProducts.filter(
    (product) => product.id !== currentProduct?.id
  );

  // Handle card click to navigate to ProductView
  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  if (!categoryId) return null;
  if (loading) return <div className="text-center py-4 text-gray-600">Loading related products...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="px-2 py-3">
      <p className="text-lg md:text-xl font-semibold bg-gray-100 p-2 rounded-t-md text-gray-800">
        Related Products
      </p>
      <hr className="mb-4 border-gray-300" />
      <Box className="flex flex-col space-y-4">
        {filteredRelatedProducts.length > 0 ? (
          filteredRelatedProducts.map((product) => {
            const imageUrl = product.imagea ? `${API_BASE_URL}/images/${product.imagea}`
              : '/images/fallback.jpg';
            const currentPrice = product.specialprice > 0 ? product.specialprice : product.regularprice;
            const discount = product.specialprice > 0
              ? Math.round(((product.regularprice - product.specialprice) / product.regularprice) * 100)
              : 0;

            return (
              <Card
                key={product.id}
                onClick={() => handleCardClick(product.id)}
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
                  imagea ={imageUrl} //{`${API_BASE_URL}/images/${product.imagea || "default.jpg"}`}
                  alt={product.name || 'Product'}
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
                    title={product.name}
                    sx={{ mb: 0.5 }}
                  >
                    {product.name || 'Unnamed Product'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.catagory?.name || 'Uncategorized'}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" color="primary" fontWeight="bold">
                      {formatPrice(currentPrice)}
                    </Typography>
                    {product.specialprice > 0 && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        {formatPrice(product.regularprice)}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Typography className="text-center p-4 text-gray-500">No related products found</Typography>
        )}
      </Box>
    </div>
  );
};

export default RelatedProduct;