import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchProductDetailsById } from '../../../store/productSlice';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Avatar, 
  CircularProgress,
  Link,
  Divider
} from '@mui/material';

const ViewProduct = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleProductIdClick = (name) => {
    dispatch(fetchProductDetailsById(name)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        setSelectedProduct(result.payload);
      }
    });
  };

  return (
    <Box className="p-2 bg-gray-50 min-h-screen">
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
        View Products
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {error}
        </Typography>
      )}

      {!loading && !error && products.length === 0 && (
        <Typography>No products available.</Typography>
      )}

      {!loading && !error && products.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="products table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Product ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Submenu</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Special Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.productid}>
                  <TableCell>
                    {product.imagea ? (
                      <Avatar 
                        src={product.imagea} 
                        variant="rounded" 
                        sx={{ width: 60, height: 60 }} 
                      />
                    ) : (
                      'No Image'
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => handleProductIdClick(product.name)}
                      sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      {product.productid}
                    </Link>
                  </TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.catagory?.name || 'N/A'}</TableCell>
                  <TableCell>{product.product?.name || 'N/A'}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>${product.specialprice.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedProduct && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Selected Product Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography><strong>Product ID:</strong> {selectedProduct.productid}</Typography>
            <Typography><strong>Title:</strong> {selectedProduct.title}</Typography>
            <Typography><strong>Name:</strong> {selectedProduct.name}</Typography>
            <Typography><strong>Category:</strong> {selectedProduct.catagory?.name || 'N/A'}</Typography>
            <Typography><strong>Submenu:</strong> {selectedProduct.product?.name || 'N/A'}</Typography>
            <Typography><strong>Quantity:</strong> {selectedProduct.quantity}</Typography>
            <Typography><strong>Regular Price:</strong> ${selectedProduct.regularprice.toFixed(2)}</Typography>
            <Typography><strong>Special Price:</strong> ${selectedProduct.specialprice.toFixed(2)}</Typography>
            <Typography><strong>Details:</strong> {selectedProduct.details}</Typography>
            <Typography><strong>Specification:</strong> {selectedProduct.specification}</Typography>
            {selectedProduct.imagea && (
              <Box sx={{ mt: 2 }}>
                <Typography><strong>Main Image:</strong></Typography>
                <Avatar 
                  src={selectedProduct.imagea} 
                  variant="rounded" 
                  sx={{ width: 100, height: 100, mt: 1 }} 
                />
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ViewProduct;
