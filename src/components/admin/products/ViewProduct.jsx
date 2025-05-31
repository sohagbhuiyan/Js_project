import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, deleteProductDetails } from '../../../store/productSlice';
import { Trash } from 'lucide-react';

const ViewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error, successMessage } = useSelector((state) => state.products);
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('authToken');
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleProductIdClick = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleAddProduct = () => {
    navigate('/admin/products/add-product');
  };

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      dispatch(deleteProductDetails({ id: productToDelete, token }))
        .then(() => {
          setDeleteDialogOpen(false);
          setProductToDelete(null);
        });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  return (
    <Box className="p-6 bg-gray-100">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h5" className="font-bold text-gray-800">
          View Products
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddProduct}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add New Product
        </Button>
      </Box>

      {loading && (
        <Box className="flex justify-center my-8">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography className="text-red-600 mb-4">
          Error: {error}
        </Typography>
      )}

      {successMessage && (
        <Typography className="text-green-600 mb-4">
          {successMessage}
        </Typography>
      )}

      {!loading && !error && products.length === 0 && (
        <Typography className="text-gray-600">No products available.</Typography>
      )}

      {!loading && !error && products.length > 0 && (
        <TableContainer component={Paper} className="shadow-md">
          <Table aria-label="products table">
            <TableHead>
              <TableRow className="bg-gray-200">
                <TableCell className="font-bold text-gray-800">Image</TableCell>
                <TableCell className="font-bold text-gray-800">Product ID</TableCell>
                <TableCell className="font-bold text-gray-800">Title</TableCell>
                <TableCell className="font-bold text-gray-800">Name</TableCell>
                <TableCell className="font-bold text-gray-800">Category</TableCell>
                <TableCell className="font-bold text-gray-800">Submenu</TableCell>
                <TableCell className="font-bold text-gray-800">Quantity</TableCell>
                <TableCell className="font-bold text-gray-800">Special Price</TableCell>
                <TableCell className="font-bold text-gray-800">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell>
                    {product.imagea ? (
                      <Avatar
                        src={product.imagea}
                        variant="rounded"
                        className="w-16 h-16"
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
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      {product.productid}
                    </Link>
                  </TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.catagory?.name || 'N/A'}</TableCell>
                  <TableCell>{product.product?.name || 'N/A'}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.specialprice.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(product.id)}
                    >
                      <Trash/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewProduct;