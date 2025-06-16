import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../api';

// API base URL for desktop filtering


// Async thunk to fetch filtered desktops
export const fetchFilteredDesktops = createAsyncThunk(
  'allfilter/fetchFilteredDesktops',
  async (filters, {rejectWithValue }) => {
    try {

      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.processorbrand) queryParams.append('processorbrand', filters.processorbrand);
      if (filters.generation) queryParams.append('generation', filters.generation);
      if (filters.processortype) queryParams.append('processortype', filters.processortype);
      if (filters.warranty) queryParams.append('warranty', filters.warranty);
      if (filters.displaysizerange) queryParams.append('displaysizerange', filters.displaysizerange);
      if (filters.ram) queryParams.append('ram', filters.ram);
      if (filters.graphicsmemory) queryParams.append('graphicsmemory', filters.graphicsmemory);
      if (filters.operatingsystem) queryParams.append('operatingsystem', filters.operatingsystem);
      if (filters.color) queryParams.append('color', filters.color);
      if (filters.brandName) queryParams.append('brandName', filters.brandName);

      const response = await fetch(
        `${API_BASE_URL}/api/desktoppcall/filter?${queryParams.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch filtered desktops');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const allfilterSlice = createSlice({
  name: 'allfilter',
  initialState: {
    filteredDesktops: [],
    filters: {
      processorbrand: '',
      generation: '',
      processortype: '',
      warranty: '',
      displaysizerange: '',
      ram: '',
      graphicsmemory: '',
      operatingsystem: '',
      color: '',
      brandName: '',
    },
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        processorbrand: '',
        generation: '',
        processortype: '',
        warranty: '',
        displaysizerange: '',
        ram: '',
        graphicsmemory: '',
        operatingsystem: '',
        color: '',
        brandName: '',

      };
      state.filteredDesktops = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredDesktops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredDesktops.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredDesktops = action.payload;
      })
      .addCase(fetchFilteredDesktops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, resetFilters } = allfilterSlice.actions;
export default allfilterSlice.reducer;
