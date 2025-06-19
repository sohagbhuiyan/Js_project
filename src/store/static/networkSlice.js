import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../api';


// Fetch all networks
export const fetchNetworks = createAsyncThunk(
  'networks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/AllNetwork/getall`);
      return response.data.map(network => ({
        ...network,
        regularprice: Number(network.regularprice),
        specialprice: Number(network.specialprice)
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch single network by ID
export const fetchNetworkById = createAsyncThunk(
  'networks/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/AllNetwork/${id}`);
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

// Fetch networks by category
export const fetchNetworksByCategory = createAsyncThunk(
  'networks/fetchByCategory',
  async ({ catagoryId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/AllNetwork/byCategory/${catagoryId}`);
      return response.data.map(network => ({
        ...network,
        regularprice: Number(network.regularprice),
        specialprice: Number(network.specialprice)
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add new network
export const addNetwork = createAsyncThunk(
  'networks/addNetwork',
  async ({ formDataObject, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      const jsonBlob = new Blob([JSON.stringify(formDataObject.allnetwork)], {
        type: 'application/json'
      });
      formData.append('allnetwork', jsonBlob);
      if (formDataObject.imagea) formData.append('imagea', formDataObject.imagea);
      if (formDataObject.imageb) formData.append('imageb', formDataObject.imageb);
      if (formDataObject.imagec) formData.append('imagec', formDataObject.imagec);

      const response = await axios.post(`${API_BASE_URL}/api/allnetwork/save`, formData, {
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

// Place order for networks
export const networkPlaceOrder = createAsyncThunk(
  'networks/networkOrder',
  async (orderData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('authToken');
      const profile = state.auth.profile;
      const user = state.auth.user;

      if (!token || !profile?.email || !user?.id) {
        return rejectWithValue('User not authenticated. Please log in.');
      }

      const orderPayload = {
        user: { id: user.id },
        quantity: orderData.quantity,
        districts: orderData.districts,
        upazila: orderData.upazila,
        address: orderData.address,
        allNetworkList: orderData.allNetworkList,
      };

      const response = await axios.post(`${API_BASE_URL}/api/network/order/save`, orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Order failed');
    }
  }
);

// Add network to cart
export const addNetworkToCart = createAsyncThunk(
  'networks/addToCart',
  async (cartData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('authToken');
      const profile = state.auth.profile;
      const user = state.auth.user;

      if (!token || !profile?.email || !user?.id) {
        return rejectWithValue('User not authenticated. Please log in.');
      }

      const cartPayload = {
        user: { id: user.id },
        networkId: cartData.networkId,
        quantity: cartData.quantity,
      };

      const response = await axios.post(`${API_BASE_URL}/api/network/AddToCart/save`, cartPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add to cart');
    }
  }
);

const networkSlice = createSlice({
  name: 'networks',
  initialState: {
    networks: [],
    currentNetwork: null,
    loading: false,
    error: null,
    successMessage: null,
    orders: [],
    cartItems: [],
  },
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all networks
      .addCase(fetchNetworks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNetworks.fulfilled, (state, action) => {
        state.loading = false;
        state.networks = action.payload.map(network => ({
          ...network,
          imagea: network.imagea ? `${API_BASE_URL}/images/${network.imagea}` : null,
          imageb: network.imageb ? `${API_BASE_URL}/images/${network.imageb}` : null,
          imagec: network.imagec ? `${API_BASE_URL}/images/${network.imagec}` : null,
        }));
      })
      .addCase(fetchNetworks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch network by ID
      .addCase(fetchNetworkById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNetworkById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNetwork = {
          ...action.payload,
          imagea: action.payload.imagea ? `${API_BASE_URL}/images/${action.payload.imagea}` : null,
          imageb: action.payload.imageb ? `${API_BASE_URL}/images/${action.payload.imageb}` : null,
          imagec: action.payload.imagec ? `${API_BASE_URL}/images/${action.payload.imagec}` : null,
        };
      })
      .addCase(fetchNetworkById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch networks by category
      .addCase(fetchNetworksByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNetworksByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.networks = action.payload.map(network => ({
          ...network,
          imagea: network.imagea ? `${API_BASE_URL}/images/${network.imagea}` : null,
          imageb: network.imageb ? `${API_BASE_URL}/images/${network.imageb}` : null,
          imagec: network.imagec ? `${API_BASE_URL}/images/${network.imagec}` : null,
        }));
      })
      .addCase(fetchNetworksByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add network
      .addCase(addNetwork.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.error = null;
      })
      .addCase(addNetwork.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Network added successfully';
        state.networks.push({
          ...action.payload,
          imagea: action.payload.imagea ? `${API_BASE_URL}/images/${action.payload.imagea}` : null,
          imageb: action.payload.imageb ? `${API_BASE_URL}/images/${action.payload.imageb}` : null,
          imagec: action.payload.imagec ? `${API_BASE_URL}/images/${action.payload.imagec}` : null,
        });
      })
      .addCase(addNetwork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Place order
      .addCase(networkPlaceOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(networkPlaceOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(networkPlaceOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addNetworkToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNetworkToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems.push(action.payload);
        state.successMessage = 'Network added to cart successfully';
      })
      .addCase(addNetworkToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = networkSlice.actions;
export default networkSlice.reducer;
