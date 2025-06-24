import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import { fetchCartItemsAsync } from '../cartSlice';


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
      const response = await axios.get(`${API_BASE_URL}/api/Desktoppcall/${id}`);
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
// Add this to desktopSlice.js
export const fetchDesktopsByCategory = createAsyncThunk(
  'desktops/fetchByCategory',
  async ({catagoryId}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/DesktopPcAll/byCategory/${catagoryId}`);
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


// Place Order
export const DesktopPlaceOrder = createAsyncThunk(
  "desktops/desktopOrder",
  async (orderData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem("authToken");
      const profile = state.auth.profile;
      const user = state.auth.user;

      if (!token || !profile?.email || !user?.id) {
        return rejectWithValue("User not authenticated. Please log in.");
      }

      // Construct the order payload to match the Postman structure
      const orderPayload = {
        user: {
          id: user.id,
        },
        quantity: orderData.quantity,
        districts: orderData.districts,
        upazila: orderData.upazila,
        address: orderData.address,
        desktopPcAllList: orderData.desktopPcAllList,
      };

      console.log("Sending order payload to backend:", orderPayload);

      const response = await axios.post(
        `${API_BASE_URL}/api/desktoppc/order/save`,
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Order response from backend:", response.data);

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Order failed";
      console.error("Order error:", {
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
      });
      return rejectWithValue(errorMessage);
    }
  }
);

export const desktopAddToCartAsync = createAsyncThunk(
  'desktops/desktopAddToCartAsync',
  async ({ desktopId, quantity, name, price, imagea }, { getState, rejectWithValue, dispatch }) => {
    const state = getState();
    const token = state.auth.token || localStorage.getItem('authToken');
    const userId = state.auth.profile?.id;

    if (!token || !userId) {
      return { desktopId, quantity, name, price, imagea, isGuest: true };
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/desktop/AddToCart/save?userId=${userId}&desktopId=${desktopId}&quantity=${quantity}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('addToCart response:', response.data);
      dispatch(fetchCartItemsAsync());
      return { ...response.data, desktopId, name, price, imagea };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
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
      })
      .addCase(fetchDesktopsByCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchDesktopsByCategory.fulfilled, (state, action) => {
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
    .addCase(fetchDesktopsByCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(DesktopPlaceOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(DesktopPlaceOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.orders.push(action.payload);
      state.userOrders.push(action.payload);
    })
    .addCase(DesktopPlaceOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
  },
});

export const { clearMessages } = desktopSlice.actions;
export default desktopSlice.reducer;