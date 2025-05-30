
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { API_BASE_URL } from "./api";

// // Utility to get auth token
// const getAuthToken = (state) => state.auth.token || localStorage.getItem("authToken");

// // Async thunk to fetch all CC components (builders)
// export const fetchCCComponents = createAsyncThunk(
//   "ccBuilder/fetchCCComponents",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/ccbuilder/get`);
//       const components = response.data;
//       if (!Array.isArray(components)) {
//         return rejectWithValue("Invalid response: Components data is not an array.");
//       }
//       return components;
//     } catch (error) {
//       console.error("Fetch CC components error:", error.response?.data);
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch CC components");
//     }
//   }
// );

// // Async thunk to fetch CC builder by ID
// export const fetchCCBuilderById = createAsyncThunk(
//   "ccBuilder/fetchCCBuilderById",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/ccbuilder/get/${id}`);
//       const builder = response.data;
//       if (!builder || typeof builder !== "object") {
//         return rejectWithValue("Invalid response: Builder data is not valid.");
//       }
//       return builder;
//     } catch (error) {
//       console.error("Fetch CC builder by ID error:", error.response?.data);
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch CC builder");
//     }
//   }
// );

// // Async thunk to fetch all CC items
// export const fetchCCItems = createAsyncThunk(
//   "ccBuilder/fetchCCItems",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/items/get`);
//       const items = response.data;
//       if (!Array.isArray(items)) {
//         return rejectWithValue("Invalid response: Items data is not an array.");
//       }
//       return items;
//     } catch (error) {
//       console.error("Fetch CC items error:", error.response?.data);
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch CC items");
//     }
//   }
// );

// // Async thunk to fetch single CC item by ID
// export const fetchCCItemById = createAsyncThunk(
//   "ccBuilder/fetchCCItemById",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/items/get/${id}`);
//       const item = response.data;
//       if (!item || typeof item !== "object") {
//         return rejectWithValue("Invalid response: Item data is not valid.");
//       }
//       return item;
//     } catch (error) {
//       console.error("Fetch CC item by ID error:", error.response?.data);
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch CC item");
//     }
//   }
// );

// // Async thunk to fetch all CC item details
// export const fetchAllCCItemDetails = createAsyncThunk(
//   "ccBuilder/fetchAllCCItemDetails",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/CCBuilder/Item/Ditels/get`);
//       const itemDetails = response.data;
//       if (!Array.isArray(itemDetails)) {
//         return rejectWithValue("Invalid response: Item details data is not an array.");
//       }
//       return itemDetails.map((item) => ({
//         ...item,
//         imagea: item.imagea || null,
//       }));
//     } catch (error) {
//       console.error("Fetch all CC item details error:", error.response?.data);
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch all CC item details"
//       );
//     }
//   }
// );

// // Async thunk to fetch single CC item details by ID
// export const fetchCCItemDetailsById = createAsyncThunk(
//   "ccBuilder/fetchCCItemDetailsById",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/CCBuilder/Item/Ditels/get/${id}`);
//       const itemDetail = response.data;
//       if (!itemDetail || typeof itemDetail !== "object") {
//         return rejectWithValue("Invalid response: Item detail data is not valid.");
//       }
//       return { ...itemDetail, imagea: itemDetail.imagea || null };
//     } catch (error) {
//       console.error("Fetch CC item details by ID error:", error.response?.data);
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch CC item details"
//       );
//     }
//   }
// );

// // Fetch CC item details by ccBuilderId
// export const fetchCCItemDetailsByBuilderId = createAsyncThunk(
//   "ccBuilder/fetchCCItemDetailsByBuilderId",
//   async (ccBuilderId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/api/CCBuilder/Ditels/ccBuilder/get/ById/${ccBuilderId}`
//       );
//       const itemDetails = response.data;
//       if (!Array.isArray(itemDetails)) {
//         return rejectWithValue("Invalid response: Item details data is not an array.");
//       }
//       return itemDetails.map((item) => ({
//         ...item,
//         imagea: item.imagea || null,
//       }));
//     } catch (error) {
//       console.error("Fetch CC item details by builder ID error:", error.response?.data);
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch CC item details by builder ID"
//       );
//     }
//   }
// );

// // Fetch CC item details by itemId
// export const fetchCCItemDetailsByItemId = createAsyncThunk(
//   "ccBuilder/fetchCCItemDetailsByItemId",
//   async (itemId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/api/CCBuilder/Ditels/itemId/Idby/get/${itemId}`
//       );
//       const itemDetails = response.data;
//       if (!Array.isArray(itemDetails)) {
//         return rejectWithValue("Invalid response: Item details data is not an array.");
//       }
//       return itemDetails.map((item) => ({
//         ...item,
//         imagea: item.imagea || null,
//       }));
//     } catch (error) {
//       console.error("Fetch CC item details by item ID error:", error.response?.data);
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch CC item details by item ID"
//       );
//     }
//   }
// );

// // Async thunk to add a CC component (builder)
// export const addCCComponent = createAsyncThunk(
//   "ccBuilder/addCCComponent",
//   async ({ name }, { rejectWithValue, getState }) => {
//     try {
//       const token = getAuthToken(getState());
//       if (!token) return rejectWithValue("No authentication token found.");

//       const response = await axios.post(
//         `${API_BASE_URL}/api/ccbuilder/save`,
//         { name },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Add CC component error:", error.response?.data);
//       return rejectWithValue(error.response?.data?.message || "Failed to add CC component");
//     }
//   }
// );

