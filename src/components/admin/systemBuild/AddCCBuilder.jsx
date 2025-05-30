// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   addCCComponent,
//   addCCItem,
//   fetchCCComponents,
//   fetchCCBuilderById,
//   fetchCCItems,
//   fetchCCItemById,
//   updateCCBuilder,
//   updateCCItem,
// } from '../../../store/ccbuilderSlice';
// import {
//   Box,
//   Button,
//   CircularProgress,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Typography,
//   Paper,
//   Grid,
//   Alert,
//   Fade,
// } from '@mui/material';
// import { styled } from '@mui/material/styles';

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(3),
//   marginBottom: theme.spacing(3),
//   borderRadius: theme.shape.borderRadius,
//   boxShadow: theme.shadows[3],
// }));

// const AddCCBuilder = () => {
//   const dispatch = useDispatch();
//   const {
//     components: ccBuilders,
//     items,
//     currentBuilder,
//     currentItem,
//     loading,
//     successMessage,
//     error,
//   } = useSelector((state) => state.ccBuilder);
//   const token = useSelector((state) => state.auth.token) || localStorage.getItem('authToken');
//   const userRole = useSelector((state) => state.auth.role) || localStorage.getItem('authRole');

//   const [ccBuilderName, setCCBuilderName] = useState('');
//   const [ccBuilderSuccess, setCCBuilderSuccess] = useState('');
//   const [ccBuilderError, setCCBuilderError] = useState('');
//   const [selectedCCBuilderId, setSelectedCCBuilderId] = useState('');
//   const [itemName, setItemName] = useState('');
//   const [submenuType, setSubmenuType] = useState('default');
//   const [itemSuccess, setItemSuccess] = useState('');
//   const [itemError, setItemError] = useState('');
//   const [editBuilderId, setEditBuilderId] = useState(null);
//   const [editItemId, setEditItemId] = useState(null);

//   // Fetch CC Builders and Items on mount
//   useEffect(() => {
//     dispatch(fetchCCComponents());
//     dispatch(fetchCCItems());
//   }, [dispatch]);

//   // Populate form fields when editing
//   useEffect(() => {
//     if (currentBuilder) {
//       setCCBuilderName(currentBuilder.name || '');
//       setEditBuilderId(currentBuilder.id);
//     }
//   }, [currentBuilder]);

//   useEffect(() => {
//     if (currentItem) {
//       setItemName(currentItem.name || '');
//       setSubmenuType(currentItem.submenuType || 'default');
//       setSelectedCCBuilderId(currentItem.ccBuilder?.id || '');
//       setEditItemId(currentItem.id);
//     }
//   }, [currentItem]);

//   // Clear success/error messages after 5 seconds
//   useEffect(() => {
//     if (successMessage.component || error.component) {
//       setCCBuilderSuccess(successMessage.component || '');
//       setCCBuilderError(error.component || '');
//       const timer = setTimeout(() => {
//         dispatch({ type: 'ccBuilder/clearCCBSuccess' });
//         dispatch({ type: 'ccBuilder/clearCCBError' });
//         setCCBuilderSuccess('');
//         setCCBuilderError('');
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//     if (successMessage.item || error.item) {
//       setItemSuccess(successMessage.item || '');
//       setItemError(error.item || '');
//       const timer = setTimeout(() => {
//         dispatch({ type: 'ccBuilder/clearCCBSuccess' });
//         dispatch({ type: 'ccBuilder/clearCCBError' });
//         setItemSuccess('');
//         setItemError('');
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [successMessage, error, dispatch]);

//   const handleCCBuilderSubmit = async (e) => {
//     e.preventDefault();
//     setCCBuilderSuccess('');
//     setCCBuilderError('');

//     const trimmedName = ccBuilderName.trim();
//     if (!trimmedName) {
//       setCCBuilderError('CC Builder name is required.');
//       return;
//     }
//     if (
//       ccBuilders.some(
//         (builder) =>
//           builder.name.toLowerCase() === trimmedName.toLowerCase() &&
//           (!editBuilderId || builder.id !== editBuilderId)
//       )
//     ) {
//       setCCBuilderError('CC Builder name already exists.');
//       return;
//     }

