import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from './api';

// Async thunk to fetch filtered products
export const fetchFilteredProducts = createAsyncThunk(
  'filter/fetchFilteredProducts',
  async (filters, { rejectWithValue }) => {
    try {



      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.brandname) queryParams.append('brandname', filters.brandname);
      if (filters.productName) queryParams.append('productName', filters.productName);
      if (filters.regularPrice) queryParams.append('regularPrice', filters.regularPrice);
      if (filters.productItemId) queryParams.append('productItemId', filters.productItemId);

      const response = await fetch(
        `${API_BASE_URL}/api/productDetails/filter?${queryParams.toString()}`,
        {
          headers: {

            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch filtered products');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    filteredProducts: [],
    filters: {
      brandname: '',
      productName: '',
      regularPrice: '',
      productItemId: '',
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
        brandname: '',
        productName: '',
        regularPrice: '',
        productItemId: '',
      };
      state.filteredProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredProducts = action.payload;
      })
      .addCase(fetchFilteredProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
