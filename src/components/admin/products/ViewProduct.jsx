// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//   Box, 
//   Typography, 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableContainer, 
//   TableHead, 
//   TableRow, 
//   Paper, 
//   Avatar, 
//   CircularProgress,
//   Button,
//   IconButton,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { Edit, Trash } from 'lucide-react';
// import { fetchProducts, deleteProductDetails } from '../../../store/productSlice';

// const ViewProduct = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { products, loading, error, successMessage } = useSelector((state) => state.products);
//   const token = useSelector((state) => state.auth.token) || localStorage.getItem('authToken');
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [productToDelete, setProductToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(fetchProducts());
//   }, [dispatch]);

//   const handleEditClick = (id) => {
//     navigate(`/admin/products/edit/${id}`);
//   };

//   const handleAddProduct = () => {
//     navigate('/admin/products/add-product');
//   };

//   const handleDeleteClick = (id) => {
//     setProductToDelete(id);
//     setDeleteDialogOpen(true);
//   };

//   const handleDeleteConfirm = () => {
//     if (productToDelete) {
//       dispatch(deleteProductDetails({ id: productToDelete, token }))
//         .then(() => {
//           setDeleteDialogOpen(false);
//           setProductToDelete(null);
//         });
//     }
//   };

//   const handleDeleteCancel = () => {
//     setDeleteDialogOpen(false);
//     setProductToDelete(null);
//   };

//   return (
//     <Box className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
//       <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
//         <Typography 
//           variant="h4" 
//           className="font-bold text-gray-800 mb-4 sm:mb-0"
//         >
//           Product Management
//         </Typography>
//         <Button
//           variant="contained"
//           onClick={handleAddProduct}
//           className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300"
//         >
//           + Add New Product
//         </Button>
//       </Box>

//       {loading && (
//         <Box className="flex justify-center items-center my-12">
//           <CircularProgress size={48} className="text-blue-500" />
//         </Box>
//       )}

//       {error && (
//         <Typography className="text-red-500 bg-red-50 p-4 rounded-lg mb-6 font-medium">
//           Error: {error}
//         </Typography>
//       )}

//       {successMessage && (
//         <Typography className="text-green-500 bg-green-50 p-4 rounded-lg mb-6 font-medium">
//           {successMessage}
//         </Typography>
//       )}

//       {!loading && !error && products.length === 0 && (
//         <Typography className="text-gray-600 text-center p-8 bg-white rounded-lg shadow">
//           No products available. Start by adding a new product!
//         </Typography>
//       )}

//       {!loading && !error && products.length > 0 && (
//         <TableContainer component={Paper} className="shadow-xl rounded-lg overflow-hidden">
//           <Table aria-label="products table">
//             <TableHead>
//               <TableRow className="bg-gradient-to-r from-blue-200 to-blue-300">
//                 <TableCell className="font-semibold text-white py-4">Image</TableCell>
//                 <TableCell className="font-semibold text-white">Product ID</TableCell>
//                 <TableCell className="font-semibold text-white">Name</TableCell>
//                 <TableCell className="font-semibold text-white">Category</TableCell>
//                 <TableCell className="font-semibold text-white">Submenu</TableCell>
//                 <TableCell className="font-semibold text-white">Quantity</TableCell>
//                 <TableCell className="font-semibold text-white">Special Price</TableCell>
//                 <TableCell className="font-semibold text-white">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {products.map((product) => (
//                 <TableRow 
//                   key={product.id} 
//                   className="hover:bg-gray-50 transition-colors duration-200"
//                 >
//                   <TableCell>
//                     {product.imagea ? (
//                       <Avatar
//                         src={product.imagea}
//                         variant="rounded"
//                         className="w-16 h-16 border-2 border-gray-200"
//                       />
//                     ) : (
//                       <Box className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded text-gray-500 text-sm">
//                         No Image
//                       </Box>
//                     )}
//                   </TableCell>
//                   <TableCell className="text-gray-700">{product.productid}</TableCell>
//                   <TableCell className="text-gray-700">{product.name}</TableCell>
//                   <TableCell className="text-gray-700">{product.catagory?.name || 'N/A'}</TableCell>
//                   <TableCell className="text-gray-700">{product.product?.name || 'N/A'}</TableCell>
//                   <TableCell className="text-gray-700">{product.quantity}</TableCell>
//                   <TableCell className="text-gray-700">${product.specialprice.toFixed(2)}</TableCell>
//                   <TableCell>
//                     <IconButton
//                       onClick={() => handleEditClick(product.id)}
//                       className="text-blue-500 hover:text-blue-700 mr-2"
//                     >
//                       <Edit size={20} />
//                     </IconButton>
//                     <IconButton
//                       onClick={() => handleDeleteClick(product.id)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <Trash size={20} />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       <Dialog
//         open={deleteDialogOpen}
//         onClose={handleDeleteCancel}
//         aria-labelledby="delete-dialog-title"
//         PaperProps={{
//           className: "rounded-xl shadow-2xl"
//         }}
//       >
//         <DialogTitle id="delete-dialog-title" className="text-gray-800 font-bold">
//           Confirm Product Deletion
//         </DialogTitle>
//         <DialogContent className="bg-gray-50">
//           <DialogContentText className="text-gray-600">
//             Are you sure you want to delete this product? This action is permanent and cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions className="bg-gray-50 p-4">
//           <Button 
//             onClick={handleDeleteCancel} 
//             className="text-gray-600 hover:text-gray-800"
//           >
//             Cancel
//           </Button>
//           <Button 
//             onClick={handleDeleteConfirm}
//             variant="contained"
//             className="bg-red-500 hover:bg-red-600 text-white"
//           >
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default ViewProduct;

import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Avatar, CircularProgress,
  Button, IconButton, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, MenuItem, Checkbox, FormControlLabel
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
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
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filters, setFilters] = useState({ name: '', brand: '', category: '' });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleEditClick = (id) => navigate(`/admin/products/edit/${id}`);
  const handleAddProduct = () => navigate('/admin/products/add-product');

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      dispatch(deleteProductDetails({ id: productToDelete, token }));
    } else if (selectedProducts.length) {
      selectedProducts.forEach(id => {
        dispatch(deleteProductDetails({ id, token }));
      });
    }
    setDeleteDialogOpen(false);
    setProductToDelete(null);
    setSelectedProducts([]);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filters.name.toLowerCase()) &&
    (!filters.brand || product.product?.name === filters.brand) &&
    (!filters.category || product.catagory?.name === filters.category)
  );

  const brandOptions = [...new Set(products.map(p => p.product?.name).filter(Boolean))];
  const categoryOptions = [...new Set(products.map(p => p.catagory?.name).filter(Boolean))];

  return (
    <Box className="min-h-screen p-6 bg-gray-50">
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <Typography variant="h4" className="font-bold text-gray-800">Product Management</Typography>
        <Box className="flex gap-4 flex-wrap">
          {selectedProducts.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Selected ({selectedProducts.length})
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleAddProduct}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            + Add New Product
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box className="grid sm:grid-cols-3 gap-4 mb-6">
        <TextField
          label="Search by Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          fullWidth
        />
        <TextField
          select
          label="Filter by Brand"
          value={filters.brand}
          onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
          fullWidth
        >
          <MenuItem value="">All Brands</MenuItem>
          {brandOptions.map((brand, idx) => (
            <MenuItem key={idx} value={brand}>{brand}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Filter by Category"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          fullWidth
        >
          <MenuItem value="">All Categories</MenuItem>
          {categoryOptions.map((cat, idx) => (
            <MenuItem key={idx} value={cat}>{cat}</MenuItem>
          ))}
        </TextField>
      </Box>

      {loading ? (
        <Box className="flex justify-center py-20">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" className="mb-4">{error}</Typography>
      ) : filteredProducts.length === 0 ? (
        <Typography className="text-gray-600 text-center p-8 bg-white rounded-lg shadow">
          No products match your filters.
        </Typography>
      ) : (
        <TableContainer component={Paper} className="shadow-lg rounded-lg">
          <Table>
            <TableHead>
              <TableRow className="bg-blue-100">
                <TableCell />
                <TableCell>Image</TableCell>
                <TableCell>Product ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {product.imagea ? (
                      <Avatar src={product.imagea} variant="rounded" />
                    ) : (
                      <Box className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded text-xs text-gray-500">
                        No Image
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>{product.productid}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.catagory?.name || 'N/A'}</TableCell>
                  <TableCell>{product.product?.name || 'N/A'}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>${product.specialprice?.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEditClick(product.id)} color="primary">
                      <Edit size={18} />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(product.id)} color="error">
                      <Trash size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{ className: "rounded-xl shadow-xl" }}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {productToDelete
              ? "Are you sure you want to delete this product?"
              : `Are you sure you want to delete ${selectedProducts.length} selected products?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewProduct;