//     try {
//       let resultAction;
//       if (editBuilderId) {
//         resultAction = await dispatch(updateCCBuilder({ id: editBuilderId, name: trimmedName }));
//       } else {
//         resultAction = await dispatch(addCCComponent({ name: trimmedName }));
//       }

//       if (
//         (editBuilderId && updateCCBuilder.fulfilled.match(resultAction)) ||
//         (!editBuilderId && addCCComponent.fulfilled.match(resultAction))
//       ) {
//         setCCBuilderSuccess(editBuilderId ? 'CC Builder updated successfully!' : 'CC Builder added successfully!');
//         setCCBuilderName('');
//         setEditBuilderId(null);
//         dispatch({ type: 'ccBuilder/resetCurrentBuilder' });
//         dispatch(fetchCCComponents());
//       } else {
//         setCCBuilderError(resultAction.payload || `Failed to ${editBuilderId ? 'update' : 'add'} CC Builder.`);
//       }
//     } catch (err) {
//       setCCBuilderError(`Failed to ${editBuilderId ? 'update' : 'add'} CC Builder.`);
//       console.error('Error:', err);
//     }
//   };

//   const handleItemSubmit = async (e) => {
//     e.preventDefault();
//     setItemSuccess('');
//     setItemError('');

//     const trimmedItemName = itemName.trim();
//     if (!selectedCCBuilderId || !trimmedItemName) {
//       setItemError('All fields are required.');
//       return;
//     }

//     try {
//       let resultAction;
//       if (editItemId) {
//         resultAction = await dispatch(
//           updateCCItem({
//             id: editItemId,
//             name: trimmedItemName,
//             ccBuilderId: selectedCCBuilderId,
//             submenuType,
//           })
//         );
//       } else {
//         resultAction = await dispatch(
//           addCCItem({
//             name: trimmedItemName,
//             ccBuilderId: selectedCCBuilderId,
//             submenuType,
//           })
//         );
//       }

//       if (
//         (editItemId && updateCCItem.fulfilled.match(resultAction)) ||
//         (!editItemId && addCCItem.fulfilled.match(resultAction))
//       ) {
//         setItemSuccess(editItemId ? 'Item updated successfully!' : 'Item added successfully!');
//         setItemName('');
//         setSelectedCCBuilderId('');
//         setSubmenuType('default');
//         setEditItemId(null);
//         dispatch({ type: 'ccBuilder/resetCurrentItem' });
//         dispatch(fetchCCItems());
//       } else {
//         setItemError(resultAction.payload || `Failed to ${editItemId ? 'update' : 'add'} item.`);
//       }
//     } catch (err) {
//       setItemError(`Failed to ${editItemId ? 'update' : 'add'} item.`);
//       console.error('Error:', err);
//     }
//   };

//   const handleEditBuilder = (id) => {
//     dispatch(fetchCCBuilderById(id));
//     setEditBuilderId(id);
//   };

//   const handleEditItem = (id) => {
//     dispatch(fetchCCItemById(id));
//     setEditItemId(id);
//   };

//   const handleCancelEdit = (type) => {
//     if (type === 'builder') {
//       setCCBuilderName('');
//       setEditBuilderId(null);
//       dispatch({ type: 'ccBuilder/resetCurrentBuilder' });
//     } else {
//       setItemName('');
//       setSelectedCCBuilderId('');
//       setSubmenuType('default');
//       setEditItemId(null);
//       dispatch({ type: 'ccBuilder/resetCurrentItem' });
//     }
//   };

//   if (!userRole || userRole !== 'admin') {
//     return (
//       <Box sx={{ textAlign: 'center', mt: 4 }}>
//         <Alert severity="error">
//           You do not have permission to access this page.
//         </Alert>
//       </Box>
//     );
//   }

//   return (
//     <>
//     <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 4, mb:1}}>
//       <Typography variant="h4" gutterBottom align="center" color="primary">
//         Manage CC Builders and Items
//       </Typography>

