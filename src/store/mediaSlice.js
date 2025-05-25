import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from './api';

// Async thunk to save Media (image upload)
export const saveMedia = createAsyncThunk(
  'media/saveMedia',
  async (imageFile, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('authToken');

      if (!token) {
        return rejectWithValue('No authentication token found.');
      }
      if (!imageFile) {
        return rejectWithValue('No image file selected.');
      }

      const formData = new FormData();
      formData.append('image', imageFile); // Backend expects 'image' key

      const response = await axios.post(`${API_BASE_URL}/api/media/save`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data; // Expected: { id, imagea: "filename.png" }
    } catch (error) {
      console.error('Save Media error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to save Media');
    }
  }
);

// Async thunk to fetch all Media entries
export const getAllMedia = createAsyncThunk(
  'media/getAllMedia',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/media/get`);
      return response.data; // Expected: [{ id, imagea: "filename.png" }] or []
    } catch (error) {
      console.error('Fetch Media error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch Media');
    }
  }
);

// Async thunk to fetch Media by ID
export const getMediaById = createAsyncThunk(
  'media/getMediaById',
  async (id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('authToken');
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }
      const response = await axios.get(`${API_BASE_URL}/api/media/getid/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Expected: { id, imagea: "filename.png" }
    } catch (error) {
      console.error('Fetch Media by ID error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch Media');
    }
  }
);

// Async thunk to delete Media
export const deleteMedia = createAsyncThunk(
  'media/deleteMedia',
  async (id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('authToken');
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }
      await axios.delete(`${API_BASE_URL}/api/media/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id; // Return the deleted ID
    } catch (error) {
      console.error('Delete Media error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete Media');
    }
  }
);

const mediaSlice = createSlice({
  name: 'media',
  initialState: {
    mediaEntries: [],
    selectedMedia: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMediaError: (state) => {
      state.error = null;
    },
    clearMediaSuccess: (state) => {
      state.successMessage = null;
    },
    clearSelectedMedia: (state) => {
      state.selectedMedia = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Save Media
      .addCase(saveMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(saveMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.mediaEntries = [action.payload];
        state.successMessage = 'Media saved successfully!';
      })
      .addCase(saveMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Media
      .addCase(getAllMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.mediaEntries = action.payload;
      })
      .addCase(getAllMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Media by ID
      .addCase(getMediaById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMediaById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMedia = action.payload;
        state.mediaEntries = [action.payload];
      })
      .addCase(getMediaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Media
      .addCase(deleteMedia.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
        // Optimistic update
        state.mediaEntries = state.mediaEntries.filter((entry) => entry.id !== action.meta.arg);
      })
      .addCase(deleteMedia.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Media deleted successfully!';
      })
      .addCase(deleteMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.mediaEntries = [];
      });
  },
});

export const { clearMediaError, clearMediaSuccess, clearSelectedMedia } = mediaSlice.actions;
export default mediaSlice.reducer;