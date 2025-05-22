import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadHeroImages, clearHeroError, clearHeroSuccess } from '../../../store/heroSlice';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';

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
  const { loading, error, successMessage } = useSelector((state) => state.hero);
  const [formData, setFormData] = useState({
    imagea: null,
    imageb: null,
    imagec: null,
    imaged: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('1st Slider Image', formData.imagea);
    data.append('2nd Slider Image', formData.imageb);
    data.append('Informative Image', formData.imagec);
    data.append('Offered Image', formData.imaged);
    dispatch(uploadHeroImages(data));
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        dispatch(clearHeroSuccess());
      }, 3000); // Clear success message after 3 seconds
    }
  }, [successMessage, dispatch]);

  return (
    <Card
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        p: 2,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: '#ffffff',
        transition: 'transform 0.3s ease',
   
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary"
            sx={{ textAlign: 'center', mb: 2 }}
          >
            Upload Hero Section Slider Images
          </Typography>
        }
        sx={{ pb: 0 }}
      />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {['1st Slider Image', '2nd Slider Image', 'Informative Image', 'Offered Image'].map(
              (name, index) => (
                <Box key={index} sx={{ width: '100%' }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="medium"
                    color="text.primary"
                    gutterBottom
                  >
                    {name}
                  </Typography>
                  <StyledFileInput>
                    <Typography variant="body2" color="text.secondary">
                      {formData[name.toLowerCase().replace(/ /g, '')]
                        ? formData[name.toLowerCase().replace(/ /g, '')].name
                        : 'Choose File'}
                    </Typography>
                    <input
                      type="file"
                      name={name.toLowerCase().replace(/ /g, '')}
                      accept="image/*"
                      onChange={handleChange}
                      required
                    />
                  </StyledFileInput>
                </Box>
              )
            )}
            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              sx={{
                mt: 2,
                py: 1.5,
                width: '100%',
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                color: '#fff',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #2196f3)',
                  boxShadow: 2,
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Upload Images'}
            </Button>
            {error && (
              <Fade in={Boolean(error)}>
                <Alert
                  severity="error"
                  sx={{ mt: 2, borderRadius: 1 }}
                  onClose={() => dispatch(clearHeroError())}
                >
                  {error}
                </Alert>
              </Fade>
            )}
            {successMessage && (
              <Fade in={Boolean(successMessage)}>
                <Alert
                  severity="success"
                  sx={{ mt: 2, borderRadius: 1 }}
                  onClose={() => dispatch(clearHeroSuccess())}
                >
                  {successMessage}
                </Alert>
              </Fade>
            )}
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddSlider;