//       <Grid container spacing={4}>
//         {/* CC Builder Section */}
//         <Grid item xs={12} md={6}>
//           <StyledPaper elevation={3}>
//             <Typography variant="h6" gutterBottom>
//               Manage CC Builder Categories
//             </Typography>
//             <Box sx={{ mb: 3 }}>
//               <FormControl fullWidth disabled={loading.component}>
//                 <InputLabel>Select CC Builder to Edit</InputLabel>
//                 <Select
//                   value={editBuilderId || ''}
//                   onChange={(e) => handleEditBuilder(e.target.value)}
//                   label="Select CC Builder to Edit"
//                 >
//                   <MenuItem value="">
//                     <em>Select a CC Builder</em>
//                   </MenuItem>
//                   {ccBuilders.length ? (
//                     ccBuilders.map((builder) => (
//                       <MenuItem key={builder.id} value={builder.id}>
//                         {builder.name}
//                       </MenuItem>
//                     ))
//                   ) : (
//                     <MenuItem value="" disabled>
//                       No CC Builders available
//                     </MenuItem>
//                   )}
//                 </Select>
//               </FormControl>
//             </Box>

//             <Typography variant="subtitle1" gutterBottom>
//               {editBuilderId ? 'Edit CC Builder' : 'Add New CC Builder'}
//             </Typography>
//             <form onSubmit={handleCCBuilderSubmit}>
//               <TextField
//                 fullWidth
//                 label="CC Builder Name"
//                 value={ccBuilderName}
//                 onChange={(e) => setCCBuilderName(e.target.value)}
//                 required
//                 disabled={loading.component}
//                 sx={{ mb: 2 }}
//                 variant="outlined"
//               />
//               <Box sx={{ display: 'flex', gap: 2 }}>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   disabled={loading.component}
//                   startIcon={loading.component ? <CircularProgress size={20} /> : null}
//                 >
//                   {loading.component ? 'Processing...' : editBuilderId ? 'Update CC Builder' : 'Add CC Builder'}
//                 </Button>
//                 {editBuilderId && (
//                   <Button
//                     variant="outlined"
//                     color="secondary"
//                     onClick={() => handleCancelEdit('builder')}
//                     disabled={loading.component}
//                   >
//                     Cancel
//                   </Button>
//                 )}
//               </Box>
//             </form>
//             <Fade in={!!ccBuilderSuccess || !!ccBuilderError}>
//               <Box sx={{ mt: 2 }}>
//                 {ccBuilderSuccess && <Alert severity="success">{ccBuilderSuccess}</Alert>}
//                 {ccBuilderError && <Alert severity="error">{ccBuilderError}</Alert>}
//               </Box>
//             </Fade>
//           </StyledPaper>
//         </Grid>

//         {/* Item Section */}
//         <Grid item xs={12} md={6}>
//           <StyledPaper elevation={3}>
//             <Typography variant="h6" gutterBottom>
//               Update Items of CC Builder
//             </Typography>
//             <Box sx={{ mb: 3 }}>
//               <FormControl fullWidth disabled={loading.item}>
//                 <InputLabel>Select Item to Edit</InputLabel>
//                 <Select
//                   value={editItemId || ''}
//                   onChange={(e) => handleEditItem(e.target.value)}
//                   label="Select Item to Edit"
//                 >
//                   <MenuItem value="">
//                     <em>Select an Item</em>
//                   </MenuItem>
//                   {items.length ? (
//                     items.map((item) => (
//                       <MenuItem key={item.id} value={item.id}>
//                         {item.name} (Builder: {item.ccBuilder?.name || 'Unknown'})
//                       </MenuItem>
//                     ))
//                   ) : (
//                     <MenuItem value="" disabled>
//                       No Items available
//                     </MenuItem>
//                   )}
//                 </Select>
//               </FormControl>
//             </Box>

