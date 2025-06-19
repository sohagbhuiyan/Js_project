import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../api';

// Fetch all cameras
export const fetchCameras = createAsyncThunk(
  'cameras/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/allcamera/getall`);
      return response.data.map(camera => ({
        ...camera,
        regularprice: Number(camera.regularprice),
        specialprice: Number(camera.specialprice),
        quantity: Number(camera.quantity),
        warranty: Number(camera.warranty)
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch single camera by ID
export const fetchCameraById = createAsyncThunk(
  'cameras/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/AllCamera/${id}`);
      return {
        ...response.data,
        regularprice: Number(response.data.regularprice),
        specialprice: Number(response.data.specialprice),
        quantity: Number(response.data.quantity),
        warranty: Number(response.data.warranty)
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch cameras by product ID
export const fetchCamerasByProductId = createAsyncThunk(
  'cameras/fetchByProductId',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/AllCamera/Product/get/ById/${id}`);
      return response.data.map(camera => ({
        ...camera,
        regularprice: Number(camera.regularprice),
        specialprice: Number(camera.specialprice),
        quantity: Number(camera.quantity),
        warranty: Number(camera.warranty)
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch cameras by category
export const fetchCamerasByCategory = createAsyncThunk(
  'cameras/fetchByCategory',
  async ({ catagoryId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/AllCamera/byCategory/${catagoryId}`);
      return response.data.map(camera => ({
        ...camera,
        regularprice: Number(camera.regularprice),
        specialprice: Number(camera.specialprice),
        quantity: Number(camera.quantity),
        warranty: Number(camera.warranty)
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Filter cameras
export const filterCameras = createAsyncThunk(
  'cameras/filter',
  async (filter, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/allcamera/filter`, filter);
      return response.data.map(camera => ({
        ...camera,
        regularprice: Number(camera.regularprice),
        specialprice: Number(camera.specialprice),
        quantity: Number(camera.quantity),
        warranty: Number(camera.warranty)
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add new camera
export const addCamera = createAsyncThunk(
  'cameras/addCamera',
  async ({ formDataObject, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      const jsonBlob = new Blob([JSON.stringify(formDataObject.allCamera)], {
        type: 'application/json'
      });
      formData.append('allCamera', jsonBlob);
      if (formDataObject.imagea) formData.append('imagea', formDataObject.imagea);
      if (formDataObject.imageb) formData.append('imageb', formDataObject.imageb);
      if (formDataObject.imagec) formData.append('imagec', formDataObject.imagec);

      const response = await axios.post(`${API_BASE_URL}/api/allcamera/save`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        ...response.data,
        regularprice: Number(response.data.regularprice),
        specialprice: Number(response.data.specialprice),
        quantity: Number(response.data.quantity),
        warranty: Number(response.data.warranty)
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Place order for cameras
export const cameraPlaceOrder = createAsyncThunk(
  'cameras/cameraOrder',
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
        allCameraList: orderData.allCameraList,
      };

      const response = await axios.post(`${API_BASE_URL}/api/camera/order/save`, orderPayload, {
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

// Add camera to cart
export const addCameraToCart = createAsyncThunk(
  'cameras/addToCart',
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
        cameraId: cartData.cameraId,
        quantity: cartData.quantity,
      };

      const response = await axios.post(`${API_BASE_URL}/api/camera/AddToCart/save`, cartPayload, {
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

const cameraSlice = createSlice({
  name: 'cameras',
  initialState: {
    cameras: [],
    currentCamera: null,
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
      // Fetch all cameras
      .addCase(fetchCameras.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCameras.fulfilled, (state, action) => {
        state.loading = false;
        state.cameras = action.payload.map(camera => ({
          ...camera,
          imagea: camera.imagea ? `${API_BASE_URL}/images/${camera.imagea}` : null,
          imageb: camera.imageb ? `${API_BASE_URL}/images/${camera.imageb}` : null,
          imagec: camera.imagec ? `${API_BASE_URL}/images/${camera.imagec}` : null,
        }));
      })
      .addCase(fetchCameras.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch camera by ID
      .addCase(fetchCameraById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCameraById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCamera = {
          ...action.payload,
          imagea: action.payload.imagea ? `${API_BASE_URL}/images/${action.payload.imagea}` : null,
          imageb: action.payload.imageb ? `${API_BASE_URL}/images/${action.payload.imageb}` : null,
          imagec: action.payload.imagec ? `${API_BASE_URL}/images/${action.payload.imagec}` : null,
        };
      })
      .addCase(fetchCameraById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch cameras by product ID
      .addCase(fetchCamerasByProductId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCamerasByProductId.fulfilled, (state, action) => {
        state.loading = false;
        state.cameras = action.payload.map(camera => ({
          ...camera,
          imagea: camera.imagea ? `${API_BASE_URL}/images/${camera.imagea}` : null,
          imageb: camera.imageb ? `${API_BASE_URL}/images/${camera.imageb}` : null,
          imagec: camera.imagec ? `${API_BASE_URL}/images/${camera.imagec}` : null,
        }));
      })
      .addCase(fetchCamerasByProductId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch cameras by category
      .addCase(fetchCamerasByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCamerasByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.cameras = action.payload.map(camera => ({
          ...camera,
          imagea: camera.imagea ? `${API_BASE_URL}/images/${camera.imagea}` : null,
          imageb: camera.imageb ? `${API_BASE_URL}/images/${camera.imageb}` : null,
          imagec: camera.imagec ? `${API_BASE_URL}/images/${camera.imagec}` : null,
        }));
      })
      .addCase(fetchCamerasByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Filter cameras
      .addCase(filterCameras.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterCameras.fulfilled, (state, action) => {
        state.loading = false;
        state.cameras = action.payload.map(camera => ({
          ...camera,
          imagea: camera.imagea ? `${API_BASE_URL}/images/${camera.imagea}` : null,
          imageb: camera.imageb ? `${API_BASE_URL}/images/${camera.imageb}` : null,
          imagec: camera.imagec ? `${API_BASE_URL}/images/${camera.imagec}` : null,
        }));
      })
      .addCase(filterCameras.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add camera
      .addCase(addCamera.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.error = null;
      })
      .addCase(addCamera.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Camera added successfully';
        state.cameras.push({
          ...action.payload,
          imagea: action.payload.imagea ? `${API_BASE_URL}/images/${action.payload.imagea}` : null,
          imageb: action.payload.imageb ? `${API_BASE_URL}/images/${action.payload.imageb}` : null,
          imagec: action.payload.imagec ? `${API_BASE_URL}/images/${action.payload.imagec}` : null,
        });
      })
      .addCase(addCamera.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Place order
      .addCase(cameraPlaceOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cameraPlaceOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(cameraPlaceOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addCameraToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCameraToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems.push(action.payload);
        state.successMessage = 'Camera added to cart successfully';
      })
      .addCase(addCameraToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = cameraSlice.actions;
export default cameraSlice.reducer;
