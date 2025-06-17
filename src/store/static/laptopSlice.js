import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../api';


// Fetch all laptops
export const fetchLaptops = createAsyncThunk(
  'laptops/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/allLaptop/getall`);
      return response.data.map(laptop => ({
        ...laptop,
        regularprice: Number(laptop.regularprice),
        specialprice: Number(laptop.specialprice)
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch single laptop by ID
export const fetchLaptopById = createAsyncThunk(
  'laptops/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/allLaptop/${id}`);
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

// Fetch laptops by category
export const fetchLaptopsByCategory = createAsyncThunk(
  'laptops/fetchByCategory',
  async ({ catagoryId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/allLaptop/byCategory/${catagoryId}`);
      return response.data.map(laptop => ({
        ...laptop,
        regularprice: Number(laptop.regularprice),
        specialprice: Number(laptop.specialprice)
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add new laptop
export const addLaptop = createAsyncThunk(
  'laptops/addLaptop',
  async ({ formDataObject, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      const jsonBlob = new Blob([JSON.stringify(formDataObject.allLaptop)], {
        type: 'application/json'
      });
      formData.append('allLaptop', jsonBlob);
      if (formDataObject.imagea) formData.append('imagea', formDataObject.imagea);
      if (formDataObject.imageb) formData.append('imageb', formDataObject.imageb);
      if (formDataObject.imagec) formData.append('imagec', formDataObject.imagec);

      const response = await axios.post(`${API_BASE_URL}/api/allLaptop/save`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

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

// Place order for laptops
export const LaptopPlaceOrder = createAsyncThunk(
  "laptops/laptopOrder",
  async (orderData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem("authToken");
      const profile = state.auth.profile;
      const user = state.auth.user;

      if (!token || !profile?.email || !user?.id) {
        return rejectWithValue("User not authenticated. Please log in.");
      }

      const orderPayload = {
        user: { id: user.id },
        quantity: orderData.quantity,
        districts: orderData.districts,
        upazila: orderData.upazila,
        address: orderData.address,
        allLaptopList: orderData.allLaptopList,
      };

      const response = await axios.post(`${API_BASE_URL}/api/laptop/order/save`, orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Order failed");
    }
  }
);

const laptopSlice = createSlice({
  name: 'laptops',
  initialState: {
    laptops: [],
    currentLaptop: null,
    loading: false,
    error: null,
    successMessage: null,
    orders: [],
    userOrders: [],
  },
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLaptops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLaptops.fulfilled, (state, action) => {
        state.loading = false;
        state.laptops = action.payload.map(laptop => ({
          ...laptop,
          imagea: laptop.imagea ? `${API_BASE_URL}/images/${laptop.imagea}` : null,
          imageb: laptop.imageb ? `${API_BASE_URL}/images/${laptop.imageb}` : null,
          imagec: laptop.imagec ? `${API_BASE_URL}/images/${laptop.imagec}` : null,
        }));
      })
      .addCase(fetchLaptops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLaptopById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLaptopById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLaptop = {
          ...action.payload,
          imagea: action.payload.imagea ? `${API_BASE_URL}/images/${action.payload.imagea}` : null,
          imageb: action.payload.imageb ? `${API_BASE_URL}/images/${action.payload.imageb}` : null,
          imagec: action.payload.imagec ? `${API_BASE_URL}/images/${action.payload.imagec}` : null,
        };
      })
      .addCase(fetchLaptopById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addLaptop.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.error = null;
      })
      .addCase(addLaptop.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Laptop added successfully';
        state.laptops.push({
          ...action.payload,
          imagea: action.payload.imagea ? `${API_BASE_URL}/images/${action.payload.imagea}` : null,
          imageb: action.payload.imageb ? `${API_BASE_URL}/images/${action.payload.imageb}` : null,
          imagec: action.payload.imagec ? `${API_BASE_URL}/images/${action.payload.imagec}` : null,
        });
      })
      .addCase(addLaptop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLaptopsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLaptopsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.laptops = action.payload.map(laptop => ({
          ...laptop,
          imagea: laptop.imagea ? `${API_BASE_URL}/images/${laptop.imagea}` : null,
          imageb: laptop.imageb ? `${API_BASE_URL}/images/${laptop.imageb}` : null,
          imagec: laptop.imagec ? `${API_BASE_URL}/images/${laptop.imagec}` : null,
        }));
      })
      .addCase(fetchLaptopsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(LaptopPlaceOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LaptopPlaceOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.userOrders.push(action.payload);
      })
      .addCase(LaptopPlaceOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = laptopSlice.actions;
export default laptopSlice.reducer;