// // Async thunk to update a CC component (builder)
// export const updateCCBuilder = createAsyncThunk(
//   "ccBuilder/updateCCBuilder",
//   async ({ id, name }, { rejectWithValue, getState }) => {
//     try {
//       const token = getAuthToken(getState());
//       if (!token) return rejectWithValue("No authentication token found.");

//       const response = await axios.put(
//         `${API_BASE_URL}/api/ccbuilder/updete/data/${id}`,
//         { name },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Update CC builder error:", error.response?.data);
//       return rejectWithValue(error.response?.data?.message || "Failed to update CC builder");
//     }
//   }
// );

// // Async thunk to add a CC item (product) under a CC builder
// export const addCCItem = createAsyncThunk(
//   "ccBuilder/addCCItem",
//   async ({ name, ccBuilderId }, { rejectWithValue, getState }) => {
//     try {
//       const token = getAuthToken(getState());
//       if (!token) return rejectWithValue("No authentication token found.");

//       const components = getState().ccBuilder.components;
//       const selectedBuilder = components.find((builder) => String(builder.id) === String(ccBuilderId));
//       if (!selectedBuilder) {
//         return rejectWithValue("Selected CC builder not found.");
//       }

//       const itemData = {
//         name,
//         ccBuilder: {
//           id: selectedBuilder.id,
//           name: selectedBuilder.name,
//         },
//       };

//       const response = await axios.post(`${API_BASE_URL}/api/items/save`, itemData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Add CC item error:", error.response?.data);
//       return rejectWithValue(error.response?.data?.message || "Failed to add CC item");
//     }
//   }
// );

// // Async thunk to update a CC item
// export const updateCCItem = createAsyncThunk(
//   "ccBuilder/updateCCItem",
//   async ({ id, name, ccBuilderId }, { rejectWithValue, getState }) => {
//     try {
//       const token = getAuthToken(getState());
//       if (!token) return rejectWithValue("No authentication token found.");

//       const components = getState().ccBuilder.components;
//       const selectedBuilder = components.find((builder) => String(builder.id) === String(ccBuilderId));
//       if (!selectedBuilder) {
//         return rejectWithValue("Selected CC builder not found.");
//       }

//       const itemData = {
//         name,
//         ccBuilder: {
//           id: selectedBuilder.id,
//           name: selectedBuilder.name,
//         },
//       };

//       const response = await axios.put(`${API_BASE_URL}/api/items/update/${id}`, itemData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Update CC item error:", error.response?.data);
//       return rejectWithValue(error.response?.data?.message || "Failed to update CC item");
//     }
//   }
// );

// // Async thunk to add CC item details
// export const addCCItemDetails = createAsyncThunk(
//   "ccBuilder/addCCItemDetails",
//   async (
//     {
//       name,
//       description,
//       performance,
//       ability,
//       regularprice,
//       warranty,
//       benefits,
//       moralqualities,
//       opportunity,
//       specialprice,
//       quantity,
//       itemId,
//       ccBuilderId,
//       imagea,
//     },
//     { rejectWithValue, getState }
//   ) => {
//     try {
//       const token = getAuthToken(getState());
//       if (!token) return rejectWithValue("No authentication token found.");

//       const components = getState().ccBuilder.components;
//       const selectedBuilder = components.find(
//         (builder) => String(builder.id) === String(ccBuilderId)
//       );
//       if (!selectedBuilder) return rejectWithValue("Selected CC builder not found.");

//       let selectedItem = null;
//       if (itemId) {
//         const items = getState().ccBuilder.items;
//         selectedItem = items.find((item) => String(item.id) === String(itemId));
//         if (!selectedItem) return rejectWithValue("Selected item not found.");
//       }

//       const formData = new FormData();
//       const payload = {
//         name,
//         description,
//         performance,
//         ability,
//         regularprice: parseFloat(regularprice),
//         warranty: parseInt(warranty) || 0,
//         benefits,
//         moralqualities,
//         opportunity,
//         specialprice: parseFloat(specialprice),
//         quantity: parseInt(quantity),
//         ccBuilder: { id: parseInt(ccBuilderId) },
//       };
//       if (itemId && selectedItem) {
//         payload.item = { id: parseInt(itemId) };
//       }
//       formData.append("ccbuilder", new Blob([JSON.stringify(payload)], { type: "application/json" }));
//       if (imagea) formData.append("image", imagea);

//       const response = await axios.post(
//         `${API_BASE_URL}/api/CCBuilder/Item/Ditels/save`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Add CC item details error:", error.response?.data);
//       return rejectWithValue(error.response?.data?.message || "Failed to add CC item details");
//     }
//   }
// );

// // Async thunk to add a CC item to the cart
// export const addCCItemToCartAsync = createAsyncThunk(
//   "ccBuilder/addCCItemToCartAsync",
//   async ({ CCItemBulderId, quantity, name, price, imagea }, { getState, rejectWithValue }) => {
//     const state = getState();
//     const token = state.auth.token || localStorage.getItem("authToken");
//     const profile = state.auth.profile;
//     const userId = profile?.id;

//     if (!token || !profile?.email || !userId) {
//       return { CCItemBulderId, quantity, name, price, imagea, isGuest: true };
//     }

//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/api/CCItemBuilder/AddToCart/save?userId=${userId}&CCItemBulderId=${CCItemBulderId}&quantity=${quantity}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return { ...response.data, name, price, imagea };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to add CC item to cart");
//     }
//   }
// );
// // Async thunk to place a CC Builder order
// export const placeCCPartOrder = createAsyncThunk(
//   "ccBuilder/placeCCPartOrder",
//   async (orderData, { rejectWithValue, getState }) => {
//     try {
//       const state = getState();
//       const token = state.auth.token || localStorage.getItem("authToken");
//       if (!token) return rejectWithValue("No authentication token found.");

