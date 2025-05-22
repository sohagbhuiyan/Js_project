
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCCItemDetailsByBuilderId, clearCCBError } from "../../../store/ccbuilderSlice";
import { Box, Typography, CircularProgress, Alert, Button } from "@mui/material";
import CCItemDetailsCard from "./CCItemDetailsCard";

const CComponentProductsPageCC = () => {
  const dispatch = useDispatch();
  const { ccBuilderId } = useParams();
  const { itemDetails, loading, error, components } = useSelector((state) => state.ccBuilder);

  // Find builder name for display
  const builder = components.find((c) => String(c.id) === String(ccBuilderId));
  const builderName = builder ? builder.name : "Unknown Builder";

  useEffect(() => {
    if (ccBuilderId) {
      dispatch(fetchCCItemDetailsByBuilderId(ccBuilderId));
    }
  }, [dispatch, ccBuilderId]);

  const handleRetry = () => {
    dispatch(clearCCBError());
    if (ccBuilderId) {
      dispatch(fetchCCItemDetailsByBuilderId(ccBuilderId));
    }
  };

  return (
    <Box sx={{ maxWidth: "1200px", px: { xs: 1, sm: 2 }, py: 4, mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        {builderName} Item Details
      </Typography>
      {loading.itemDetails ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error.itemDetails ? (
        <Box mb={4}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.itemDetails}
          </Alert>
          <Button variant="contained" color="primary" onClick={handleRetry}>
            Retry
          </Button>
        </Box>
      ) : itemDetails.length === 0 ? (
        <Typography variant="h6" textAlign="center" my={4}>
          No item details found for this builder.
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
          {itemDetails.map((detail) => (
            <CCItemDetailsCard
              key={detail.id}
              id={detail.id}
              imagea={detail.imagea}
              name={detail.name}
              regularprice={detail.regularprice}
              specialprice={detail.specialprice}
              description={detail.description}
              performance={detail.performance}
              ability={detail.ability}
              quantity={detail.quantity}
              benefits={detail.benefits}
              moralqualities={detail.moralqualities}
              opportunity={detail.opportunity}
              warranty={detail.warranty}
              ccBuilder={detail.ccBuilder}
              item={detail.item}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CComponentProductsPageCC;
