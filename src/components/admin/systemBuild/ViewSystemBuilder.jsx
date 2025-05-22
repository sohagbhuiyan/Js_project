import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPCComponents, fetchPCParts, clearPCBError } from "../../../store/pcbuilderSlice";
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
  Alert,
  CircularProgress,
  Button,
} from "@mui/material";
import { API_BASE_URL } from "../../../store/api";

const FALLBACK_IMAGE = "/images/placeholder.png";

const ViewSystemBuilder = () => {
  const dispatch = useDispatch();
  const { components, parts, loading, error } = useSelector((state) => state.pcBuilder);
  const userRole = useSelector((state) => state.auth.role) || localStorage.getItem("authRole");

  useEffect(() => {
    dispatch(fetchPCComponents());
    dispatch(fetchPCParts());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(clearPCBError());
    dispatch(fetchPCComponents());
    dispatch(fetchPCParts());
  };

  if (userRole !== "admin") {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", mt: 5, p: { xs: 1, sm: 2 }, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          You do not have permission to access this page.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        mt: 5,
        p: { xs: 1, sm: 2 },
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" mb={4} fontWeight="bold" textAlign="center">
        System Builder Admin Panel
      </Typography>

      {/* PC Components Section */}
      <Box mb={6}>
        <Typography variant="h6" mb={2} fontWeight="medium">
          PC Components
        </Typography>
        {loading.component ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : error.component ? (
          <Box mb={2}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.component}
            </Alert>
            <Button variant="contained" color="primary" onClick={handleRetry}>
              Retry
            </Button>
          </Box>
        ) : components.length === 0 ? (
          <Typography>No PC components found.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Image</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {components.map((component) => (
                  <TableRow key={component.id}>
                    <TableCell>{component.id}</TableCell>
                    <TableCell>{component.name}</TableCell>
                    <TableCell>
                      <img
                        src={component.imagea ? `${API_BASE_URL}/images/${component.imagea}` : FALLBACK_IMAGE}
                        alt={component.name}
                        style={{ width: 50, height: 50, objectFit: "contain", borderRadius: 4 }}
                        onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                        loading="lazy"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* PC Parts Section */}
      <Box>
        <Typography variant="h6" mb={2} fontWeight="medium">
          PC Parts
        </Typography>
        {loading.part ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : error.part ? (
          <Box mb={2}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.part}
            </Alert>
            <Button variant="contained" color="primary" onClick={handleRetry}>
              Retry
            </Button>
          </Box>
        ) : parts.length === 0 ? (
          <Typography>No PC parts found.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>System Category</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Performance</TableCell>
                  <TableCell>Ability</TableCell>
                  <TableCell>Regular Price</TableCell>
                  <TableCell>Special Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Image</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parts.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell>{part.id}</TableCell>
                    <TableCell>{part.name}</TableCell>
                    <TableCell>{part.pcbuilder?.name || part.pcbuilder?.id || "N/A"}</TableCell>
                    <TableCell>{part.description || "N/A"}</TableCell>
                    <TableCell>{part.performance || "N/A"}</TableCell>
                    <TableCell>{part.ability || "N/A"}</TableCell>
                    <TableCell>${part.regularprice?.toFixed(2) || "N/A"}</TableCell>
                    <TableCell>${part.specialprice?.toFixed(2) || "N/A"}</TableCell>
                    <TableCell>{part.quantity || "N/A"}</TableCell>
                    <TableCell>
                      <img
                        src={part.imagea ? `${API_BASE_URL}/images/${part.imagea}` : FALLBACK_IMAGE}
                        alt={part.name}
                        style={{ width: 50, height: 50, objectFit: "contain", borderRadius: 4 }}
                        onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                        loading="lazy"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default ViewSystemBuilder;
