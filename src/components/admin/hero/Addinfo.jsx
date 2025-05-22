import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveInfo, fetchInfo, clearInfoError, clearInfoSuccess } from '../../../store/infoSlice';
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

const AddInfo = () => {
  const dispatch = useDispatch();
  const { loading, error, successMessage, info } = useSelector((state) => state.info);
  const [formData, setFormData] = useState({
    emi: '',
    support: '',
    payment: '',
    delivery: '',
  });

  // Fetch existing info on mount
  useEffect(() => {
    dispatch(fetchInfo());
  }, [dispatch]);

  // Populate form with existing info if available
  useEffect(() => {
    if (info) {
      setFormData({
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
      setTimeout(() => {
        dispatch(clearInfoSuccess());
      }, 3000);
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
    dispatch(saveInfo(formData));
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
           Added Service Feature Info
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
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Save Info'}
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
