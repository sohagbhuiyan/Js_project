import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPCParts,
  deletePCPart,
  clearPCBError,
  clearPCBSuccess,
} from "../../../store/pcbuilderSlice";
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

const ViewSystemBuilder = () => {
  const dispatch = useDispatch();
  const { parts, loading, error, successMessage } = useSelector((state) => state.pcBuilder);
  const userRole = useSelector((state) => state.auth.role) || localStorage.getItem("authRole");

  // Fetch all PC parts on mount
  useEffect(() => {
    dispatch(fetchPCParts());
  }, [dispatch]);

  // Clear success/error messages after 5 seconds
  useEffect(() => {
    if (successMessage.delete || error.delete) {
      const timer = setTimeout(() => {
        dispatch(clearPCBSuccess());
        dispatch(clearPCBError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage.delete, error.delete, dispatch]);

  const handleEditClick = (id) => {
    window.location.href = `/admin/edit-pc-part/${id}`;
  };

  const handleDelete = async (id) => {
    try {
      const resultAction = await dispatch(deletePCPart(id));
      if (!deletePCPart.fulfilled.match(resultAction)) {
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
          PC Builder Parts Management
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.href = '/admin/add-Pc-Builder'}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300"
        >
          + Add New Part
        </Button>
      </Box>

      <StyledPaper elevation={3}>
        <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
          Parts List
        </Typography>
        <TableContainer>
          <Table aria-label="pc parts table">
            <TableHead>
              <TableRow className="sticky top-0 bg-gradient-to-r from-gray-300 to-gray-400">
                <TableCell className="font-semibold text-white py-4">Image</TableCell>
                <TableCell className="font-semibold text-white">ID</TableCell>
                <TableCell className="font-semibold text-white">Name</TableCell>
                <TableCell className="font-semibold text-white">PC Builder</TableCell>
                <TableCell className="font-semibold text-white">Regular Price</TableCell>
                <TableCell className="font-semibold text-white">Special Price</TableCell>
                <TableCell className="font-semibold text-white">Quantity</TableCell>
                <TableCell className="font-semibold text-white">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading.part ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress size={48} className="text-blue-500" />
                  </TableCell>
                </TableRow>
              ) : parts.length ? (
                parts.map((part) => {
                  const imageUrl = part.imagea ? `${API_BASE_URL}/images/${part.imagea}` : null;
                  return (
                    <TableRow 
                      key={part.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <TableCell>
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={part.name}
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
                      <TableCell className="text-gray-700">{part.id}</TableCell>
                      <TableCell className="text-gray-700">{part.name}</TableCell>
                      <TableCell className="text-gray-700">{part.pcbuilder?.name || "N/A"}</TableCell>
                      <TableCell className="text-gray-700">${part.regularprice.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-700">${part.specialprice.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-700">{part.quantity}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEditClick(part.id)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                          disabled={loading.delete}
                        >
                          <Edit size={20} />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(part.id)}
                          className="text-red-500 hover:text-red-700"
                          disabled={loading.delete}
                        >
                          <Delete size={20} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography className="text-gray-600 p-4">
                      No parts found. Start by adding a new part!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Fade in={!!successMessage.delete || !!error.delete}>
          <Box className="mt-4">
            {successMessage.delete && (
              <Alert severity="success" className="rounded-lg shadow-md">
                {successMessage.delete}
              </Alert>
            )}
            {error.delete && (
              <Alert severity="error" className="rounded-lg shadow-md">
                {error.delete}
              </Alert>
            )}
          </Box>
        </Fade>
      </StyledPaper>
    </Box>
  );
};

export default ViewSystemBuilder;