import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPCPartsById,
  updatePCPart,
  fetchPCComponents,
  clearPCBError,
  clearPCBSuccess,
} from "../../../store/pcbuilderSlice";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Alert,
  Fade,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const EditPCPart = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { components, currentPart, loading, error, successMessage } = useSelector(
    (state) => state.pcBuilder
  );
  const userRole = useSelector((state) => state.auth.role) || localStorage.getItem("authRole");

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    performance: "",
    ability: "",
    regularprice: "",
    specialprice: "",
    quantity: "",
    pcbuilderId: "",
    imagea: null,
  });
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch part and components on mount
  useEffect(() => {
    dispatch(fetchPCPartsById(id));
    dispatch(fetchPCComponents());
  }, [dispatch, id]);

  // Populate form when currentPart is fetched
  useEffect(() => {
    if (currentPart) {
      setFormData({
        id: currentPart.id || "",
        name: currentPart.name || "",
        description: currentPart.description || "",
        performance: currentPart.performance || "",
        ability: currentPart.ability || "",
        regularprice: currentPart.regularprice || "",
        specialprice: currentPart.specialprice || "",
        quantity: currentPart.quantity || "",
        pcbuilderId: currentPart.pcbuilder?.id || "",
        imagea: null,
      });
    }
  }, [currentPart]);

  // Clear success/error messages after 5 seconds
  useEffect(() => {
    if (successMessage.update || error.update) {
      setSuccess(successMessage.update || "");
      setFormError(error.update || "");
      const timer = setTimeout(() => {
        dispatch(clearPCBSuccess());
        dispatch(clearPCBError());
        setSuccess("");
        setFormError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage.update, error.update, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, imagea: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setFormError("");

    // Validate required fields
    const requiredFields = [
      "name",
      "description",
      "performance",
      "ability",
      "regularprice",
      "specialprice",
      "quantity",
      "pcbuilderId",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setFormError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
        return;
      }
    }

    if (isNaN(parseFloat(formData.regularprice)) || parseFloat(formData.regularprice) < 0) {
      setFormError("Regular price must be a valid number.");
      return;
    }
    if (isNaN(parseFloat(formData.specialprice)) || parseFloat(formData.specialprice) < 0) {
      setFormError("Special price must be a valid number.");
      return;
    }
    if (isNaN(parseInt(formData.quantity)) || parseInt(formData.quantity) < 0) {
      setFormError("Quantity must be a valid integer.");
      return;
    }

    // Prepare payload
    const payload = {
      id: parseInt(formData.id),
      name: formData.name,
      description: formData.description,
      performance: formData.performance,
      ability: formData.ability,
      regularprice: parseFloat(formData.regularprice),
      specialprice: parseFloat(formData.specialprice),
      quantity: parseInt(formData.quantity),
      pcbuilder: { id: parseInt(formData.pcbuilderId) },
      imagea: formData.imagea,
    };

    try {
      const resultAction = await dispatch(updatePCPart(payload));
      if (updatePCPart.fulfilled.match(resultAction)) {
        setSuccess("PC part updated successfully!");
        setTimeout(() => navigate("/admin/pc-builder-view-part"), 2000);
      } else {
        setFormError(resultAction.payload || "Failed to update PC part.");
      }
    } catch (err) {
      setFormError("Failed to update PC part.");
      console.error("Error:", err);
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
    <Box sx={{ maxWidth: "md", mx: "auto", p: 4 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Edit PC Part
      </Typography>
      <StyledPaper elevation={3}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Part Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={loading.update}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={loading.update || !components.length}>
                <InputLabel>Select PC Builder</InputLabel>
                <Select
                  name="pcbuilderId"
                  value={formData.pcbuilderId}
                  onChange={handleInputChange}
                  required
                  label="Select PC Builder"
                >
                  <MenuItem value="">
                    <em>Select a PC Builder</em>
                  </MenuItem>
                  {components.length ? (
                    components.map((component) => (
                      <MenuItem key={component.id} value={component.id}>
                        {component.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No PC Builders available
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                disabled={loading.update}
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Performance"
                name="performance"
                value={formData.performance}
                onChange={handleInputChange}
                required
                disabled={loading.update}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Others Info"
                name="ability"
                value={formData.ability}
                onChange={handleInputChange}
                required
                disabled={loading.update}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Regular Price"
                name="regularprice"
                type="number"
                value={formData.regularprice}
                onChange={handleInputChange}
                required
                disabled={loading.update}
                variant="outlined"
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Special Price"
                name="specialprice"
                type="number"
                value={formData.specialprice}
                onChange={handleInputChange}
                required
                disabled={loading.update}
                variant="outlined"
                inputProps={{ min: 0, step: "0.01" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                disabled={loading.update}
                variant="outlined"
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image"
                type="file"
                name="imagea"
                onChange={handleFileChange}
                disabled={loading.update}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  disabled={loading.update}
                  startIcon={loading.update ? <CircularProgress size={20} /> : null}
                >
                  {loading.update ? "Processing..." : "Update PC Part"}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/admin/pc-builder-view-part")}
                  disabled={loading.update}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
        <Fade in={!!success || !!formError}>
          <Box sx={{ mt: 2 }}>
            {success && <Alert severity="success">{success}</Alert>}
            {formError && <Alert severity="error">{formError}</Alert>}
          </Box>
        </Fade>
      </StyledPaper>
    </Box>
  );
};

export default EditPCPart;