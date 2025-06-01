import React, { useEffect, useState } from 'react';
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
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash } from 'lucide-react';
import { fetchProducts, deleteProductDetails } from '../../../store/productSlice';

const ViewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error, successMessage } = useSelector((state) => state.products);
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('authToken');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleEditClick = (id) => {
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
    <Box className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <Typography 
          variant="h4" 
          className="font-bold text-gray-800 mb-4 sm:mb-0"
        >
          Product Management
        </Typography>
        <Button
          variant="contained"
          onClick={handleAddProduct}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300"
        >
          + Add New Product
        </Button>
      </Box>

      {loading && (
        <Box className="flex justify-center items-center my-12">
          <CircularProgress size={48} className="text-blue-500" />
        </Box>
      )}

      {error && (
        <Typography className="text-red-500 bg-red-50 p-4 rounded-lg mb-6 font-medium">
          Error: {error}
        </Typography>
      )}

      {successMessage && (
        <Typography className="text-green-500 bg-green-50 p-4 rounded-lg mb-6 font-medium">
          {successMessage}
        </Typography>
      )}

      {!loading && !error && products.length === 0 && (
        <Typography className="text-gray-600 text-center p-8 bg-white rounded-lg shadow">
          No products available. Start by adding a new product!
        </Typography>
      )}

      {!loading && !error && products.length > 0 && (
        <TableContainer component={Paper} className="shadow-xl rounded-lg overflow-hidden">
          <Table aria-label="products table">
            <TableHead>
              <TableRow className="bg-gradient-to-r from-blue-200 to-blue-300">
                <TableCell className="font-semibold text-white py-4">Image</TableCell>
                <TableCell className="font-semibold text-white">Product ID</TableCell>
                <TableCell className="font-semibold text-white">Name</TableCell>
                <TableCell className="font-semibold text-white">Category</TableCell>
                <TableCell className="font-semibold text-white">Submenu</TableCell>
                <TableCell className="font-semibold text-white">Quantity</TableCell>
                <TableCell className="font-semibold text-white">Special Price</TableCell>
                <TableCell className="font-semibold text-white">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow 
                  key={product.id} 
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <TableCell>
                    {product.imagea ? (
                      <Avatar
                        src={product.imagea}
                        variant="rounded"
                        className="w-16 h-16 border-2 border-gray-200"
                      />
                    ) : (
                      <Box className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded text-gray-500 text-sm">
                        No Image
                      </Box>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-700">{product.productid}</TableCell>
                  <TableCell className="text-gray-700">{product.name}</TableCell>
                  <TableCell className="text-gray-700">{product.catagory?.name || 'N/A'}</TableCell>
                  <TableCell className="text-gray-700">{product.product?.name || 'N/A'}</TableCell>
                  <TableCell className="text-gray-700">{product.quantity}</TableCell>
                  <TableCell className="text-gray-700">${product.specialprice.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditClick(product.id)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      <Edit size={20} />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={20} />
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
        PaperProps={{
          className: "rounded-xl shadow-2xl"
        }}
      >
        <DialogTitle id="delete-dialog-title" className="text-gray-800 font-bold">
          Confirm Product Deletion
        </DialogTitle>
        <DialogContent className="bg-gray-50">
          <DialogContentText className="text-gray-600">
            Are you sure you want to delete this product? This action is permanent and cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="bg-gray-50 p-4">
          <Button 
            onClick={handleDeleteCancel} 
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewProduct;