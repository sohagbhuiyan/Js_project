import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPCComponent, fetchPCComponents, addPCPart } from "../../../store/pcbuilderSlice";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

const PCBuilder = () => {
  const dispatch = useDispatch();
  const { components, parts, loading, error, successMessage } = useSelector((state) => state.pcBuilder);
  const userRole = useSelector((state) => state.auth.role) || localStorage.getItem("authRole");

  // State for PC Component form
  const [componentName, setComponentName] = useState("");
  const [componentImage, setComponentImage] = useState(null);

  // State for PC Part form
  const [selectedComponentId, setSelectedComponentId] = useState("");
  const [partName, setPartName] = useState("");
  const [partDescription, setPartDescription] = useState("");
  const [partPerformance, setPartPerformance] = useState("");
  const [partAbility, setPartAbility] = useState("");
  const [partRegularPrice, setPartRegularPrice] = useState("");
  const [partSpecialPrice, setPartSpecialPrice] = useState("");
  const [partQuantity, setPartQuantity] = useState("");
  const [partImage, setPartImage] = useState(null);

  useEffect(() => {
    dispatch(fetchPCComponents());
  }, [dispatch]);

  const handleComponentSubmit = async (e) => {
    e.preventDefault();
    if (!componentName || !componentImage) return;

    const result = await dispatch(addPCComponent({ name: componentName, image: componentImage }));
    if (addPCComponent.fulfilled.match(result)) {
      setComponentName("");
      setComponentImage(null);
      window.location.reload(); // Reload page to refresh component list
    }
  };

  const handlePartSubmit = (e) => {
    e.preventDefault();
    if (
      !selectedComponentId ||
      !partName ||
      !partDescription ||
      !partPerformance ||
      !partAbility ||
      !partRegularPrice ||
      !partSpecialPrice ||
      !partQuantity ||
      !partImage
    ) return;

    dispatch(
      addPCPart({
        name: partName,
        description: partDescription,
        performance: partPerformance,
        ability: partAbility,
        regularprice: partRegularPrice,
        specialprice: partSpecialPrice,
        quantity: partQuantity,
        pcbuilder: { id: selectedComponentId },
        image: partImage,
      })
    );

    // Clear form
    setSelectedComponentId("");
    setPartName("");
    setPartDescription("");
    setPartPerformance("");
    setPartAbility("");
    setPartRegularPrice("");
    setPartSpecialPrice("");
    setPartQuantity("");
    setPartImage(null);
  };

  if (userRole !== "admin") {
    return (
      <Box maxWidth={600} mx="auto" mt={5} p={3} textAlign="center">
        <Typography variant="h6" color="error">
          You do not have permission to access this page.
        </Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth={600} mx="auto" mt={5} p={3} borderRadius={2} boxShadow={3} bgcolor="white">
      <Typography variant="h5" mb={3} fontWeight="bold" textAlign="center">
        PC Builder Management
      </Typography>

      {/* Add PC Component Form */}
      <Box mb={6}>
        <Typography variant="h6" mb={2} fontWeight="medium">
          Add System Category
        </Typography>
        <form onSubmit={handleComponentSubmit}>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Category Name"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              required
              variant="outlined"
            />
          </Box>
          <Box mb={2}>
            <Button variant="contained" component="label" fullWidth>
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setComponentImage(e.target.files[0])}
                required
              />
            </Button>
            {componentImage && (
              <Typography variant="body2" mt={1}>
                Selected: {componentImage.name}
              </Typography>
            )}
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading.component}
            startIcon={loading.component && <CircularProgress size={20} />}
          >
            {loading.component ? "Saving..." : "Add System Category"}
          </Button>
        </form>
        {successMessage.component && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {successMessage.component}
          </Alert>
        )}
        {error.component && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error.component}
          </Alert>
        )}
      </Box>

      {/* Add PC Part Form */}
      <Box>
        <Typography variant="h6" mb={2} fontWeight="medium">
          Add System Items
        </Typography>
        <form onSubmit={handlePartSubmit}>
          <Box mb={2}>
            <FormControl fullWidth required>
              <InputLabel>Select a Category</InputLabel>
              <Select
                value={selectedComponentId}
                onChange={(e) => setSelectedComponentId(e.target.value)}
                label="Select Category"
              >
                <MenuItem value="">Select Category</MenuItem>
                {components.map((component) => (
                  <MenuItem key={component.id} value={component.id}>
                    {component.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Part Name"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              required
              variant="outlined"
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Description"
              value={partDescription}
              onChange={(e) => setPartDescription(e.target.value)}
              required
              variant="outlined"
              multiline
              rows={2}
              inputProps={{ maxLength: 5000 }} 
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Performance"
              value={partPerformance}
              onChange={(e) => setPartPerformance(e.target.value)}
              required
              variant="outlined"
              multiline
              rows={1}
              inputProps={{ maxLength: 5000 }} 
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Others info"
              value={partAbility}
              onChange={(e) => setPartAbility(e.target.value)}
              required
              variant="outlined"
              multiline
              rows={1}
              inputProps={{ maxLength: 5000 }} 
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Regular Price"
              type="number"
              value={partRegularPrice}
              onChange={(e) => setPartRegularPrice(e.target.value)}
              required
              variant="outlined"
              inputProps={{ step: "0.01" }}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Special Price"
              type="number"
              value={partSpecialPrice}
              onChange={(e) => setPartSpecialPrice(e.target.value)}
              required
              variant="outlined"
              inputProps={{ step: "0.01" }}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={partQuantity}
              onChange={(e) => setPartQuantity(e.target.value)}
              required
              variant="outlined"
              inputProps={{ min: "0" }}
            />
          </Box>
          <Box mb={2}>
            <Button variant="contained" component="label" fullWidth>
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setPartImage(e.target.files[0])}
                required
              />
            </Button>
            {partImage && (
              <Typography variant="body2" mt={1}>
                Selected: {partImage.name}
              </Typography>
            )}
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            disabled={loading.part}
            startIcon={loading.part && <CircularProgress size={20} />}
          >
            {loading.part ? "Saving..." : "Add System Items"}
          </Button>
        </form>
        {successMessage.part && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {successMessage.part}
          </Alert>
        )}
        {error.part && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error.part}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default PCBuilder;
