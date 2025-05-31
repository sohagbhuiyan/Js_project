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
import { Delete } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../../store/api"; // Ensure API_BASE_URL is imported

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
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
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Alert severity="error">You do not have permission to access this page.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "lg", mx: "auto", p: 4 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        CC Builder Item Details
      </Typography>

      <StyledPaper elevation={3}>
        <Typography variant="h6" gutterBottom>
          Item Details List
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID <br />(Click to Edit)</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>CC Builder</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Regular Price</TableCell>
                <TableCell>Special Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading.itemDetails ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : itemDetails.length ? (
                itemDetails.map((detail) => {
                  const imageUrl = detail.imagea ? `${API_BASE_URL}/images/${detail.imagea}` : null;
                  return (
                    <TableRow key={detail.id}>
                      <TableCell>
                        <Button
                          component={Link}
                          to={`/admin/edit-cc-item-details/${detail.id}`}
                          color="primary"
                          sx={{ textTransform: "none" }}
                        >
                          {detail.id}
                        </Button>
                      </TableCell>
                      <TableCell>{detail.name}</TableCell>
                      <TableCell>
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={detail.name}
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            onError={(e) => {
                              e.target.src = "/path/to/placeholder-image.jpg"; // Fallback image
                            }}
                          />
                        ) : (
                          "No Image"
                        )}
                      </TableCell>
                      <TableCell>{detail.ccBuilder?.name || "N/A"}</TableCell>
                      <TableCell>{detail.item?.name || "N/A"}</TableCell>
                      <TableCell>${detail.regularprice}</TableCell>
                      <TableCell>${detail.specialprice}</TableCell>
                      <TableCell>{detail.quantity}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(detail.id)}
                          disabled={loading.itemDetails}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No item details found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Fade in={!!successMessage.itemDetails || !!error.itemDetails}>
          <Box sx={{ mt: 2 }}>
            {successMessage.itemDetails && (
              <Alert severity="success">{successMessage.itemDetails}</Alert>
            )}
            {error.itemDetails && <Alert severity="error">{error.itemDetails}</Alert>}
          </Box>
        </Fade>
      </StyledPaper>
    </Box>
  );
};

export default CCBuilderViewItem;