//       const response = await axios.post(`${API_BASE_URL}/api/ccitem/Bulder/orders/save`, orderData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Place CC part order error:", error.response?.data);
//       return rejectWithValue(error.response?.data?.message || "Failed to place CC part order");
//     }
//   }
// );

// const ccbuilderSlice = createSlice({
//   name: "ccBuilder",
//   initialState: {
//     components: [],
//     items: [],
//     itemDetails: [],
//     currentItemDetails: null,
//     currentBuilder: null,
//     currentItem: null,
//     loading: { component: false, item: false, itemDetails: false },
//     error: { component: null, item: null, itemDetails: null },
//     successMessage: { component: null, item: null, itemDetails: null },
//   },
//   reducers: {
//     clearCCBError: (state) => {
//       state.error.component = null;
//       state.error.item = null;
//       state.error.itemDetails = null;
//     },
//     clearCCBSuccess: (state) => {
//       state.successMessage.component = null;
//       state.successMessage.item = null;
//       state.successMessage.itemDetails = null;
//     },
//     resetCurrentItemDetails: (state) => {
//       state.currentItemDetails = null;
//     },
//     resetCurrentBuilder: (state) => {
//       state.currentBuilder = null;
//     },
//     resetCurrentItem: (state) => {
//       state.currentItem = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch CC Components
//       .addCase(fetchCCComponents.pending, (state) => {
//         state.loading.component = true;
//         state.error.component = null;
//       })
//       .addCase(fetchCCComponents.fulfilled, (state, action) => {
//         state.loading.component = false;
//         state.components = action.payload;
//       })
//       .addCase(fetchCCComponents.rejected, (state, action) => {
//         state.loading.component = false;
//         state.error.component = action.payload;
//       })
//       // Fetch CC Builder by ID
//       .addCase(fetchCCBuilderById.pending, (state) => {
//         state.loading.component = true;
//         state.error.component = null;
//         state.currentBuilder = null;
//       })
//       .addCase(fetchCCBuilderById.fulfilled, (state, action) => {
//         state.loading.component = false;
//         state.currentBuilder = action.payload;
//       })
//       .addCase(fetchCCBuilderById.rejected, (state, action) => {
//         state.loading.component = false;
//         state.error.component = action.payload;
//       })
//       // Fetch All CC Items
//       .addCase(fetchCCItems.pending, (state) => {
//         state.loading.item = true;
//         state.error.item = null;
//       })
//       .addCase(fetchCCItems.fulfilled, (state, action) => {
//         state.loading.item = false;
//         state.items = action.payload;
//       })
//       .addCase(fetchCCItems.rejected, (state, action) => {
//         state.loading.item = false;
//         state.error.item = action.payload;
//       })
//       // Fetch CC Item by ID
//       .addCase(fetchCCItemById.pending, (state) => {
//         state.loading.item = true;
//         state.error.item = null;
//         state.currentItem = null;
//       })
//       .addCase(fetchCCItemById.fulfilled, (state, action) => {
//         state.loading.item = false;
//         state.currentItem = action.payload;
//       })
//       .addCase(fetchCCItemById.rejected, (state, action) => {
//         state.loading.item = false;
//         state.error.item = action.payload;
//       })
//       // Fetch All CC Item Details
//       .addCase(fetchAllCCItemDetails.pending, (state) => {
//         state.loading.itemDetails = true;
//         state.error.itemDetails = null;
//       })
//       .addCase(fetchAllCCItemDetails.fulfilled, (state, action) => {
//         state.loading.itemDetails = false;
//         state.itemDetails = action.payload;
//       })
//       .addCase(fetchAllCCItemDetails.rejected, (state, action) => {
//         state.loading.itemDetails = false;
//         state.error.itemDetails = action.payload;
//       })
//       // Fetch CC Item Details by ID
//       .addCase(fetchCCItemDetailsById.pending, (state) => {
//         state.loading.itemDetails = true;
//         state.error.itemDetails = null;
//         state.currentItemDetails = null;
//       })
//       .addCase(fetchCCItemDetailsById.fulfilled, (state, action) => {
//         state.loading.itemDetails = false;
//         state.currentItemDetails = action.payload;
//       })
//       .addCase(fetchCCItemDetailsById.rejected, (state, action) => {
//         state.loading.itemDetails = false;
//         state.error.itemDetails = action.payload;
//       })
//       // Fetch CC Item Details by Builder ID
//       .addCase(fetchCCItemDetailsByBuilderId.pending, (state) => {
//         state.loading.itemDetails = true;
//         state.error.itemDetails = null;
//       })
//       .addCase(fetchCCItemDetailsByBuilderId.fulfilled, (state, action) => {
//         state.loading.itemDetails = false;
//         state.itemDetails = action.payload;
//       })
//       .addCase(fetchCCItemDetailsByBuilderId.rejected, (state, action) => {
//         state.loading.itemDetails = false;
//         state.error.itemDetails = action.payload;
//       })
//       // Fetch CC Item Details by Item ID
//       .addCase(fetchCCItemDetailsByItemId.pending, (state) => {
//         state.loading.itemDetails = true;
//         state.error.itemDetails = null;
//       })
//       .addCase(fetchCCItemDetailsByItemId.fulfilled, (state, action) => {
//         state.loading.itemDetails = false;
//         state.itemDetails = action.payload;
//       })
//       .addCase(fetchCCItemDetailsByItemId.rejected, (state, action) => {
//         state.loading.itemDetails = false;
//         state.error.itemDetails = action.payload;
//       })
//       // Add CC Component
//       .addCase(addCCComponent.pending, (state) => {
//         state.loading.component = true;
//         state.error.component = null;
//         state.successMessage.component = null;
//       })
//       .addCase(addCCComponent.fulfilled, (state, action) => {
//         state.loading.component = false;
//         state.components.push(action.payload);
//         state.successMessage.component = "CC component added successfully!";
//       })
//       .addCase(addCCComponent.rejected, (state, action) => {
//         state.loading.component = false;
//         state.error.component = action.payload;
//       })
//       // Update CC Builder
//       .addCase(updateCCBuilder.pending, (state) => {
//         state.loading.component = true;
//         state.error.component = null;
//         state.successMessage.component = null;
//       })
//       .addCase(updateCCBuilder.fulfilled, (state, action) => {
//         state.loading.component = false;
//         state.components = state.components.map((builder) =>
//           builder.id === action.payload.id ? action.payload : builder
//         );
//         state.currentBuilder = null;
//         state.successMessage.component = "CC builder updated successfully!";
//       })
//       .addCase(updateCCBuilder.rejected, (state, action) => {
//         state.loading.component = false;
//         state.error.component = action.payload;
//       })
//       // Add CC Item
//       .addCase(addCCItem.pending, (state) => {
//         state.loading.item = true;
//         state.error.item = null;
//         state.successMessage.item = null;
//       })
//       .addCase(addCCItem.fulfilled, (state, action) => {
//         state.loading.item = false;
//         state.items.push(action.payload);
//         state.successMessage.item = "CC item added successfully!";
//       })
//       .addCase(addCCItem.rejected, (state, action) => {
//         state.loading.item = false;
//         state.error.item = action.payload;
//       })
//       // Update CC Item
//       .addCase(updateCCItem.pending, (state) => {
//         state.loading.item = true;
//         state.error.item = null;
//         state.successMessage.item = null;
//       })
//       .addCase(updateCCItem.fulfilled, (state, action) => {
//         state.loading.item = false;
//         state.items = state.items.map((item) =>
//           item.id === action.payload.id ? action.payload : item
//         );
//         state.currentItem = null;
//         state.successMessage.item = "CC item updated successfully!";
//       })
//       .addCase(updateCCItem.rejected, (state, action) => {
//         state.loading.item = false;
//         state.error.item = action.payload;
//       })
//       // Add CC Item Details
//       .addCase(addCCItemDetails.pending, (state) => {
//         state.loading.itemDetails = true;
//         state.error.itemDetails = null;
//         state.successMessage.itemDetails = null;
//       })
//       .addCase(addCCItemDetails.fulfilled, (state, action) => {
//         state.loading.itemDetails = false;
//         state.itemDetails.push(action.payload);
//         state.successMessage.itemDetails = "CC item details added successfully!";
//       })
//       .addCase(addCCItemDetails.rejected, (state, action) => {
//         state.loading.itemDetails = false;
//         state.error.itemDetails = action.payload;
//       })
//       // Add CC Item to Cart
//       .addCase(addCCItemToCartAsync.pending, (state) => {
//         state.loading.cart = true;
//         state.error.cart = null;
//         state.successMessage.cart = null;
//       })
//       .addCase(addCCItemToCartAsync.fulfilled, (state, ) => {
//         state.loading.cart = false;
//         state.successMessage.cart = "CC item added to cart successfully!";
//       })
//       .addCase(addCCItemToCartAsync.rejected, (state, action) => {
//         state.loading.cart = false;
//         state.error.cart = action.payload;
//       }) // Place CC Part Order
//       .addCase(placeCCPartOrder.pending, (state) => {
//         state.loading.order = true;
//         state.error.order = null;
//         state.successMessage.order = null;
//       })
//       .addCase(placeCCPartOrder.fulfilled, (state, action) => {
//         state.loading.order = false;
//         state.successMessage.order = "CC part order placed successfully!";
//       })
//       .addCase(placeCCPartOrder.rejected, (state, action) => {
//         state.loading.order = false;
//         state.error.order = action.payload;
//       });
//   },
// });

