import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from './api';

// Async thunk to fetch service feature info
export const fetchInfo = createAsyncThunk(
  'info/fetchInfo',
  async (id = null, { rejectWithValue }) => {
    try {
      const url = id
        ? `${API_BASE_URL}/api/ServiceFeature/get/${id}`
        : `${API_BASE_URL}/api/ServiceFeature/get`;
      const response = await axios.get(url);
      return response.data; // Assuming response.data is an object or array
    } catch (error) {
      console.error('Fetch info error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch info');
    }
  }
);

// Async thunk to save service feature info
export const saveInfo = createAsyncThunk(
  'info/saveInfo',
  async (infoData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('authToken');
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }
      const response = await axios.post(`${API_BASE_URL}/api/ServiceFeature/save`, infoData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Save info error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to save info');
    }
  }
);

// Async thunk to update service feature info
export const updateInfo = createAsyncThunk(
  'info/updateInfo',
  async ({ id, infoData }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('authToken');
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }
      const response = await axios.put(`${API_BASE_URL}/api/ServiceFeature/updete/${id}`, infoData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Update info error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to update info');
    }
  }
);

const infoSlice = createSlice({
  name: 'info',
  initialState: {
    info: null, // Store the service feature info (single object)
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearInfoError: (state) => {
      state.error = null;
    },
    clearInfoSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.info = Array.isArray(action.payload) && action.payload.length > 0
          ? action.payload[0]
          : action.payload; // Handle single object or first item of array
      })
      .addCase(fetchInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(saveInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload;
        state.successMessage = 'Info saved successfully!';
      })
      .addCase(saveInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload;
        state.successMessage = 'Info updated successfully!';
      })
      .addCase(updateInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInfoError, clearInfoSuccess } = infoSlice.actions;
export default infoSlice.reducer;