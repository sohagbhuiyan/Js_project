// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchPCComponents, fetchPCParts, clearPCBError } from "../../../store/pcbuilderSlice";
// import {
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Alert,
//   CircularProgress,
//   Button,
// } from "@mui/material";
// import { API_BASE_URL } from "../../../store/api";

// const FALLBACK_IMAGE = "/images/placeholder.png";

// const ViewSystemBuilder = () => {
//   const dispatch = useDispatch();
//   const { components, parts, loading, error } = useSelector((state) => state.pcBuilder);
//   const userRole = useSelector((state) => state.auth.role) || localStorage.getItem("authRole");

//   useEffect(() => {
//     dispatch(fetchPCComponents());
//     dispatch(fetchPCParts());
//   }, [dispatch]);

//   const handleRetry = () => {
//     dispatch(clearPCBError());
//     dispatch(fetchPCComponents());
//     dispatch(fetchPCParts());
//   };

//   if (userRole !== "admin") {
//     return (
//       <Box sx={{ maxWidth: 1200, mx: "auto", mt: 5, p: { xs: 1, sm: 2 }, textAlign: "center" }}>
//         <Typography variant="h6" color="error">
//           You do not have permission to access this page.
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         maxWidth: 1200,
//         mx: "auto",
//         mt: 5,
//         p: { xs: 1, sm: 2 },
//         borderRadius: 2,
//         boxShadow: 3,
//         bgcolor: "background.paper",
//       }}
//     >
//       <Typography variant="h5" mb={4} fontWeight="bold" textAlign="center">
//         System Builder Admin Panel
//       </Typography>

//       {/* PC Components Section */}
//       <Box mb={6}>
//         <Typography variant="h6" mb={2} fontWeight="medium">
//           PC Components
//         </Typography>
//         {loading.component ? (
//           <Box display="flex" justifyContent="center">
//             <CircularProgress />
//           </Box>
//         ) : error.component ? (
//           <Box mb={2}>
//             <Alert severity="error" sx={{ mb: 2 }}>
//               {error.component}
//             </Alert>
//             <Button variant="contained" color="primary" onClick={handleRetry}>
//               Retry
//             </Button>
//           </Box>
//         ) : components.length === 0 ? (
//           <Typography>No PC components found.</Typography>
//         ) : (
//           <TableContainer component={Paper}>
//             <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>ID</TableCell>
//                   <TableCell>Name</TableCell>
//                   <TableCell>Image</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {components.map((component) => (
//                   <TableRow key={component.id}>
//                     <TableCell>{component.id}</TableCell>
//                     <TableCell>{component.name}</TableCell>
//                     <TableCell>
//                       <img
//                         src={component.imagea ? `${API_BASE_URL}/images/${component.imagea}` : FALLBACK_IMAGE}
//                         alt={component.name}
//                         style={{ width: 50, height: 50, objectFit: "contain", borderRadius: 4 }}
//                         onError={(e) => (e.target.src = FALLBACK_IMAGE)}
//                         loading="lazy"
//                       />
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Box>

//       {/* PC Parts Section */}
//       <Box>
//         <Typography variant="h6" mb={2} fontWeight="medium">
//           PC Parts
//         </Typography>
//         {loading.part ? (
//           <Box display="flex" justifyContent="center">
//             <CircularProgress />
//           </Box>
//         ) : error.part ? (
//           <Box mb={2}>
//             <Alert severity="error" sx={{ mb: 2 }}>
//               {error.part}
//             </Alert>
//             <Button variant="contained" color="primary" onClick={handleRetry}>
//               Retry
//             </Button>
//           </Box>
//         ) : parts.length === 0 ? (
//           <Typography>No PC parts found.</Typography>
//         ) : (
//           <TableContainer component={Paper}>
//             <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>ID</TableCell>
//                   <TableCell>Name</TableCell>
//                   <TableCell>System Category</TableCell>
//                   <TableCell>Description</TableCell>
//                   <TableCell>Performance</TableCell>
//                   <TableCell>Ability</TableCell>
//                   <TableCell>Regular Price</TableCell>
//                   <TableCell>Special Price</TableCell>
//                   <TableCell>Quantity</TableCell>
//                   <TableCell>Image</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {parts.map((part) => (
//                   <TableRow key={part.id}>
//                     <TableCell>{part.id}</TableCell>
//                     <TableCell>{part.name}</TableCell>
//                     <TableCell>{part.pcbuilder?.name || part.pcbuilder?.id || "N/A"}</TableCell>
//                     <TableCell>{part.description || "N/A"}</TableCell>
//                     <TableCell>{part.performance || "N/A"}</TableCell>
//                     <TableCell>{part.ability || "N/A"}</TableCell>
//                     <TableCell>${part.regularprice?.toFixed(2) || "N/A"}</TableCell>
//                     <TableCell>${part.specialprice?.toFixed(2) || "N/A"}</TableCell>
//                     <TableCell>{part.quantity || "N/A"}</TableCell>
//                     <TableCell>
//                       <img
//                         src={part.imagea ? `${API_BASE_URL}/images/${part.imagea}` : FALLBACK_IMAGE}
//                         alt={part.name}
//                         style={{ width: 50, height: 50, objectFit: "contain", borderRadius: 4 }}
//                         onError={(e) => (e.target.src = FALLBACK_IMAGE)}
//                         loading="lazy"
//                       />
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default ViewSystemBuilder;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPCComponents,
  fetchPCParts,
  fetchPCPartsById,
  updatePCPart,
  deletePCPart,
  clearPCBError,
  clearPCBSuccess,
} from "../../../store/pcbuilderSlice";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { API_BASE_URL } from "../../../store/api";