// export const {
//   clearCCBError,
//   clearCCBSuccess,
//   resetCurrentItemDetails,
//   resetCurrentBuilder,
//   resetCurrentItem,
// } = ccbuilderSlice.actions;
// export default ccbuilderSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "./api";

// Utility to get auth token
const getAuthToken = (state) => state.auth.token || localStorage.getItem("authToken");

// Async thunk to fetch all CC components (builders)
export const fetchCCComponents = createAsyncThunk(
  "ccBuilder/fetchCCComponents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/ccbuilder/get`);
      const components = response.data;
      if (!Array.isArray(components)) {
        return rejectWithValue("Invalid response: Components data is not an array.");
      }
      return components;
    } catch (error) {
      console.error("Fetch CC components error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch CC components");
    }
  }
);

// Async thunk to fetch CC builder by ID
export const fetchCCBuilderById = createAsyncThunk(
  "ccBuilder/fetchCCBuilderById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/ccbuilder/get/${id}`);
      const builder = response.data;
      if (!builder || typeof builder !== "object") {
        return rejectWithValue("Invalid response: Builder data is not valid.");
      }
      return builder;
    } catch (error) {
      console.error("Fetch CC builder by ID error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch CC builder");
    }
  }
);

// Async thunk to fetch all CC items
export const fetchCCItems = createAsyncThunk(
  "ccBuilder/fetchCCItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/items/get`);
      const items = response.data;
      if (!Array.isArray(items)) {
        return rejectWithValue("Invalid response: Items data is not an array.");
      }
      return items;
    } catch (error) {
      console.error("Fetch CC items error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch CC items");
    }
  }
);

// Async thunk to fetch single CC item by ID
export const fetchCCItemById = createAsyncThunk(
  "ccBuilder/fetchCCItemById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/items/get/${id}`);
      const item = response.data;
      if (!item || typeof item !== "object") {
        return rejectWithValue("Invalid response: Item data is not valid.");
      }
      return item;
    } catch (error) {
      console.error("Fetch CC item by ID error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch CC item");
    }
  }
);

// Async thunk to fetch all CC item details
export const fetchAllCCItemDetails = createAsyncThunk(
  "ccBuilder/fetchAllCCItemDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/CCBuilder/Item/Ditels/get`);
      const itemDetails = response.data;
      if (!Array.isArray(itemDetails)) {
        return rejectWithValue("Invalid response: Item details data is not an array.");
      }
      return itemDetails.map((item) => ({
        ...item,
        imagea: item.imagea || null,
      }));
    } catch (error) {
      console.error("Fetch all CC item details error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all CC item details"
      );
    }
  }
);

// Async thunk to fetch single CC item details by ID
export const fetchCCItemDetailsById = createAsyncThunk(
  "ccBuilder/fetchCCItemDetailsById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/CCBuilder/Item/Ditels/get/${id}`);
      const itemDetail = response.data;
      if (!itemDetail || typeof itemDetail !== "object") {
        return rejectWithValue("Invalid response: Item detail data is not valid.");
      }
      return { ...itemDetail, imagea: itemDetail.imagea || null };
    } catch (error) {
      console.error("Fetch CC item details by ID error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch CC item details"
      );
    }
  }
);

// Fetch CC item details by ccBuilderId
export const fetchCCItemDetailsByBuilderId = createAsyncThunk(
  "ccBuilder/fetchCCItemDetailsByBuilderId",
  async (ccBuilderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/CCBuilder/Ditels/ccBuilder/get/ById/${ccBuilderId}`
      );
      const itemDetails = response.data;
      if (!Array.isArray(itemDetails)) {
        return rejectWithValue("Invalid response: Item details data is not an array.");
      }
      return itemDetails.map((item) => ({
        ...item,
        imagea: item.imagea || null,
      }));
    } catch (error) {
      console.error("Fetch CC item details by builder ID error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch CC item details by builder ID"
      );
    }
  }
);

// Fetch CC item details by itemId
export const fetchCCItemDetailsByItemId = createAsyncThunk(
  "ccBuilder/fetchCCItemDetailsByItemId",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/CCBuilder/Ditels/itemId/Idby/get/${itemId}`
      );
      const itemDetails = response.data;
      if (!Array.isArray(itemDetails)) {
        return rejectWithValue("Invalid response: Item details data is not an array.");
      }
      return itemDetails.map((item) => ({
        ...item,
        imagea: item.imagea || null,
      }));
    } catch (error) {
      console.error("Fetch CC item details by item ID error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch CC item details by item ID"
      );
    }
  }
);

// Async thunk to add a CC component (builder)
export const addCCComponent = createAsyncThunk(
  "ccBuilder/addCCComponent",
  async ({ name }, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState());
      if (!token) return rejectWithValue("No authentication token found.");

      const response = await axios.post(
        `${API_BASE_URL}/api/ccbuilder/save`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Add CC component error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to add CC component");
    }
  }
);

// Async thunk to update a CC component (builder)
export const updateCCBuilder = createAsyncThunk(
  "ccBuilder/updateCCBuilder",
  async ({ id, name }, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState());
      if (!token) return rejectWithValue("No authentication token found.");

      const response = await axios.put(
        `${API_BASE_URL}/api/ccbuilder/updete/data/${id}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Update CC builder error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to update CC builder");
    }
  }
);

// Async thunk to delete a CC component (builder)
export const deleteCCBuilder = createAsyncThunk(
  "ccBuilder/deleteCCBuilder",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState());
      if (!token) return rejectWithValue("No authentication token found.");

      const response = await axios.delete(`${API_BASE_URL}/api/ccbuilder/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { id }; // Return the deleted item's ID
    } catch (error) {
      console.error("Delete CC builder error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to delete CC builder");
    }
  }
);

// Async thunk to add a CC item (product) under a CC builder
export const addCCItem = createAsyncThunk(
  "ccBuilder/addCCItem",
  async ({ name, ccBuilderId }, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState());
      if (!token) return rejectWithValue("No authentication token found.");

      const components = getState().ccBuilder.components;
      const selectedBuilder = components.find((builder) => String(builder.id) === String(ccBuilderId));
      if (!selectedBuilder) {
        return rejectWithValue("Selected CC builder not found.");
      }

      const itemData = {
        name,
        ccBuilder: {
          id: selectedBuilder.id,
          name: selectedBuilder.name,
        },
      };

      const response = await axios.post(`${API_BASE_URL}/api/items/save`, itemData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Add CC item error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to add CC item");
    }
  }
);

// Async thunk to update a CC item
export const updateCCItem = createAsyncThunk(
  "ccBuilder/updateCCItem",
  async ({ id, name, ccBuilderId }, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState());
      if (!token) return rejectWithValue("No authentication token found.");

      const components = getState().ccBuilder.components;
      const selectedBuilder = components.find((builder) => String(builder.id) === String(ccBuilderId));
      if (!selectedBuilder) {
        return rejectWithValue("Selected CC builder not found.");
      }

      const itemData = {
        name,
        ccBuilder: {
          id: selectedBuilder.id,
          name: selectedBuilder.name,
        },
      };

      const response = await axios.put(`${API_BASE_URL}/api/items/update/${id}`, itemData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Update CC item error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to update CC item");
    }
  }
);

// Async thunk to delete a CC item
export const deleteCCItem = createAsyncThunk(
  "ccBuilder/deleteCCItem",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState());
      if (!token) return rejectWithValue("No authentication token found.");

      const response = await axios.delete(`${API_BASE_URL}/api/items/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { id }; // Return the deleted item's ID
    } catch (error) {
      console.error("Delete CC item error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to delete CC item");
    }
  }
);

// Async thunk to add CC item details
export const addCCItemDetails = createAsyncThunk(
  "ccBuilder/addCCItemDetails",
  async (
    {
      name,
      description,
      performance,
      ability,
      regularprice,
      warranty,
      benefits,
      moralqualities,
      opportunity,
      specialprice,
      quantity,
      itemId,
      ccBuilderId,
      imagea,
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const token = getAuthToken(getState());
      if (!token) return rejectWithValue("No authentication token found.");

      const components = getState().ccBuilder.components;
      const selectedBuilder = components.find(
        (builder) => String(builder.id) === String(ccBuilderId)
      );
      if (!selectedBuilder) return rejectWithValue("Selected CC builder not found.");

      let selectedItem = null;
      if (itemId) {
        const items = getState().ccBuilder.items;
        selectedItem = items.find((item) => String(item.id) === String(itemId));
        if (!selectedItem) return rejectWithValue("Selected item not found.");
      }

      const formData = new FormData();
      const payload = {
        name,
        description,
        performance,
        ability,
        regularprice: parseFloat(regularprice),
        warranty: parseInt(warranty) || 0,
        benefits,
        moralqualities,
        opportunity,
        specialprice: parseFloat(specialprice),
        quantity: parseInt(quantity),
        ccBuilder: { id: parseInt(ccBuilderId) },
      };
      if (itemId && selectedItem) {
        payload.item = { id: parseInt(itemId) };
      }
      formData.append("ccbuilder", new Blob([JSON.stringify(payload)], { type: "application/json" }));
      if (imagea) formData.append("image", imagea);

      const response = await axios.post(
        `${API_BASE_URL}/api/CCBuilder/Item/Ditels/save`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Add CC item details error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to add CC item details");
    }
  }
);

// Async thunk to update CC item details
export const updateCCItemDetails = createAsyncThunk(
  "ccBuilder/updateCCItemDetails",
  async (
    {
      id,
      name,
      description,
      performance,
      ability,
      regularprice,
      warranty,
      benefits,
      moralqualities,
      opportunity,
      specialprice,
      quantity,
      itemId,
      ccBuilderId,
      imagea,
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const token = getAuthToken(getState());
      if (!token) return rejectWithValue("No authentication token found.");

      const components = getState().ccBuilder.components;
      const selectedBuilder = components.find(
        (builder) => String(builder.id) === String(ccBuilderId)
      );
      if (!selectedBuilder) return rejectWithValue("Selected CC builder not found.");

      let selectedItem = null;
      if (itemId) {
        const items = getState().ccBuilder.items;
        selectedItem = items.find((item) => String(item.id) === String(itemId));
        if (!selectedItem) return rejectWithValue("Selected item not found.");
      }

      const formData = new FormData();
      const payload = {
        name,
        description,
        performance,
        ability,
        regularprice: parseFloat(regularprice),
        warranty: parseInt(warranty) || 0,
        benefits,
        moralqualities,
        opportunity,
        specialprice: parseFloat(specialprice),
        quantity: parseInt(quantity),
        ccBuilder: { id: parseInt(ccBuilderId) },
      };
      if (itemId && selectedItem) {
        payload.item = { id: parseInt(itemId) };
      }
      formData.append("ccbuilder", new Blob([JSON.stringify(payload)], { type: "application/json" }));
      if (imagea) formData.append("image", imagea);

      const response = await axios.put(
        `${API_BASE_URL}/api/CCBuilder/Item/Ditels/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Update CC item details error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to update CC item details");
    }
  }
);

// Async thunk to delete CC item details
export const deleteCCItemDetails = createAsyncThunk(
  "ccBuilder/deleteCCItemDetails",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState());
      if (!token) return rejectWithValue("No authentication token found.");

      const response = await axios.delete(`${API_BASE_URL}/api/CCBuilder/Item/Ditels/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { id }; // Return the deleted item's ID
    } catch (error) {
      console.error("Delete CC item details error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to delete CC item details");
    }
  }
);

// Async thunk to add a CC item to the cart
export const addCCItemToCartAsync = createAsyncThunk(
  "ccBuilder/addCCItemToCartAsync",
  async ({ CCItemBulderId, quantity, name, price, imagea }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token || localStorage.getItem("authToken");
    const profile = state.auth.profile;
    const userId = profile?.id;

    if (!token || !profile?.email || !userId) {
      return { CCItemBulderId, quantity, name, price, imagea, isGuest: true };
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/CCItemBuilder/AddToCart/save?userId=${userId}&CCItemBulderId=${CCItemBulderId}&quantity=${quantity}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { ...response.data, name, price, imagea };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add CC item to cart");
    }
  }
);

// Async thunk to place a CC Builder order
export const placeCCPartOrder = createAsyncThunk(
  "ccBuilder/placeCCPartOrder",
  async (orderData, { rejectWithValue, getState }) => {
    try {
      const token = getAuthToken(getState());
      if (!token) return rejectWithValue("No authentication token found.");

      const response = await axios.post(`${API_BASE_URL}/api/ccitem/Bulder/orders/save`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Place CC part order error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to place CC part order");
    }
  }
);

const ccbuilderSlice = createSlice({
  name: "ccBuilder",
  initialState: {
    components: [],
    items: [],
    itemDetails: [],
    currentItemDetails: null,
    currentBuilder: null,
    currentItem: null,
    loading: { component: false, item: false, itemDetails: false, cart: false, order: false },
    error: { component: null, item: null, itemDetails: null, cart: null, order: null },
    successMessage: { component: null, item: null, itemDetails: null, cart: null, order: null },
  },
  reducers: {
    clearCCBError: (state) => {
      state.error.component = null;
      state.error.item = null;
      state.error.itemDetails = null;
      state.error.cart = null;
      state.error.order = null;
    },
    clearCCBSuccess: (state) => {
      state.successMessage.component = null;
      state.successMessage.item = null;
      state.successMessage.itemDetails = null;
      state.successMessage.cart = null;
      state.successMessage.order = null;
    },
    resetCurrentItemDetails: (state) => {
      state.currentItemDetails = null;
    },
    resetCurrentBuilder: (state) => {
      state.currentBuilder = null;
    },
    resetCurrentItem: (state) => {
      state.currentItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch CC Components
      .addCase(fetchCCComponents.pending, (state) => {
        state.loading.component = true;
        state.error.component = null;
      })
      .addCase(fetchCCComponents.fulfilled, (state, action) => {
        state.loading.component = false;
        state.components = action.payload;
      })
      .addCase(fetchCCComponents.rejected, (state, action) => {
        state.loading.component = false;
        state.error.component = action.payload;
      })
      // Fetch CC Builder by ID
      .addCase(fetchCCBuilderById.pending, (state) => {
        state.loading.component = true;
        state.error.component = null;
        state.currentBuilder = null;
      })
      .addCase(fetchCCBuilderById.fulfilled, (state, action) => {
        state.loading.component = false;
        state.currentBuilder = action.payload;
      })
      .addCase(fetchCCBuilderById.rejected, (state, action) => {
        state.loading.component = false;
        state.error.component = action.payload;
      })
      // Delete CC Builder
      .addCase(deleteCCBuilder.pending, (state) => {
        state.loading.component = true;
        state.error.component = null;
        state.successMessage.component = null;
      })
      .addCase(deleteCCBuilder.fulfilled, (state, action) => {
        state.loading.component = false;
        state.components = state.components.filter((builder) => builder.id !== action.payload.id);
        state.successMessage.component = "CC builder deleted successfully!";
      })
      .addCase(deleteCCBuilder.rejected, (state, action) => {
        state.loading.component = false;
        state.error.component = action.payload;
      })
      // Fetch All CC Items
      .addCase(fetchCCItems.pending, (state) => {
        state.loading.item = true;
        state.error.item = null;
      })
      .addCase(fetchCCItems.fulfilled, (state, action) => {
        state.loading.item = false;
        state.items = action.payload;
      })
      .addCase(fetchCCItems.rejected, (state, action) => {
        state.loading.item = false;
        state.error.item = action.payload;
      })
      // Fetch CC Item by ID
      .addCase(fetchCCItemById.pending, (state) => {
        state.loading.item = true;
        state.error.item = null;
        state.currentItem = null;
      })
      .addCase(fetchCCItemById.fulfilled, (state, action) => {
        state.loading.item = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchCCItemById.rejected, (state, action) => {
        state.loading.item = false;
        state.error.item = action.payload;
      })
      // Delete CC Item
      .addCase(deleteCCItem.pending, (state) => {
        state.loading.item = true;
        state.error.item = null;
        state.successMessage.item = null;
      })
      .addCase(deleteCCItem.fulfilled, (state, action) => {
        state.loading.item = false;
        state.items = state.items.filter((item) => item.id !== action.payload.id);
        state.successMessage.item = "CC item deleted successfully!";
      })
      .addCase(deleteCCItem.rejected, (state, action) => {
        state.loading.item = false;
        state.error.item = action.payload;
      })
      // Fetch All CC Item Details
      .addCase(fetchAllCCItemDetails.pending, (state) => {
        state.loading.itemDetails = true;
        state.error.itemDetails = null;
      })
      .addCase(fetchAllCCItemDetails.fulfilled, (state, action) => {
        state.loading.itemDetails = false;
        state.itemDetails = action.payload;
      })
      .addCase(fetchAllCCItemDetails.rejected, (state, action) => {
        state.loading.itemDetails = false;
        state.error.itemDetails = action.payload;
      })
      // Fetch CC Item Details by ID
      .addCase(fetchCCItemDetailsById.pending, (state) => {
        state.loading.itemDetails = true;
        state.error.itemDetails = null;
        state.currentItemDetails = null;
      })
      .addCase(fetchCCItemDetailsById.fulfilled, (state, action) => {
        state.loading.itemDetails = false;
        state.currentItemDetails = action.payload;
      })
      .addCase(fetchCCItemDetailsById.rejected, (state, action) => {
        state.loading.itemDetails = false;
        state.error.itemDetails = action.payload;
      })
      // Fetch CC Item Details by Builder ID
      .addCase(fetchCCItemDetailsByBuilderId.pending, (state) => {
        state.loading.itemDetails = true;
        state.error.itemDetails = null;
      })
      .addCase(fetchCCItemDetailsByBuilderId.fulfilled, (state, action) => {
        state.loading.itemDetails = false;
        state.itemDetails = action.payload;
      })
      .addCase(fetchCCItemDetailsByBuilderId.rejected, (state, action) => {
        state.loading.itemDetails = false;
        state.error.itemDetails = action.payload;
      })
      // Fetch CC Item Details by Item ID
      .addCase(fetchCCItemDetailsByItemId.pending, (state) => {
        state.loading.itemDetails = true;
        state.error.itemDetails = null;
      })
      .addCase(fetchCCItemDetailsByItemId.fulfilled, (state, action) => {
        state.loading.itemDetails = false;
        state.itemDetails = action.payload;
      })
      .addCase(fetchCCItemDetailsByItemId.rejected, (state, action) => {
        state.loading.itemDetails = false;
        state.error.itemDetails = action.payload;
      })
      // Add CC Component
      .addCase(addCCComponent.pending, (state) => {
        state.loading.component = true;
        state.error.component = null;
        state.successMessage.component = null;
      })
      .addCase(addCCComponent.fulfilled, (state, action) => {
        state.loading.component = false;
        state.components.push(action.payload);
        state.successMessage.component = "CC component added successfully!";
      })
      .addCase(addCCComponent.rejected, (state, action) => {
        state.loading.component = false;
        state.error.component = action.payload;
      })
      // Update CC Builder
      .addCase(updateCCBuilder.pending, (state) => {
        state.loading.component = true;
        state.error.component = null;
        state.successMessage.component = null;
      })
      .addCase(updateCCBuilder.fulfilled, (state, action) => {
        state.loading.component = false;
        state.components = state.components.map((builder) =>
          builder.id === action.payload.id ? action.payload : builder
        );
        state.currentBuilder = null;
        state.successMessage.component = "CC builder updated successfully!";
      })
      .addCase(updateCCBuilder.rejected, (state, action) => {
        state.loading.component = false;
        state.error.component = action.payload;
      })
      // Add CC Item
      .addCase(addCCItem.pending, (state) => {
        state.loading.item = true;
        state.error.item = null;
        state.successMessage.item = null;
      })
      .addCase(addCCItem.fulfilled, (state, action) => {
        state.loading.item = false;
        state.items.push(action.payload);
        state.successMessage.item = "CC item added successfully!";
      })
      .addCase(addCCItem.rejected, (state, action) => {
        state.loading.item = false;
        state.error.item = action.payload;
      })
      // Update CC Item
      .addCase(updateCCItem.pending, (state) => {
        state.loading.item = true;
        state.error.item = null;
        state.successMessage.item = null;
      })
      .addCase(updateCCItem.fulfilled, (state, action) => {
        state.loading.item = false;
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
        state.currentItem = null;
        state.successMessage.item = "CC item updated successfully!";
      })
      .addCase(updateCCItem.rejected, (state, action) => {
        state.loading.item = false;
        state.error.item = action.payload;
      })
      // Add CC Item Details
      .addCase(addCCItemDetails.pending, (state) => {
        state.loading.itemDetails = true;
        state.error.itemDetails = null;
        state.successMessage.itemDetails = null;
      })
      .addCase(addCCItemDetails.fulfilled, (state, action) => {
        state.loading.itemDetails = false;
        state.itemDetails.push(action.payload);
        state.successMessage.itemDetails = "CC item details added successfully!";
      })
      .addCase(addCCItemDetails.rejected, (state, action) => {
        state.loading.itemDetails = false;
        state.error.itemDetails = action.payload;
      })
      // Update CC Item Details
      .addCase(updateCCItemDetails.pending, (state) => {
        state.loading.itemDetails = true;
        state.error.itemDetails = null;
        state.successMessage.itemDetails = null;
      })
      .addCase(updateCCItemDetails.fulfilled, (state, action) => {
        state.loading.itemDetails = false;
        state.itemDetails = state.itemDetails.map((detail) =>
          detail.id === action.payload.id ? action.payload : detail
        );
        state.currentItemDetails = action.payload;
        state.successMessage.itemDetails = "CC item details updated successfully!";
      })
      .addCase(updateCCItemDetails.rejected, (state, action) => {
        state.loading.itemDetails = false;
        state.error.itemDetails = action.payload;
      })
      // Delete CC Item Details
      .addCase(deleteCCItemDetails.pending, (state) => {
        state.loading.itemDetails = true;
        state.error.itemDetails = null;
        state.successMessage.itemDetails = null;
      })
      .addCase(deleteCCItemDetails.fulfilled, (state, action) => {
        state.loading.itemDetails = false;
        state.itemDetails = state.itemDetails.filter((detail) => detail.id !== action.payload.id);
        state.currentItemDetails = null;
        state.successMessage.itemDetails = "CC item details deleted successfully!";
      })
      .addCase(deleteCCItemDetails.rejected, (state, action) => {
        state.loading.itemDetails = false;
        state.error.itemDetails = action.payload;
      })
      // Add CC Item to Cart
      .addCase(addCCItemToCartAsync.pending, (state) => {
        state.loading.cart = true;
        state.error.cart = null;
        state.successMessage.cart = null;
      })
      .addCase(addCCItemToCartAsync.fulfilled, (state) => {
        state.loading.cart = false;
        state.successMessage.cart = "CC item added to cart successfully!";
      })
      .addCase(addCCItemToCartAsync.rejected, (state, action) => {
        state.loading.cart = false;
        state.error.cart = action.payload;
      })
      // Place CC Part Order
      .addCase(placeCCPartOrder.pending, (state) => {
        state.loading.order = true;
        state.error.order = null;
        state.successMessage.order = null;
      })
      .addCase(placeCCPartOrder.fulfilled, (state) => {
        state.loading.order = false;
        state.successMessage.order = "CC part order placed successfully!";
      })
      .addCase(placeCCPartOrder.rejected, (state, action) => {
        state.loading.order = false;
        state.error.order = action.payload;
      });
  },
});

export const {
  clearCCBError,
  clearCCBSuccess,
  resetCurrentItemDetails,
  resetCurrentBuilder,
  resetCurrentItem,
} = ccbuilderSlice.actions;
export default ccbuilderSlice.reducer;