//             <Typography variant="subtitle1" gutterBottom>
//               {editItemId ? 'Edit Item' : 'Add New Item'}
//             </Typography>
//             <form onSubmit={handleItemSubmit}>
//               <FormControl fullWidth sx={{ mb: 2 }} disabled={loading.item || !ccBuilders.length}>
//                 <InputLabel>Select CC Builder</InputLabel>
//                 <Select
//                   value={selectedCCBuilderId}
//                   onChange={(e) => setSelectedCCBuilderId(e.target.value)}
//                   required
//                   label="Select CC Builder"
//                 >
//                   <MenuItem value="">
//                     <em>Select CC Builder</em>
//                   </MenuItem>
//                   {ccBuilders.length ? (
//                     ccBuilders.map((builder) => (
//                       <MenuItem key={builder.id} value={builder.id}>
//                         {builder.name}
//                       </MenuItem>
//                     ))
//                   ) : (
//                     <MenuItem value="" disabled>
//                       No CC Builders available
//                     </MenuItem>
//                   )}
//                 </Select>
//               </FormControl>

//               <TextField
//                 fullWidth
//                 label="Item Name"
//                 value={itemName}
//                 onChange={(e) => setItemName(e.target.value)}
//                 required
//                 disabled={loading.item}
//                 sx={{ mb: 2 }}
//                 variant="outlined"
//               />

//               <Box sx={{ display: 'flex', gap: 2 }}>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="success"
//                   disabled={loading.item}
//                   startIcon={loading.item ? <CircularProgress size={20} /> : null}
//                 >
//                   {loading.item ? 'Processing...' : editItemId ? 'Update Item' : 'Add Item'}
//                 </Button>
//                 {editItemId && (
//                   <Button
//                     variant="outlined"
//                     color="secondary"
//                     onClick={() => handleCancelEdit('item')}
//                     disabled={loading.item}
//                   >
//                     Cancel
//                   </Button>
//                 )}
//               </Box>
//             </form>
//             <Fade in={!!itemSuccess || !!itemError}>
//               <Box sx={{ mt: 2 }}>
//                 {itemSuccess && <Alert severity="success">{itemSuccess}</Alert>}
//                 {itemError && <Alert severity="error">{itemError}</Alert>}
//               </Box>
//             </Fade>
//           </StyledPaper>
//         </Grid>
//       </Grid>
//     </Box>
//     </>
//   );
// };

