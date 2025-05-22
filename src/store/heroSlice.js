import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from './api';

// Async thunk to fetch hero images by ID
export const getHeroImageById = createAsyncThunk(
  'hero/getHeroImageById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/HomePageImage/get/${id}`);
      const image = response.data;
      return {
        ...image,
        imagea: image.imagea ? `${API_BASE_URL}/images/${image.imagea}` : null,
        imageb: image.imageb ? `${API_BASE_URL}/images/${image.imageb}` : null,
        imagec: image.imagec ? `${API_BASE_URL}/images/${image.imagec}` : null,
        imaged: image.imaged ? `${API_BASE_URL}/images/${image.imaged}` : null,
      };
    } catch (error) {
      console.error('Fetch hero image by ID error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch hero image');
    }
  }
);

// Async thunk to fetch all hero images
export const fetchHeroImages = createAsyncThunk(
  'hero/fetchHeroImages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/HomePageImage/getall`);
      const images = response.data;
      return images.map((image) => ({
        ...image,
        imagea: image.imagea ? `${API_BASE_URL}/images/${image.imagea}` : null,
        imageb: image.imageb ? `${API_BASE_URL}/images/${image.imageb}` : null,
        imagec: image.imagec ? `${API_BASE_URL}/images/${image.imagec}` : null,
        imaged: image.imaged ? `${API_BASE_URL}/images/${image.imaged}` : null,
      }));
    } catch (error) {
      console.error('Fetch hero images error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch hero images');
    }
  }
);

// Async thunk to upload hero images
export const uploadHeroImages = createAsyncThunk(
  'hero/uploadHeroImages',
  async (formData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('authToken');
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }
      const response = await axios.post(`${API_BASE_URL}/api/HomePageImage/save`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return {
        ...response.data,
        imagea: response.data.imagea ? `${API_BASE_URL}/images/${response.data.imagea}` : null,
        imageb: response.data.imageb ? `${API_BASE_URL}/images/${response.data.imageb}` : null,
        imagec: response.data.imagec ? `${API_BASE_URL}/images/${response.data.imagec}` : null,
        imaged: response.data.imaged ? `${API_BASE_URL}/images/${response.data.imaged}` : null,
      };
    } catch (error) {
      console.error('Upload hero images error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to upload hero images');
    }
  }
);

// Async thunk to update hero images
export const updateHeroImages = createAsyncThunk(
  'hero/updateHeroImages',
  async ({ id, formData }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('authToken');
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }
      const response = await axios.put(`${API_BASE_URL}/api/HomePageImage/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return {
        ...response.data,
        imagea: response.data.imagea ? `${API_BASE_URL}/images/${response.data.imagea}` : null,
        imageb: response.data.imageb ? `${API_BASE_URL}/images/${response.data.imageb}` : null,
        imagec: response.data.imagec ? `${API_BASE_URL}/images/${response.data.imagec}` : null,
        imaged: response.data.imaged ? `${API_BASE_URL}/images/${response.data.imaged}` : null,
      };
    } catch (error) {
      console.error('Update hero images error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to update hero images');
    }
  }
);

// Async thunk to delete hero image
export const deleteHeroImage = createAsyncThunk(
  'hero/deleteHeroImage',
  async (id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('authToken');
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }
      await axios.delete(`${API_BASE_URL}/api/HomePageImage/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      console.error('Delete hero image error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete hero image');
    }
  }
);

const heroSlice = createSlice({
  name: 'hero',
  initialState: {
    images: [], // Array to store multiple image sets
    selectedImage: null, // Store the currently selected image set for editing
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearHeroError: (state) => {
      state.error = null;
    },
    clearHeroSuccess: (state) => {
      state.successMessage = null;
    },
    setSelectedImage: (state, action) => {
      state.selectedImage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeroImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(fetchHeroImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getHeroImageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHeroImageById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedImage = action.payload;
      })
      .addCase(getHeroImageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadHeroImages.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(uploadHeroImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images.push(action.payload);
        state.successMessage = 'Images uploaded successfully!';
      })
      .addCase(uploadHeroImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateHeroImages.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateHeroImages.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.images.findIndex((img) => img.id === action.payload.id);
        if (index !== -1) {
          state.images[index] = action.payload;
        }
        state.selectedImage = action.payload;
        state.successMessage = 'Images updated successfully!';
      })
      .addCase(updateHeroImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteHeroImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteHeroImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images = state.images.filter((img) => img.id !== action.payload);
        state.selectedImage = null;
        state.successMessage = 'Image set deleted successfully!';
      })
      .addCase(deleteHeroImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearHeroError, clearHeroSuccess, setSelectedImage } = heroSlice.actions;
export default heroSlice.reducer;
