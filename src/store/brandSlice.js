import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { API_BASE_URL } from './api';

export const addBrand = createAsyncThunk(
  'brands/add',
  async ({ brandname, token }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${API_BASE_URL}/api/brands/save`,
        { brandname },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Adding brand failed');
    }
  }
);

export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/api/brands/get/all`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch brands');
    }
  }
);

export const fetchBrandById = createAsyncThunk(
  'brands/fetchBrandById',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/api/brands/get/${id}`); // get brand by id (individual)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch brand');
    }
  }
);

export const fetchProductsByBrand = createAsyncThunk(
  'brands/fetchProductsByBrand',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/api/productDetails/Brand/get/ById/${id}`); // all productdetails show under the brand id select
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products by brand');
    }
  }
);

export const updateBrand = createAsyncThunk(
  'brands/update',
  async ({ id, brandname, token }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `${API_BASE_URL}/api/brands/update/${id}`,
        { brandname },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Updating brand failed');
    }
  }
);

export const deleteBrand = createAsyncThunk(
  'brands/delete',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await api.delete(`${API_BASE_URL}/api/brands/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Deleting brand failed');
    }
  }
);

const brandSlice = createSlice({
  name: 'brands',
  initialState: {
    items: [],
    selectedBrand: null,
    productsByBrand: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedBrand: (state) => {
      state.selectedBrand = null;
    },
    clearProductsByBrand: (state) => {
      state.productsByBrand = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBrandById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrandById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBrand = action.payload;
      })
      .addCase(fetchBrandById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductsByBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.productsByBrand = action.payload;
      })
      .addCase(fetchProductsByBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((brand) => brand._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.selectedBrand = null;
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((brand) => brand._id !== action.payload);
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedBrand, clearProductsByBrand } = brandSlice.actions;
export const brandReducer = brandSlice.reducer;