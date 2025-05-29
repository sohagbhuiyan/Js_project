import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchHeroImages,
  getHeroImageById,
  uploadHeroImages,
  updateHeroImages,
  deleteHeroImage,
  clearHeroError,
  clearHeroSuccess,
  setSelectedImage,
} from '../../../store/heroSlice';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Fade,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const FALLBACK_IMAGE = '/images/placeholder.png';

// Custom styled file input label
const StyledFileInput = styled('label')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
  '& input': {
    display: 'none',
  },
}));

const AddSlider = () => {
  const dispatch = useDispatch();
  const { images, selectedImage, loading, error, successMessage } = useSelector((state) => state.hero);
  const [formData, setFormData] = useState({
    imagea: null,
    imageb: null,
    imagec: null,
    imaged: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  // Fetch all hero images on component mount
  useEffect(() => {
    dispatch(fetchHeroImages());
  }, [dispatch]);

  // Clear success/error messages after 3 seconds
  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        dispatch(clearHeroSuccess());
        setFormData({ imagea: null, imageb: null, imagec: null, imaged: null });
        setIsEditing(false);
      }, 3000);
    }
  }, [successMessage, dispatch]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
  };

  // Handle form submission for add/update
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    if (formData.imagea) data.append('imagea', formData.imagea);
    if (formData.imageb) data.append('imageb', formData.imageb);
    if (formData.imagec) data.append('imagec', formData.imagec);
    if (formData.imaged) data.append('imaged', formData.imaged);

    if (isEditing && selectedImage?.id) {
      dispatch(updateHeroImages({ id: selectedImage.id, formData: data }));
    } else {
      // Ensure all images are provided for adding
      if (!formData.imagea || !formData.imageb || !formData.imagec || !formData.imaged) {
        dispatch({
          type: 'hero/uploadHeroImages/rejected',
          payload: 'All images are required for adding a new slider.',
        });
        return;
      }
      dispatch(uploadHeroImages(data));
    }
  };

  // Handle edit button click
  const handleEdit = (id) => {
    dispatch(getHeroImageById(id)).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        setIsEditing(true);
        setFormData({
          imagea: null,
          imageb: null,
          imagec: null,
          imaged: null,
        });
      }
    });
  };

  // Handle delete button click
  const handleDelete = (id) => {
    setImageToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (imageToDelete) {
      dispatch(deleteHeroImage(imageToDelete));
      setDeleteDialogOpen(false);
      setImageToDelete(null);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setImageToDelete(null);
  };

  // Cancel editing
  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({ imagea: null, imageb: null, imagec: null, imaged: null });
    dispatch(setSelectedImage(null));
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, px: 2 }}>
      {/* Upload/Update Form */}
      <Card sx={{ mb: 4, p: 2, boxShadow: 3, borderRadius: 2, backgroundColor: '#ffffff' }}>
        <CardHeader
          title={
            <Typography variant="h4" fontWeight="bold" color="primary" sx={{ textAlign: 'center' }}>
              {isEditing ? 'Update Hero Slider Images' : 'Upload Hero Slider Images'}
            </Typography>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gap: 2 }}>
              {['1st Slider Image', '2nd Slider Image', 'Informative Image', 'Offered Image'].map(
                (label, index) => {
                  const fieldName = ['imagea', 'imageb', 'imagec', 'imaged'][index];
                  return (
                    <Box key={index} sx={{ width: '100%' }}>
                      <Typography variant="subtitle1" fontWeight="medium" color="text.primary" gutterBottom>
                        {label}
                      </Typography>
                      <StyledFileInput>
                        <Typography variant="body2" color="text.secondary">
                          {formData[fieldName]
                            ? formData[fieldName].name
                            : isEditing && selectedImage?.[fieldName]
                            ? selectedImage[fieldName].split('/').pop()
                            : 'Choose File'}
                        </Typography>
                        <input
                          type="file"
                          name={fieldName}
                          accept="image/*"
                          onChange={handleChange}
                          required={!isEditing}
                        />
                      </StyledFileInput>
                    </Box>
                  );
                }
              )}
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  variant="contained"
                  sx={{
                    py: 1.5,
                    flex: 1,
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                    '&:hover': { background: 'linear-gradient(45deg, #1565c0, #2196f3)', boxShadow: 2 },
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : isEditing ? 'Update Images' : 'Upload Images'}
                </Button>
                {isEditing && (
                  <Button
                    variant="outlined"
                    onClick={cancelEdit}
                    sx={{ py: 1.5, flex: 1 }}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
              {error && (
                <Fade in={Boolean(error)}>
                  <Alert severity="error" sx={{ mt: 2, borderRadius: 1 }} onClose={() => dispatch(clearHeroError())}>
                    {error}
                  </Alert>
                </Fade>
              )}
              {successMessage && (
                <Fade in={Boolean(successMessage)}>
                  <Alert severity="success" sx={{ mt: 2, borderRadius: 1 }} onClose={() => dispatch(clearHeroSuccess())}>
                    {successMessage}
                  </Alert>
                </Fade>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* List of Hero Images */}
      <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
        Existing Hero Slider Images
      </Typography>
      {images.length === 0 ? (
        <Typography color="text.secondary">No slider images available.</Typography>
      ) : (
        <Grid container spacing={2}>
          {images.map((imageSet) => (
            <Grid item xs={12} sm={6} md={4} key={imageSet.id}>
              <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {['imagea', 'imageb', 'imagec', 'imaged'].map((imgKey, index) => (
                      <Box key={imgKey}>
                        <Typography variant="body2" color="text.primary">
                          {['1st Slider', '2nd Slider', 'Informative', 'Offered'][index]} Image:
                        </Typography>
                        <img
                          src={imageSet[imgKey] || FALLBACK_IMAGE}
                          alt={imgKey}
                          style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 4 }}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                  <IconButton color="primary" onClick={() => handleEdit(imageSet.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(imageSet.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this hero image set? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddSlider;