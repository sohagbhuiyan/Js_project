import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCCItemDetails,
  deleteCCItemDetails,
  clearCCBError,
  clearCCBSuccess,
} from "../../../store/ccbuilderSlice";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
  Alert,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Edit, Delete } from "@mui/icons-material";
import { API_BASE_URL } from "../../../store/api";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
  background: "linear-gradient(to bottom right, #ffffff, #f9fafb)",
}));

const CCBuilderViewItem = () => {
  const dispatch = useDispatch();
  const { itemDetails, loading, error, successMessage } = useSelector((state) => state.ccBuilder);
  const userRole = useSelector((state) => state.auth.role) || localStorage.getItem("authRole");

  // Fetch all item details on mount
  useEffect(() => {
    dispatch(fetchAllCCItemDetails());
  }, [dispatch]);

  // Clear success/error messages after 5 seconds
  useEffect(() => {
    if (successMessage.itemDetails || error.itemDetails) {
      const timer = setTimeout(() => {
        dispatch(clearCCBSuccess());
        dispatch(clearCCBError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage.itemDetails, error.itemDetails, dispatch]);

  const handleEditClick = (id) => {
    window.location.href = `/admin/edit-cc-item-details/${id}`;
  };

  const handleDelete = async (id) => {
    try {
      const resultAction = await dispatch(deleteCCItemDetails(id));
      if (!deleteCCItemDetails.fulfilled.match(resultAction)) {
        console.error("Delete failed:", resultAction.payload);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (!userRole || userRole !== "admin") {
    return (
      <Box className="min-h-screen flex justify-center items-center">
        <Alert severity="error" className="rounded-lg shadow-md p-4">
          You do not have permission to access this page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 max-w-7xl mx-auto">
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <Typography 
          variant="h4" 
          className="font-bold text-gray-800 mb-4 sm:mb-0"
        >
          CC Builder Item Management
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.href = '/admin/add-cc-item-details'}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300"
        >
          + Add New Item
        </Button>
      </Box>

      <StyledPaper elevation={3}>
        <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
          Item Details List
        </Typography>
        <TableContainer>
          <Table aria-label="cc builder items table">
            <TableHead>
              <TableRow className="bg-gradient-to-r from-gray-300 to-gray-400">
                <TableCell className="font-semibold text-white py-4">Image</TableCell>
                <TableCell className="font-semibold text-white">ID</TableCell>
                <TableCell className="font-semibold text-white">Name</TableCell>
                <TableCell className="font-semibold text-white">CC Builder</TableCell>
                <TableCell className="font-semibold text-white">Item</TableCell>
                <TableCell className="font-semibold text-white">Regular Price</TableCell>
                <TableCell className="font-semibold text-white">Special Price</TableCell>
                <TableCell className="font-semibold text-white">Quantity</TableCell>
                <TableCell className="font-semibold text-white">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading.itemDetails ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress size={48} className="text-blue-500" />
                  </TableCell>
                </TableRow>
              ) : itemDetails.length ? (
                itemDetails.map((detail) => {
                  const imageUrl = detail.imagea ? `${API_BASE_URL}/images/${detail.imagea}` : null;
                  return (
                    <TableRow 
                      key={detail.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <TableCell>
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={detail.name}
                            className="w-16 h-16 object-cover rounded border-2 border-gray-200"
                            onError={(e) => {
                              e.target.src = "/path/to/placeholder-image.jpg"; // Fallback image
                            }}
                          />
                        ) : (
                          <Box className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded text-gray-500 text-sm">
                            No Image
                          </Box>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-700">{detail.id}</TableCell>
                      <TableCell className="text-gray-700">{detail.name}</TableCell>
                      <TableCell className="text-gray-700">{detail.ccBuilder?.name || "N/A"}</TableCell>
                      <TableCell className="text-gray-700">{detail.item?.name || "N/A"}</TableCell>
                      <TableCell className="text-gray-700">${detail.regularprice.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-700">${detail.specialprice.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-700">{detail.quantity}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEditClick(detail.id)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                          disabled={loading.itemDetails}
                        >
                          <Edit size={20} />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(detail.id)}
                          className="text-red-500 hover:text-red-700"
                          disabled={loading.itemDetails}
                        >
                          <Delete size={20} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography className="text-gray-600 p-4">
                      No item details found. Start by adding a new item!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Fade in={!!successMessage.itemDetails || !!error.itemDetails}>
          <Box className="mt-4">
            {successMessage.itemDetails && (
              <Alert severity="success" className="rounded-lg shadow-md">
                {successMessage.itemDetails}
              </Alert>
            )}
            {error.itemDetails && (
              <Alert severity="error" className="rounded-lg shadow-md">
                {error.itemDetails}
              </Alert>
            )}
          </Box>
        </Fade>
      </StyledPaper>
    </Box>
  );
};

export default CCBuilderViewItem;