
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPCComponents, clearPCBError } from "../../../store/pcbuilderSlice";
import { Box, Typography, CircularProgress, Alert, Button } from "@mui/material";
import { API_BASE_URL } from "../../../store/api";

const FALLBACK_IMAGE = "/images/placeholder.png";

const PCBuilderPage = () => {
  const dispatch = useDispatch();
  const { components, loading, error } = useSelector((state) => state.pcBuilder);

  useEffect(() => {
    dispatch(fetchPCComponents());
  }, [dispatch]);

  useEffect(() => {
    console.log("Fetched components:", components);
    components.forEach((component) => {
      console.log("Image URL for", component.name, ":", `${API_BASE_URL}/images/${component.imagea}`);
    });
  }, [components]);

  const handleRetry = () => {
    dispatch(clearPCBError());
    dispatch(fetchPCComponents());
  };

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", px: { xs: 1, sm: 2 }, py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Build Your Custom PC
      </Typography>
      {loading.component ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error.component ? (
        <Box mb={4}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.component}
          </Alert>
          <Button variant="contained" color="primary" onClick={handleRetry}>
            Retry
          </Button>
        </Box>
      ) : components.length === 0 ? (
        <Typography variant="h6" textAlign="center" my={4}>
          No PC components found.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: { xs: 1, md: 5 } }}>
          {components.map((component) => (
            <Link
              key={component.id}
              to={`/pc-builder/${component.name.toLowerCase()}`}
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  border: 1,
                  borderColor: "grey.300",
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  transition: "0.3s",
                  "&:hover": { boxShadow: 3, bgcolor: "grey.100" },
                }}
              >
                <img
                  src={component.imagea ? `${API_BASE_URL}/images/${component.imagea}` : FALLBACK_IMAGE}
                  alt={component.name}
                  style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 4 }}
                  onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                  loading="lazy"
                />
                <Typography variant="h6" fontWeight="medium">
                  {component.name}
                </Typography>
              </Box>
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PCBuilderPage;