import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRelatedProducts } from '../../../store/productSlice';
import {
  Card, CardContent, CardMedia, Typography, Button,
  IconButton, Grid, Box
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CompareIcon from '@mui/icons-material/CompareArrows';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { API_BASE_URL } from '../../../store/api';

const RelatedProduct = ({ categoryId }) => {
 const dispatch = useDispatch();
  const { relatedProducts, loading, error } = useSelector((state) => state.products);

 useEffect(() => {
    if (categoryId) {
      dispatch(fetchRelatedProducts(categoryId));
    }
  }, [dispatch, categoryId]);
  const formatPrice = (amount) =>
    new Intl.NumberFormat('en-BD', { maximumFractionDigits: 0 })
      .format(amount)
      .replace(/(\d+)/, 'Tk $1');

  if (loading) return <div className="text-center py-4">Loading related products...</div>;
  if (error) return <div className="text-center text-red-500 py-4">Error: {error}</div>;

  return (
    <div className="px-1 py-4">
      <p className="text-md md:text-xl p-2 font-medium bg-gray-600/20 rounded-t-md">
        Related Products
      </p>
      <hr className="mb-4" />
      <Grid container spacing={2}>
        {relatedProducts.length > 0 ? (
          relatedProducts.map((product) => {
            const imageUrl = product.imagea
              ? `${API_BASE_URL}/images/${product.imagea}`
              : '/images/fallback.jpg';

            const currentPrice = product.specialprice > 0 ? product.specialprice : product.regularprice;

            return (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <Card
                  variant="outlined"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={imageUrl}
                    alt={product.name || 'Product'}
                    sx={{
                      objectFit: 'contain',
                      height: { xs: 120, md: 150 },
                      padding: 2,
                      backgroundColor: '#f5f5f5',
                    }}
                    onError={(e) => {
                      e.currentTarget.src = '/images/fallback.jpg';
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" title={product.name}>
                      {product.name || 'Unnamed Product'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.catagory?.name || 'Uncategorized'}
                    </Typography>
                    <Typography variant="h6" color="text.primary" mt={1}>
                      {formatPrice(currentPrice)}
                    </Typography>
                    {product.specialprice > 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        {formatPrice(product.regularprice)}
                      </Typography>
                    )}
                  </CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<ShoppingCartIcon />}
                      sx={{ borderRadius: '20px', textTransform: 'none' }}
                    >
                      Add to Cart
                    </Button>
                    <Box>
                      <IconButton color="primary" size="small">
                        <CompareIcon />
                      </IconButton>
                      <IconButton color="primary" size="small">
                        <VisibilityIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Typography className="text-center p-4 text-gray-500">No related products found</Typography>
        )}
      </Grid>
    </div>
  );
};

export default RelatedProduct;