const FALLBACK_IMAGE = "/images/placeholder.png";

const ViewSystemBuilder = () => {
  const dispatch = useDispatch();
  const { components, parts, currentPart, loading, error, successMessage } = useSelector((state) => state.pcBuilder);
  const userRole = useSelector((state) => state.auth.role) || localStorage.getItem("authRole");
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    performance: "",
    ability: "",
    regularprice: "",
    specialprice: "",
    quantity: "",
    pcbuilder: { id: "" },
    image: null,
  });

  useEffect(() => {
    dispatch(fetchPCComponents());
    dispatch(fetchPCParts());
  }, [dispatch]);

  useEffect(() => {
    if (currentPart) {
      setFormData({
        name: currentPart.name || "",
        description: currentPart.description || "",
        performance: currentPart.performance || "",
        ability: currentPart.ability || "",
        regularprice: currentPart.regularprice || "",
        specialprice: currentPart.specialprice || "",
        quantity: currentPart.quantity || "",
        pcbuilder: currentPart.pcbuilder || { id: "" },
        image: null,
      });
    }
  }, [currentPart]);

  const handleRetry = () => {
    dispatch(clearPCBError());
    dispatch(fetchPCComponents());
    dispatch(fetchPCParts());
  };

  const handleOpenUpdateDialog = (id) => {
    setSelectedPartId(id);
    dispatch(fetchPCPartsById(id));
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setSelectedPartId(null);
    dispatch(clearPCBSuccess());
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedPartId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedPartId(null);
    dispatch(clearPCBSuccess());
  };

  const handleUpdatePart = () => {
    dispatch(
      updatePCPart({
        id: selectedPartId,
        ...formData,
      })
    ).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        handleCloseUpdateDialog();
      }
    });
  };

  const handleDeletePart = () => {
    dispatch(deletePCPart(selectedPartId)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        handleCloseDeleteDialog();
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "pcbuilder") {
      setFormData({ ...formData, pcbuilder: { id: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
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

      {/* Success Messages */}
      {(successMessage.update || successMessage.delete) && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => dispatch(clearPCBSuccess())}>
          {successMessage.update || successMessage.delete}
        </Alert>
      )}

      {/* Error Messages */}
      {(error.update || error.delete) && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearPCBError())}>
          {error.update || error.delete}
        </Alert>
      )}

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
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parts.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell>
                      <Button
                        color="primary"
                        onClick={() => handleOpenUpdateDialog(part.id)}
                        sx={{ textTransform: "none" }}
                      >
                        {part.id}
                      </Button>
                    </TableCell>
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
                    <TableCell>
                      <IconButton color="error" onClick={() => handleOpenDeleteDialog(part.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Update Dialog */}
      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update PC Part</DialogTitle>
        <DialogContent>
          {loading.part ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                label="Performance"
                name="performance"
                value={formData.performance}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Ability"
                name="ability"
                value={formData.ability}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Regular Price"
                name="regularprice"
                type="number"
                value={formData.regularprice}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Special Price"
                name="specialprice"
                type="number"
                value={formData.specialprice}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                select
                label="System Category"
                name="pcbuilder"
                value={formData.pcbuilder.id}
                onChange={handleInputChange}
                fullWidth
                required
              >
                {components.map((component) => (
                  <MenuItem key={component.id} value={component.id}>
                    {component.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                type="file"
                onChange={handleImageChange}
                fullWidth
                helperText="Upload new image (optional)"
              />
            </Box>
          )}
          {error.update && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error.update}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>Cancel</Button>
          <Button
            onClick={handleUpdatePart}
            variant="contained"
            color="primary"
            disabled={loading.update}
          >
            {loading.update ? <CircularProgress size={24} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this PC part?</Typography>
          {error.delete && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error.delete}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleDeletePart}
            color="error"
            variant="contained"
            disabled={loading.delete}
          >
            {loading.delete ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewSystemBuilder;