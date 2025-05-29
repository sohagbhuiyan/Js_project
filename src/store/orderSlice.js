
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "./api";

// Place Order
export const placeOrder = createAsyncThunk(
  "order/place",
  async (orderData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem("authToken");
      const profile = state.auth.profile;
      const user = state.auth.user;

      if (!token || !profile?.email || !user?.id) {
        return rejectWithValue("User not authenticated. Please log in.");
      }

      const userData = {
        id: user.id,
        name: profile.name || "Guest",
        email: profile.email,
        phoneNo: profile.phoneNo || "Not provided",
      };

      const price = orderData.quantity * (orderData.productDetailsList.specialprice || orderData.productDetailsList.regularprice);

      const orderWithUser = {
        ...orderData,
        user: userData,
        price,
        status: "pending", // Default status for new orders (lowercase to match backend)
      };

      console.log("Sending order payload to backend:", orderWithUser);

      const response = await axios.post(
        `${API_BASE_URL}/api/productdetails/orders/save`,
        orderWithUser,
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

// Cart Order Place 
export const cartOrderPlace = createAsyncThunk(
  "order/cartOrderPlace",
  async (orderData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem("authToken");
      const profile = state.auth.profile;
      const user = state.auth.user;
      const userId = state.auth.profile?.id;

      if (!token || !profile?.email || !user?.id) {
        return rejectWithValue("User not authenticated. Please log in.");
      }

      const cartOrderPayload = {
        districts: orderData.districts,
        upazila: orderData.upazila,
        address: orderData.address,
        items: orderData.items.map((item) => ({
          type: item.type || "ProductDetails", // Default to ProductDetails if type is missing
          quantity: item.quantity,
          productDetailsList: {
            id: item.productId,
            productid: item.productId,
            name: item.name,
            regularprice: item.price,
            specialprice: item.price,
            imagea: item.imagea,
          },
          productid: item.productId,
          productname: item.name,
        })),
        price: orderData.price,
        requestDate: orderData.requestDate,
        status: orderData.status || "pending",
      };

      console.log("Sending cart order payload to backend:", cartOrderPayload);

      const response = await axios.post(
        `${API_BASE_URL}/api/orders/AddToCart/save/${userId}?userId=${userId}`,
        cartOrderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Cart order response from backend:", response.data);

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Cart order failed";
      console.error("Cart order error:", {
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
      });
      return rejectWithValue(errorMessage);
    }
  }
);

// Update Order Status
export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem("authToken");

      if (!token) {
        return rejectWithValue("User not authenticated. Please log in.");
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/orders/updete/${orderId}?actions=${encodeURIComponent(status)}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(`Updated status for order #${orderId} to ${status}:`, response.data);

      return { orderId, status };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update order status";
      console.error("Status update error:", {
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
      });
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch All Orders (for admin, no authentication)
export const fetchOrders = createAsyncThunk(
  "order/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/orders/all`);

      console.log("Fetched all orders:", response.data);

      // Ensure the response includes product name, price, and total
      return response.data.map(order => ({
        ...order,
        productName: order.items?.[0]?.productname || order.productDetailsList?.name || "Unknown Product",
        price: order.price || 0,
        total: order.price || 0, // Assuming total is same as price unless backend provides a separate total
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch orders";
      console.error("Fetch orders error:", error.response?.data);
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch User-Specific Orders by Email (existing, for admin)
export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async ({ email }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem("authToken");
      const role = state.auth.role;

      if (!token) {
        return rejectWithValue("User not authenticated. Please log in.");
      }

      if (role !== "admin") {
        return rejectWithValue("Admin access required.");
      }

      const response = await axios.get(`${API_BASE_URL}/api/orders/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { email },
      });

      console.log("Fetched user orders by email:", response.data);

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch user orders";
      console.error("Fetch user orders error:", error.response?.data);
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch User Orders by User ID (for user view)
export const fetchUserOrdersById = createAsyncThunk(
  "order/fetchUserOrdersById",
  async (userId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem("authToken");

      if (!token) {
        return rejectWithValue("User not authenticated. Please log in.");
      }

      const response = await axios.get(`${API_BASE_URL}/api/Order/getByUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(`Fetched orders for user #${userId}:`, response.data);

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch your orders";
      console.error("Fetch user orders by ID error:", error.response?.data);
      return rejectWithValue(errorMessage);
    }
  }
);

// Order Slice
const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [], // Admin orders
    userOrders: [], // User-specific orders
    loading: false,
    error: null,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.userOrders.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

         // Cart Order
      .addCase(cartOrderPlace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cartOrderPlace.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.userOrders.push(action.payload);
      })
      .addCase(cartOrderPlace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map((order) =>
          order.id === action.payload.orderId ? { ...order, status: action.payload.status } : order
        );
        state.userOrders = state.userOrders.map((order) =>
          order.id === action.payload.orderId ? { ...order, status: action.payload.status } : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserOrdersById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrdersById.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrdersById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError, setOrders } = orderSlice.actions;
export default orderSlice.reducer;
