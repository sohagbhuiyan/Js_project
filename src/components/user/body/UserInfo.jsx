import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInfo } from '../../../store/infoSlice';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

const UserInfo = () => {
  const dispatch = useDispatch();
  const { info, loading, error } = useSelector((state) => state.info);

  useEffect(() => {
    if (!info) {
      dispatch(fetchInfo());
    }
  }, [dispatch, info]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={2}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 4 }}>
        {error}
      </Alert>
    );
  }

  if (!info) {
    return (
      <Alert severity="info" sx={{ mb: 4 }}>
        No service feature info available.
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs:'row' },
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: 2,
        backgroundColor: '#c8a071',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>

        <Typography variant="body1">{info.emi}</Typography>
      </Box>
      <Box sx={{ textAlign: 'center' }}>

        <Typography variant="body1">{info.support}</Typography>
      </Box>
      <Box sx={{ textAlign: 'center' }}>

        <Typography variant="body1">{info.payment}</Typography>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
   
        <Typography variant="body1">{info.delivery}</Typography>
      </Box>
    </Box>
  );
};

export default UserInfo;
