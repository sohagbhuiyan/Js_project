import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../api';


// Async thunk to fetch all desktops
export const fetchDesktops = createAsyncThunk(
  'desktops/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Desktoppcall/getall`);
      return response.data.map(desktop => ({
        ...desktop,
        regularprice: Number(desktop.regularprice),
        specialprice: Number(desktop.specialprice)
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch single desktop by ID
export const fetchDesktopById = createAsyncThunk(
  'desktops/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return {
        ...response.data,
        regularprice: Number(response.data.regularprice),
        specialprice: Number(response.data.specialprice)
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to add desktop
export const addDesktop = createAsyncThunk(
  'desktops/addDesktop',
  async ({ formDataObject, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      const jsonBlob = new Blob(
        [JSON.stringify(formDataObject.desktoppcall)],
        { type: 'application/json' }
      );
      formData.append('desktoppcall', jsonBlob);
      
      if (formDataObject.imagea) formData.append('imagea', formDataObject.imagea);
      if (formDataObject.imageb) formData.append('imageb', formDataObject.imageb);
      if (formDataObject.imagec) formData.append('imagec', formDataObject.imagec);

      const response = await axios.post(
        `${API_BASE_URL}/api/desktoppcall/save`,
        formData,
        { 
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          } 
        }
      );
      return { 
        ...response.data,
        regularprice: Number(response.data.regularprice),
        specialprice: Number(response.data.specialprice)
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const desktopSlice = createSlice({
  name: 'desktops',
  initialState: {
    desktops: [],
    currentDesktop: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Desktops
      .addCase(fetchDesktops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesktops.fulfilled, (state, action) => {
        state.loading = false;
        state.desktops = action.payload.map(desktop => ({
          ...desktop,
          imagea: desktop.imagea ? `${API_BASE_URL}/images/${desktop.imagea}` : null,
          imageb: desktop.imageb ? `${API_BASE_URL}/images/${desktop.imageb}` : null,
          imagec: desktop.imagec ? `${API_BASE_URL}/images/${desktop.imagec}` : null,
          regularprice: Number(desktop.regularprice),
          specialprice: Number(desktop.specialprice)
        }));
      })
      .addCase(fetchDesktops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Desktop by ID
      .addCase(fetchDesktopById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesktopById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDesktop = {
          ...action.payload,
          imagea: action.payload.imagea ? `${API_BASE_URL}/images/${action.payload.imagea}` : null,
          imageb: action.payload.imageb ? `${API_BASE_URL}/images/${action.payload.imageb}` : null,
          imagec: action.payload.imagec ? `${API_BASE_URL}/images/${action.payload.imagec}` : null,
        };
      })
      .addCase(fetchDesktopById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Desktop
      .addCase(addDesktop.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addDesktop.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Desktop added successfully';
        state.desktops.push({
          ...action.payload,
          imagea: action.payload.imagea ? `${API_BASE_URL}/images/${action.payload.imagea}` : null,
          imageb: action.payload.imageb ? `${API_BASE_URL}/images/${action.payload.imageb}` : null,
          imagec: action.payload.imagec ? `${API_BASE_URL}/images/${action.payload.imagec}` : null,
        });
      })
      .addCase(addDesktop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = desktopSlice.actions;
export default desktopSlice.reducer;