// export default AddCCBuilder;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCCComponent,
  addCCItem,
  fetchCCComponents,
  fetchCCBuilderById,
  fetchCCItems,
  fetchCCItemById,
  updateCCBuilder,
  updateCCItem,
  deleteCCBuilder,
  deleteCCItem,
  clearCCBSuccess,
  clearCCBError,
} from '../../../store/ccbuilderSlice';
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
  Grid,
  Alert,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const AddCCBuilder = () => {
  const dispatch = useDispatch();
  const {
    components: ccBuilders,
    items,
    currentBuilder,
    currentItem,
    loading,
    successMessage,
    error,
  } = useSelector((state) => state.ccBuilder);
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('authToken');
  const userRole = useSelector((state) => state.auth.role) || localStorage.getItem('authRole');

  const [ccBuilderName, setCCBuilderName] = useState('');
  const [ccBuilderSuccess, setCCBuilderSuccess] = useState('');
  const [ccBuilderError, setCCBuilderError] = useState('');
  const [selectedCCBuilderId, setSelectedCCBuilderId] = useState('');
  const [itemName, setItemName] = useState('');
  const [submenuType, setSubmenuType] = useState('default');
  const [itemSuccess, setItemSuccess] = useState('');
  const [itemError, setItemError] = useState('');
  const [editBuilderId, setEditBuilderId] = useState(null);
  const [editItemId, setEditItemId] = useState(null);
  const [deleteBuilderDialogOpen, setDeleteBuilderDialogOpen] = useState(false);
  const [deleteItemDialogOpen, setDeleteItemDialogOpen] = useState(false);
  const [deleteBuilderId, setDeleteBuilderId] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);

  // Fetch CC Builders and Items on mount
  useEffect(() => {
    dispatch(fetchCCComponents());
    dispatch(fetchCCItems());
  }, [dispatch]);

  // Populate form fields when editing
  useEffect(() => {
    if (currentBuilder) {
      setCCBuilderName(currentBuilder.name || '');
      setEditBuilderId(currentBuilder.id);
    }
  }, [currentBuilder]);

  useEffect(() => {
    if (currentItem) {
      setItemName(currentItem.name || '');
      setSubmenuType(currentItem.submenuType || 'default');
      setSelectedCCBuilderId(currentItem.ccBuilder?.id || '');
      setEditItemId(currentItem.id);
    }
  }, [currentItem]);

  // Clear success/error messages after 5 seconds
  useEffect(() => {
    if (successMessage.component || error.component) {
      setCCBuilderSuccess(successMessage.component || '');
      setCCBuilderError(error.component || '');
      const timer = setTimeout(() => {
        dispatch(clearCCBSuccess());
        dispatch(clearCCBError());
        setCCBuilderSuccess('');
        setCCBuilderError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (successMessage.item || error.item) {
      setItemSuccess(successMessage.item || '');
      setItemError(error.item || '');
      const timer = setTimeout(() => {
        dispatch(clearCCBSuccess());
        dispatch(clearCCBError());
        setItemSuccess('');
        setItemError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleCCBuilderSubmit = async (e) => {
    e.preventDefault();
    setCCBuilderSuccess('');
    setCCBuilderError('');

    const trimmedName = ccBuilderName.trim();
    if (!trimmedName) {
      setCCBuilderError('CC Builder name is required.');
      return;
    }
    if (
      ccBuilders.some(
        (builder) =>
          builder.name.toLowerCase() === trimmedName.toLowerCase() &&
          (!editBuilderId || builder.id !== editBuilderId)
      )
    ) {
      setCCBuilderError('CC Builder name already exists.');
      return;
    }

    try {
      let resultAction;
      if (editBuilderId) {
        resultAction = await dispatch(updateCCBuilder({ id: editBuilderId, name: trimmedName }));
      } else {
        resultAction = await dispatch(addCCComponent({ name: trimmedName }));
      }

      if (
        (editBuilderId && updateCCBuilder.fulfilled.match(resultAction)) ||
        (!editBuilderId && addCCComponent.fulfilled.match(resultAction))
      ) {
        setCCBuilderSuccess(editBuilderId ? 'CC Builder updated successfully!' : 'CC Builder added successfully!');
        setCCBuilderName('');
        setEditBuilderId(null);
        dispatch({ type: 'ccBuilder/resetCurrentBuilder' });
        dispatch(fetchCCComponents());
      } else {
        setCCBuilderError(resultAction.payload || `Failed to ${editBuilderId ? 'update' : 'add'} CC Builder.`);
      }
    } catch (err) {
      setCCBuilderError(`Failed to ${editBuilderId ? 'update' : 'add'} CC Builder.`);
      console.error('Error:', err);
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    setItemSuccess('');
    setItemError('');

    const trimmedItemName = itemName.trim();
    if (!selectedCCBuilderId || !trimmedItemName) {
      setItemError('All fields are required.');
      return;
    }

    try {
      let resultAction;
      if (editItemId) {
        resultAction = await dispatch(
          updateCCItem({
            id: editItemId,
            name: trimmedItemName,
            ccBuilderId: selectedCCBuilderId,
          })
        );
      } else {
        resultAction = await dispatch(
          addCCItem({
            name: trimmedItemName,
            ccBuilderId: selectedCCBuilderId,
          })
        );
      }

      if (
        (editItemId && updateCCItem.fulfilled.match(resultAction)) ||
        (!editItemId && addCCItem.fulfilled.match(resultAction))
      ) {
        setItemSuccess(editItemId ? 'Item updated successfully!' : 'Item added successfully!');
        setItemName('');
        setSelectedCCBuilderId('');
        setSubmenuType('default');
        setEditItemId(null);
        dispatch({ type: 'ccBuilder/resetCurrentItem' });
        dispatch(fetchCCItems());
      } else {
        setItemError(resultAction.payload || `Failed to ${editItemId ? 'update' : 'add'} item.`);
      }
    } catch (err) {
      setItemError(`Failed to ${editItemId ? 'update' : 'add'} item.`);
      console.error('Error:', err);
    }
  };

  const handleEditBuilder = (id) => {
    dispatch(fetchCCBuilderById(id));
    setEditBuilderId(id);
  };

  const handleEditItem = (id) => {
    dispatch(fetchCCItemById(id));
    setEditItemId(id);
  };

  const handleDeleteBuilder = async () => {
    setCCBuilderSuccess('');
    setCCBuilderError('');
    try {
      const resultAction = await dispatch(deleteCCBuilder(deleteBuilderId));
      if (deleteCCBuilder.fulfilled.match(resultAction)) {
        setCCBuilderSuccess('CC Builder deleted successfully!');
        setEditBuilderId(null);
        setCCBuilderName('');
        dispatch({ type: 'ccBuilder/resetCurrentBuilder' });
        dispatch(fetchCCComponents());
      } else {
        setCCBuilderError(resultAction.payload || 'Failed to delete CC Builder.');
      }
    } catch (err) {
      setCCBuilderError('Failed to delete CC Builder.');
      console.error('Error:', err);
    }
    setDeleteBuilderDialogOpen(false);
    setDeleteBuilderId(null);
  };

  const handleDeleteItem = async () => {
    setItemSuccess('');
    setItemError('');
    try {
      const resultAction = await dispatch(deleteCCItem(deleteItemId));
      if (deleteCCItem.fulfilled.match(resultAction)) {
        setItemSuccess('Item deleted successfully!');
        setEditItemId(null);
        setItemName('');
        setSelectedCCBuilderId('');
        setSubmenuType('default');
        dispatch({ type: 'ccBuilder/resetCurrentItem' });
        dispatch(fetchCCItems());
      } else {
        setItemError(resultAction.payload || 'Failed to delete item.');
      }
    } catch (err) {
      setItemError('Failed to delete item.');
      console.error('Error:', err);
    }
    setDeleteItemDialogOpen(false);
    setDeleteItemId(null);
  };

  const handleCancelEdit = (type) => {
    if (type === 'builder') {
      setCCBuilderName('');
      setEditBuilderId(null);
      dispatch({ type: 'ccBuilder/resetCurrentBuilder' });
    } else {
      setItemName('');
      setSelectedCCBuilderId('');
      setSubmenuType('default');
      setEditItemId(null);
      dispatch({ type: 'ccBuilder/resetCurrentItem' });
    }
  };

  const openDeleteBuilderDialog = (id) => {
    setDeleteBuilderId(id);
    setDeleteBuilderDialogOpen(true);
  };

  const openDeleteItemDialog = (id) => {
    setDeleteItemId(id);
    setDeleteItemDialogOpen(true);
  };

  if (!userRole || userRole !== 'admin') {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Alert severity="error">
          You do not have permission to access this page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 4, mb: 1 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Manage CC Builders and Items
      </Typography>

      <Grid container spacing={4}>
        {/* CC Builder Section */}
        <Grid item xs={12} md={6}>
          <StyledPaper elevation={3}>
            <Typography variant="h6" gutterBottom>
              Manage CC Builder Categories
            </Typography>
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth disabled={loading.component}>
                <InputLabel>Select CC Builder to Edit or Delete</InputLabel>
                <Select
                  value={editBuilderId || ''}
                  onChange={(e) => handleEditBuilder(e.target.value)}
                  label="Select CC Builder to Edit or Delete"
                >
                  <MenuItem value="">
                    <em>Select a CC Builder</em>
                  </MenuItem>
                  {ccBuilders.length ? (
                    ccBuilders.map((builder) => (
                      <MenuItem key={builder.id} value={builder.id}>
                        {builder.name}
                        <Button
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteBuilderDialog(builder.id);
                          }}
                          sx={{ ml: 2 }}
                        >
                          Delete
                        </Button>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No CC Builders available
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              {editBuilderId ? 'Edit CC Builder' : 'Add New CC Builder'}
            </Typography>
            <form onSubmit={handleCCBuilderSubmit}>
              <TextField
                fullWidth
                label="CC Builder Name"
                value={ccBuilderName}
                onChange={(e) => setCCBuilderName(e.target.value)}
                required
                disabled={loading.component}
                sx={{ mb: 2 }}
                variant="outlined"
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading.component}
                  startIcon={loading.component ? <CircularProgress size={20} /> : null}
                >
                  {loading.component ? 'Processing...' : editBuilderId ? 'Update CC Builder' : 'Add CC Builder'}
                </Button>
                {editBuilderId && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleCancelEdit('builder')}
                    disabled={loading.component}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </form>
            <Fade in={!!ccBuilderSuccess || !!ccBuilderError}>
              <Box sx={{ mt: 2 }}>
                {ccBuilderSuccess && <Alert severity="success">{ccBuilderSuccess}</Alert>}
                {ccBuilderError && <Alert severity="error">{ccBuilderError}</Alert>}
              </Box>
            </Fade>
          </StyledPaper>
        </Grid>

        {/* Item Section */}
        <Grid item xs={12} md={6}>
          <StyledPaper elevation={3}>
            <Typography variant="h6" gutterBottom>
              Update Items of CC Builder
            </Typography>
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth disabled={loading.item}>
                <InputLabel>Select Item to Edit or Delete</InputLabel>
                <Select
                  value={editItemId || ''}
                  onChange={(e) => handleEditItem(e.target.value)}
                  label="Select Item to Edit or Delete"
                >
                  <MenuItem value="">
                    <em>Select an Item</em>
                  </MenuItem>
                  {items.length ? (
                    items.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name} (Builder: {item.ccBuilder?.name || 'Unknown'})
                        <Button
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteItemDialog(item.id);
                          }}
                          sx={{ ml: 2 }}
                        >
                          Delete
                        </Button>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No Items available
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              {editItemId ? 'Edit Item' : 'Add New Item'}
            </Typography>
            <form onSubmit={handleItemSubmit}>
              <FormControl fullWidth sx={{ mb: 2 }} disabled={loading.item || !ccBuilders.length}>
                <InputLabel>Select CC Builder</InputLabel>
                <Select
                  value={selectedCCBuilderId}
                  onChange={(e) => setSelectedCCBuilderId(e.target.value)}
                  required
                  label="Select CC Builder"
                >
                  <MenuItem value="">
                    <em>Select CC Builder</em>
                  </MenuItem>
                  {ccBuilders.length ? (
                    ccBuilders.map((builder) => (
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

              <TextField
                fullWidth
                label="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
                disabled={loading.item}
                sx={{ mb: 2 }}
                variant="outlined"
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  disabled={loading.item}
                  startIcon={loading.item ? <CircularProgress size={20} /> : null}
                >
                  {loading.item ? 'Processing...' : editItemId ? 'Update Item' : 'Add Item'}
                </Button>
                {editItemId && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleCancelEdit('item')}
                    disabled={loading.item}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </form>
            <Fade in={!!itemSuccess || !!itemError}>
              <Box sx={{ mt: 2 }}>
                {itemSuccess && <Alert severity="success">{itemSuccess}</Alert>}
                {itemError && <Alert severity="error">{itemError}</Alert>}
              </Box>
            </Fade>
          </StyledPaper>
        </Grid>
      </Grid>

      {/* Delete CC Builder Confirmation Dialog */}
      <Dialog
        open={deleteBuilderDialogOpen}
        onClose={() => setDeleteBuilderDialogOpen(false)}
        aria-labelledby="delete-builder-dialog-title"
        aria-describedby="delete-builder-dialog-description"
      >
        <DialogTitle id="delete-builder-dialog-title">Confirm Delete CC Builder</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-builder-dialog-description">
            Are you sure you want to delete this CC Builder? This action cannot be undone and may affect associated items.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteBuilderDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteBuilder} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Item Confirmation Dialog */}
      <Dialog
        open={deleteItemDialogOpen}
        onClose={() => setDeleteItemDialogOpen(false)}
        aria-labelledby="delete-item-dialog-title"
        aria-describedby="delete-item-dialog-description"
      >
        <DialogTitle id="delete-item-dialog-title">Confirm Delete Item</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-item-dialog-description">
            Are you sure you want to delete this item? This action cannot be undone and may affect associated item details.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteItemDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteItem} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddCCBuilder;