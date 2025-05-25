import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveInfo, fetchInfo, updateInfo, clearInfoError, clearInfoSuccess } from '../../../store/infoSlice';
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
  TextField,
} from '@mui/material';

const AddInfo = ({ serviceId = null }) => {
  const dispatch = useDispatch();
  const { loading, error, successMessage, info } = useSelector((state) => state.info);
  const [formData, setFormData] = useState({
    id: '',
    emi: '',
    support: '',
    payment: '',
    delivery: '',
  });

  // Fetch existing info on mount
  useEffect(() => {
    if (serviceId) {
      dispatch(fetchInfo(serviceId)); // Fetch specific service feature by ID
    } else {
      dispatch(fetchInfo()); // Fetch all and use first item
    }
  }, [dispatch, serviceId]);

  // Populate form with existing info if available
  useEffect(() => {
    if (info) {
      setFormData({
        id: info.id || '',
        emi: info.emi || '',
        support: info.support || '',
        payment: info.payment || '',
        delivery: info.delivery || '',
      });
    }
  }, [info]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearInfoSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      // Update existing service feature
      dispatch(updateInfo({ id: formData.id, infoData: formData }));
    } else {
      // Save new service feature
      dispatch(saveInfo(formData));
    }
  };

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
        '&:hover': {
          transform: 'translateY(-5px)',
        },
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
            {formData.id ? 'Update Service Feature' : 'Add Service Feature'}
          </Typography>
        }
        sx={{ pb: 0 }}
      />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {['emi', 'support', 'payment', 'delivery'].map((field, index) => (
              <TextField
                key={index}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            ))}
            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              sx={{
                mt: 2,
                py: 1.5,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                color: '#fff',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #2196f3)',
                  boxShadow: 2,
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : formData.id ? 'Update Info' : 'Save Info'}
            </Button>
            {error && (
              <Fade in={Boolean(error)}>
                <Alert
                  severity="error"
                  sx={{ mt: 2, borderRadius: 1 }}
                  onClose={() => dispatch(clearInfoError())}
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
                  onClose={() => dispatch(clearInfoSuccess())}
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

export default AddInfo;