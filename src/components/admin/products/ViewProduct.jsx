import React, { useEffect } from 'react';
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
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ViewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductDetailsById());
  }, [dispatch]);

  const handleProductIdClick = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleAddProduct = () => {
    navigate('/admin/products/add-product');
  const handleProductIdClick = (name) => {
    dispatch(fetchProductDetailsById(name)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        setSelectedProduct(result.payload);
      }
    });
  };
}
  return (
    <Box className="p-2 bg-gray-50 min-h-screen">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          View Products
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddProduct}>
          Add New Product
        </Button>
      </Box>

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
                <TableRow key={product.id}>
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
                      onClick={() => handleProductIdClick(product.id)}
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
    </Box>
  );
};

export default ViewProduct;