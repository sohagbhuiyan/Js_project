import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../api';

export const savePrinter = createAsyncThunk(
  'printers/save',
async ({ formDataObject, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      const jsonBlob = new Blob([JSON.stringify(formDataObject.allPrinter)], {
        type: 'application/json'
      });
      formData.append('allPrinter', jsonBlob);
      if (formDataObject.imagea) formData.append('imagea', formDataObject.imagea);
      if (formDataObject.imageb) formData.append('imageb', formDataObject.imageb);
      if (formDataObject.imagec) formData.append('imagec', formDataObject.imagec);

      const response = await axios.post(`${API_BASE_URL}/api/allprinter/save`, formData, {
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

export const fetchAllPrinters = createAsyncThunk(
  'printers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/allPrinter/getall`);
      return response.data.map(printer => ({
        ...printer,
        regularprice: Number(printer.regularprice),
        specialprice: Number(printer.specialprice),
        imagea: printer.imagea ? `${API_BASE_URL}/images/${printer.imagea}` : null,
        imageb: printer.imageb ? `${API_BASE_URL}/images/${printer.imageb}` : null,
        imagec: printer.imagec ? `${API_BASE_URL}/images/${printer.imagec}` : null,
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Fetch single printer by ID
export const fetchPrinterById = createAsyncThunk(
  'printers/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/AllPrinter/${id}`);
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

export const savePrinterOrder = createAsyncThunk(
  'printers/saveOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/printer/order/save`, orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addPrinterToCart = createAsyncThunk(
  'printers/addToCart',
  async (cartData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/printer/AddToCart/save`, cartData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPrintersByCategory = createAsyncThunk(
  'printers/fetchByCategory',
  async ({ catagoryId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/AllPrinter/byCategory/${catagoryId}`);
      return response.data.map(printer => ({
        ...printer,
        regularprice: Number(printer.regularprice),
        specialprice: Number(printer.specialprice),
        imagea: printer.imagea ? `${API_BASE_URL}/images/${printer.imagea}` : null,
        imageb: printer.imageb ? `${API_BASE_URL}/images/${printer.imageb}` : null,
        imagec: printer.imagec ? `${API_BASE_URL}/images/${printer.imagec}` : null,
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// Place Order
export const PrinterPlaceOrder = createAsyncThunk(
  "printers/printerOrder",
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
        printerAllList: orderData.printerAllList,
      };

      console.log("Sending order payload to backend:", orderPayload);

      const response = await axios.post(
        `${API_BASE_URL}/api/printer/order/save`,
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


const printerSlice = createSlice({
  name: 'printers',
  initialState: {
    printers: [],
    currentPrinter: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Save Printer
      .addCase(savePrinter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePrinter.fulfilled, (state, action) => {
        state.loading = false;
        state.printers.push(action.payload);
      })
      .addCase(savePrinter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Printers
      .addCase(fetchAllPrinters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPrinters.fulfilled, (state, action) => {
        state.loading = false;
        state.printers = action.payload;
      })
      .addCase(fetchAllPrinters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Save Order
      .addCase(savePrinterOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePrinterOrder.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update state if order data affects printers
      })
      .addCase(savePrinterOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Cart
      .addCase(addPrinterToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPrinterToCart.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update state if cart data affects printers
      })
      .addCase(addPrinterToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by Category
      .addCase(fetchPrintersByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrintersByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.printers = action.payload;
      })
      .addCase(fetchPrintersByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(PrinterPlaceOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
          })
      .addCase(PrinterPlaceOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.orders.push(action.payload);
      state.userOrders.push(action.payload);
          })
      .addCase(PrinterPlaceOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearError } = printerSlice.actions;
export default printerSlice.reducer;
