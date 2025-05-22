// src/components/ComponentProductsPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPCComponents, fetchPCPartsByBuilderId, clearPCBError } from "../../../store/pcbuilderSlice";
import { Box, Typography, CircularProgress, Alert, Button } from "@mui/material";
import PcBuilderCard from "./PcBuilderCard";

const ComponentProductsPage = () => {
  const dispatch = useDispatch();
  const { categoryName } = useParams();
  const { components, categoryParts, loading, error } = useSelector((state) => state.pcBuilder);

  const selectedCategory = components.find(
    (component) => component.name.trim().toLowerCase() === categoryName.toLowerCase()
  );

  useEffect(() => {
    if (components.length === 0) {
      dispatch(fetchPCComponents());
    }
    if (selectedCategory?.id) {
      dispatch(fetchPCPartsByBuilderId(selectedCategory.id));
    }
  }, [dispatch, components, selectedCategory]);

  const handleRetry = () => {
    dispatch(clearPCBError());
    if (selectedCategory?.id) {
      dispatch(fetchPCPartsByBuilderId(selectedCategory.id));
    }
  };

  return (
    <Box sx={{ maxWidth: "1200px", px: { xs: 1, sm: 2 }, py: 4, mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        {selectedCategory ? `${selectedCategory.name} Parts` : "Category Not Found"}
      </Typography>
      {loading.categoryParts ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error.categoryParts ? (
        <Box mb={4}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.categoryParts}
          </Alert>
          <Button variant="contained" color="primary" onClick={handleRetry}>
            Retry
          </Button>
        </Box>
      ) : !selectedCategory ? (
        <Typography variant="h6" textAlign="center" my={4}>
          Category not found.
        </Typography>
      ) : categoryParts.length === 0 ? (
        <Typography variant="h6" textAlign="center" my={4}>
          No parts found for this category.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr 1fr" },
            gap: 2,
            px: { xs: 1, md: 5 },
          }}
        >
          {categoryParts.map((part) => (
            <PcBuilderCard
              key={part.id}
              id={part.id}
              imagea={part.imagea}
              name={part.name}
              regularprice={part.regularprice}
              specialprice={part.specialprice}
              description={part.description}
              performance={part.performance}
              ability={part.ability}
              quantity={part.quantity}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ComponentProductsPage;
