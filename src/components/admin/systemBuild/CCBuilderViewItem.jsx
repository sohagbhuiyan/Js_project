import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchCCItemDetailsById,
  fetchCCItems,
  fetchCCComponents,
  updateCCItemDetails,
  deleteCCItemDetails,
  clearCCBError,
  clearCCBSuccess,
} from "../../../store/ccbuilderSlice";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const CCBuilderViewItem = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, components, currentItemDetails, loading, successMessage, error } = useSelector(
    (state) => state.ccBuilder
  );
  const token = useSelector((state) => state.auth.token) || localStorage.getItem("authToken");
  const userRole = useSelector((state) => state.auth.role) || localStorage.getItem("authRole");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    performance: "",
    ability: "",
    regularprice: "",
    warranty: "",
    benefits: "",
    moralqualities: "",
    opportunity: "",
    specialprice: "",
    quantity: "",
    itemId: "",
    ccBuilderId: "",
    imagea: null,
  });
  const [success, setSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch item details, items, and components on mount
  useEffect(() => {
    dispatch(fetchCCItemDetailsById(id));
    dispatch(fetchCCItems());
    dispatch(fetchCCComponents());
  }, [dispatch, id]);

  // Populate form with fetched item details
  useEffect(() => {
    if (currentItemDetails) {
      setFormData({
        name: currentItemDetails.name || "",
        description: currentItemDetails.description || "",
        performance: currentItemDetails.performance || "",
        ability: currentItemDetails.ability || "",
        regularprice: currentItemDetails.regularprice || "",
        warranty: currentItemDetails.warranty || "",
        benefits: currentItemDetails.benefits || "",
        moralqualities: currentItemDetails.moralqualities || "",
        opportunity: currentItemDetails.opportunity || "",
        specialprice: currentItemDetails.specialprice || "",
        quantity: currentItemDetails.quantity || "",
        itemId: currentItemDetails.item?.id || "",
        ccBuilderId: currentItemDetails.ccBuilder?.id || "",
        imagea: null,
      });
    }
  }, [currentItemDetails]);

  // Handle success/error messages
  useEffect(() => {
    if (successMessage.itemDetails || error.itemDetails) {
      setSuccess(successMessage.itemDetails || "");
      setFormError(error.itemDetails || "");
      const timer = setTimeout(() => {
        dispatch(clearCCBSuccess());
        dispatch(clearCCBError());
        setSuccess("");
        setFormError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage.itemDetails, error.itemDetails, dispatch]);

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
      "benefits",
      "moralqualities",
      "opportunity",
      "specialprice",
      "quantity",
      "ccBuilderId",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setFormError(`${field} is required.`);
        return;
      }
    }

    // Validate numeric fields
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
    if (formData.warranty && (isNaN(parseInt(formData.warranty)) || parseInt(formData.warranty) < 0)) {
      setFormError("Warranty must be a valid integer.");
      return;
    }

    // Prepare payload
    const payload = {
      id,
      name: formData.name,
      description: formData.description,
      performance: formData.performance,
      ability: formData.ability,
      regularprice: parseFloat(formData.regularprice),
      warranty: parseInt(formData.warranty) || 0,
      benefits: formData.benefits,
      moralqualities: formData.moralqualities,
      opportunity: formData.opportunity,
      specialprice: parseFloat(formData.specialprice),
      quantity: parseInt(formData.quantity),
      ccBuilderId: parseInt(formData.ccBuilderId),
      itemId: formData.itemId ? parseInt(formData.itemId) : undefined,
      imagea: formData.imagea,
    };

    try {
      const resultAction = await dispatch(updateCCItemDetails(payload));
      if (updateCCItemDetails.fulfilled.match(resultAction)) {
        setSuccess("Item details updated successfully!");
        setTimeout(() => navigate("/cc-builder"), 2000);
      } else {
        setFormError(resultAction.payload || "Failed to update item details.");
      }
    } catch (err) {
      setFormError("Failed to update item details.");
      console.error("Error:", err);
    }
  };

  const handleDelete = async () => {
    setSuccess("");
    setFormError("");
    try {
      const resultAction = await dispatch(deleteCCItemDetails(id));
      if (deleteCCItemDetails.fulfilled.match(resultAction)) {
        setSuccess("Item details deleted successfully!");
        setTimeout(() => navigate("/cc-builder"), 2000);
      } else {
        setFormError(resultAction.payload || "Failed to delete item details.");
      }
    } catch (err) {
      setFormError("Failed to delete item details.");
      console.error("Error:", err);
    }
    setDeleteDialogOpen(false);
  };

  // Filter items based on selected ccBuilderId
  const filteredItems = formData.ccBuilderId
    ? items.filter((item) => String(item.ccBuilder?.id) === String(formData.ccBuilderId))
    : items;

  if (!userRole || userRole !== "admin") {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Alert severity="error">You do not have permission to access this page.</Alert>
      </Box>
    );
  }

  if (loading.itemDetails && !currentItemDetails) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentItemDetails) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Alert severity="error">Item details not found.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "md", mx: "auto", p: 4 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        View/Edit CC Builder Item Details
      </Typography>
      <StyledPaper elevation={3}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={loading.itemDetails}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={loading.itemDetails || !components.length}>
                <InputLabel>Select CC Builder</InputLabel>
                <Select
                  name="ccBuilderId"
                  value={formData.ccBuilderId}
                  onChange={handleInputChange}
                  required
                  label="Select CC Builder"
                >
                  <MenuItem value="">
                    <em>Select a CC Builder</em>
                  </MenuItem>
                  {components.length ? (
                    components.map((builder) => (
                      <MenuItem key={builder.id} value={builder.id}>
                        {builder.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No CC Builders available
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={loading.itemDetails}>
                <InputLabel>Select Item (Optional)</InputLabel>
                <Select
                  name="itemId"
                  value={formData.itemId}
                  onChange={handleInputChange}
                  label="Select Item (Optional)"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {filteredItems.length ? (
                    filteredItems.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name} (ID: {item.id})
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No Items available
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
                disabled={loading.itemDetails}
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
                disabled={loading.itemDetails}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ability"
                name="ability"
                value={formData.ability}
                onChange={handleInputChange}
                required
                disabled={loading.itemDetails}
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
                disabled={loading.itemDetails}
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
                disabled={loading.itemDetails}
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
                disabled={loading.itemDetails}
                variant="outlined"
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Warranty (years)"
                name="warranty"
                type="number"
                value={formData.warranty}
                onChange={handleInputChange}
                disabled={loading.itemDetails}
                variant="outlined"
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Benefits"
                name="benefits"
                value={formData.benefits}
                onChange={handleInputChange}
                required
                disabled={loading.itemDetails}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Moral Qualities"
                name="moralqualities"
                value={formData.moralqualities}
                onChange={handleInputChange}
                required
                disabled={loading.itemDetails}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Opportunity"
                name="opportunity"
                value={formData.opportunity}
                onChange={handleInputChange}
                required
                disabled={loading.itemDetails}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image"
                type="file"
                name="imagea"
                onChange={handleFileChange}
                disabled={loading.itemDetails}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading.itemDetails}
                  startIcon={loading.itemDetails ? <CircularProgress size={20} /> : null}
                >
                  {loading.itemDetails ? "Processing..." : "Update Item Details"}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={loading.itemDetails}
                >
                  Delete Item Details
                </Button>
                <Button
                  component={Link}
                  to="/cc-builder"
                  variant="outlined"
                  color="secondary"
                  disabled={loading.itemDetails}
                >
                  Back to CC Builder
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this item detail? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CCBuilderViewItem;