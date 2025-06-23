// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { API_BASE_URL } from "./api";

// // Async thunk to fetch all PC components
// export const fetchPCComponents = createAsyncThunk(
//   "pcBuilder/fetchPCComponents",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/PcBuilder/Allget`);
//       const components = response.data;
//       if (!Array.isArray(components)) {
//         return rejectWithValue("Invalid response: Components data is not an array.");
//       }
//       components.forEach((component) => {
//         component.imagea = component.imagea || null;
//       });
//       return components;
//     } catch (error) {
//       console.error("Fetch PC components error:", error.response?.data);
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch PC components");
//     }
//   }
// );

// // Async thunk to fetch PC parts by PC builder ID
// export const fetchPCPartsByBuilderId = createAsyncThunk(
//   "pcBuilder/fetchPCPartsByBuilderId",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/PcForPartAdd/getPcBuilder/Byid/${id}`);
//       const parts = response.data;
//       if (!Array.isArray(parts)) {
//         return rejectWithValue("Invalid response: Parts data is not an array.");
//       }
//       parts.forEach((part) => {
//         part.imagea = part.imagea || null;
//       });
//       return parts;
//     } catch (error) {
//       console.error("Fetch PC parts by builder ID error:", error.response?.data);
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch PC parts by builder ID");
//     }
//   }
// );

// // Async thunk to fetch all PC parts
// export const fetchPCParts = createAsyncThunk(
//   "pcBuilder/fetchPCParts",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/PcForPartAdd/get`);
//       const parts = response.data;
//       if (!Array.isArray(parts)) {
//         return rejectWithValue("Invalid response: Parts data is not an array.");
//       }
//       parts.forEach((part) => {
//         part.imagea = part.imagea || null;
//       });
//       return parts;
//     } catch (error) {
//       console.error("Fetch PC parts error:", error.response?.data);
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch PC parts");
//     }
//   }
// );

// // Async thunk to fetch single PC part by ID
// export const fetchPCPartsById = createAsyncThunk(
//   "pcBuilder/fetchPCPartsById",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/PcForPartAdd/get/${id}`);
//       const part = response.data;
//       if (!part || typeof part !== "object") {
//         return rejectWithValue("Invalid response: Part data is not valid.");
//       }
//       part.imagea = part.imagea || null;
//       return part;
//     } catch (error) {
//       console.error("Fetch PC part by ID error:", error.response?.data);
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch PC part");
//     }
//   }
// );

// // Async thunk to add a PC component
// export const addPCComponent = createAsyncThunk(
//   "pcBuilder/addPCComponent",
//   async ({ name, image }, { rejectWithValue, getState }) => {
//     try {
//       const state = getState();
//       const token = state.auth.token || localStorage.getItem("authToken");
//       if (!token) return rejectWithValue("No authentication token found.");

//       const formData = new FormData();
//       formData.append("pcbuilder", new Blob([JSON.stringify({ name })], { type: "application/json" }));
//       formData.append("image", image);

//       const response = await axios.post(`${API_BASE_URL}/api/PcBuilder/save`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Add PC component error:", error.response?.data);
//       return rejectWithValue(error.response?.data?.message || "Failed to add PC component");
//     }
//   }
// );

// // Async thunk to add a PC part
// export const addPCPart = createAsyncThunk(
//   "pcBuilder/addPCPart",
//   async (
//     { name, description, performance, ability, regularprice, specialprice, quantity, pcbuilder, image },
//     { rejectWithValue, getState }
//   ) => {
//     try {
//       const state = getState();
//       const token = state.auth.token || localStorage.getItem("authToken");
//       if (!token) return rejectWithValue("No authentication token found.");

//       const formData = new FormData();
//       const partData = {
//         name,
//         description,
//         performance,
//         ability,
//         regularprice: parseFloat(regularprice),
//         specialprice: parseFloat(specialprice),
//         quantity: parseInt(quantity),
//         pcbuilder: { id: parseInt(pcbuilder.id) },
//       };
//       formData.append("pcforpartadd", new Blob([JSON.stringify(partData)], { type: "application/json" }));
//       formData.append("image", image);

//       const response = await axios.post(`${API_BASE_URL}/api/PcForPartAdd/save`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Add PC part error:", error.response?.data);
//       return rejectWithValue(error.response?.data?.message || "Failed to add PC part");
//     }
//   }
// );

// // Async thunk to place a PC part order
// export const placePCPartOrder = createAsyncThunk(
//   "pcBuilder/placePCPartOrder",
//   async (orderData, { rejectWithValue, getState }) => {
//     try {
//       const state = getState();
//       const token = state.auth.token || localStorage.getItem("authToken");
//       if (!token) return rejectWithValue("No authentication token found.");

//       const response = await axios.post(`${API_BASE_URL}/api/pcforpart/orders/save`, orderData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Place PC part order error:", error.response?.data);
//       return rejectWithValue(error.response?.data?.message || "Failed to place PC part order");
//     }
//   }
// );

// const pcbuilderSlice = createSlice({
//   name: "pcBuilder",
//   initialState: {
//     components: [],
//     parts: [],
//     categoryParts: [],
//     currentPart: null,
//     loading: { component: false, part: false, categoryParts: false, order: false },
//     error: { component: null, part: null, categoryParts: null, order: null },
//     successMessage: { component: null, part: null, order: null },
//   },
//   reducers: {
//     clearPCBError: (state) => {
//       state.error.component = null;
//       state.error.part = null;
//       state.error.categoryParts = null;
//       state.error.order = null;
//     },
//     clearPCBSuccess: (state) => {
//       state.successMessage.component = null;
//       state.successMessage.part = null;
//       state.successMessage.order = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch PC Components
//       .addCase(fetchPCComponents.pending, (state) => {
//         state.loading.component = true;
//         state.error.component = null;
//       })
//       .addCase(fetchPCComponents.fulfilled, (state, action) => {
//         state.loading.component = false;
//         state.components = action.payload;
//       })
//       .addCase(fetchPCComponents.rejected, (state, action) => {
//         state.loading.component = false;
//         state.error.component = action.payload;
//       })
//       // Fetch PC Parts by Builder ID
//       .addCase(fetchPCPartsByBuilderId.pending, (state) => {
//         state.loading.categoryParts = true;
//         state.error.categoryParts = null;
//       })
//       .addCase(fetchPCPartsByBuilderId.fulfilled, (state, action) => {
//         state.loading.categoryParts = false;
//         state.categoryParts = action.payload;
//       })
//       .addCase(fetchPCPartsByBuilderId.rejected, (state, action) => {
//         state.loading.categoryParts = false;
//         state.error.categoryParts = action.payload;
//       })
//       // Fetch PC Parts
//       .addCase(fetchPCParts.pending, (state) => {
//         state.loading.part = true;
//         state.error.part = null;
//       })
//       .addCase(fetchPCParts.fulfilled, (state, action) => {
//         state.loading.part = false;
//         state.parts = action.payload;
//       })
//       .addCase(fetchPCParts.rejected, (state, action) => {
//         state.loading.part = false;
//         state.error.part = action.payload;
//       })
//       // Fetch single PC Part by ID
//       .addCase(fetchPCPartsById.pending, (state) => {
//         state.loading.part = true;
//         state.error.part = null;
//         state.currentPart = null;
//       })
//       .addCase(fetchPCPartsById.fulfilled, (state, action) => {
//         state.loading.part = false;
//         state.currentPart = action.payload;
//       })
//       .addCase(fetchPCPartsById.rejected, (state, action) => {
//         state.loading.part = false;
//         state.error.part = action.payload;
//       })
//       // Add PC Component
//       .addCase(addPCComponent.pending, (state) => {
//         state.loading.component = true;
//         state.error.component = null;
//         state.successMessage.component = null;
//       })
//       .addCase(addPCComponent.fulfilled, (state, action) => {
//         state.loading.component = false;
//         state.components.push(action.payload);
//         state.successMessage.component = "PC component added successfully!";
//       })
//       .addCase(addPCComponent.rejected, (state, action) => {
//         state.loading.component = false;
//         state.error.component = action.payload;
//       })
//       // Add PC Part
//       .addCase(addPCPart.pending, (state) => {
//         state.loading.part = true;
//         state.error.part = null;
//         state.successMessage.part = null;
//       })
//       .addCase(addPCPart.fulfilled, (state, action) => {
//         state.loading.part = false;
//         state.parts.push(action.payload);
//         state.successMessage.part = "PC part added successfully!";
//       })
//       .addCase(addPCPart.rejected, (state, action) => {
//         state.loading.part = false;
//         state.error.part = action.payload;
//       })
//       // Place PC Part Order
//       .addCase(placePCPartOrder.pending, (state) => {
//         state.loading.order = true;
//         state.error.order = null;
//         state.successMessage.order = null;
//       })
//       .addCase(placePCPartOrder.fulfilled, (state, action) => {
//         state.loading.order = false;
//         state.successMessage.order = "PC part order placed successfully!";
//       })
//       .addCase(placePCPartOrder.rejected, (state, action) => {
//         state.loading.order = false;
//         state.error.order = action.payload;
//       });
//   },
// });

// export const { clearPCBError, clearPCBSuccess } = pcbuilderSlice.actions;
// export default pcbuilderSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "./api";

// Async thunk to fetch all PC components
export const fetchPCComponents = createAsyncThunk(
  "pcBuilder/fetchPCComponents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/PcBuilder/Allget`);
      const components = response.data;
      if (!Array.isArray(components)) {
        return rejectWithValue("Invalid response: Components data is not an array.");
      }
      components.forEach((component) => {
        component.imagea = component.imagea || null;
      });
      return components;
    } catch (error) {
      console.error("Fetch PC components error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch PC components");
    }
  }
);

// Async thunk to fetch PC parts by PC builder ID
export const fetchPCPartsByBuilderId = createAsyncThunk(
  "pcBuilder/fetchPCPartsByBuilderId",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/PcForPartAdd/getPcBuilder/Byid/${id}`);
      const parts = response.data;
      if (!Array.isArray(parts)) {
        return rejectWithValue("Invalid response: Parts data is not an array.");
      }
      parts.forEach((part) => {
        part.imagea = part.imagea || null;
      });
      return parts;
    } catch (error) {
      console.error("Fetch PC parts by builder ID error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch PC parts by builder ID");
    }
  }
);

// Async thunk to fetch all PC parts
export const fetchPCParts = createAsyncThunk(
  "pcBuilder/fetchPCParts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/PcForPartAdd/get`);
      const parts = response.data;
      if (!Array.isArray(parts)) {
        return rejectWithValue("Invalid response: Parts data is not an array.");
      }
      parts.forEach((part) => {
        part.imagea = part.imagea || null;
      });
      return parts;
    } catch (error) {
      console.error("Fetch PC parts error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch PC parts");
    }
  }
);

// Async thunk to fetch single PC part by ID
export const fetchPCPartsById = createAsyncThunk(
  "pcBuilder/fetchPCPartsById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/PcForPartAdd/get/${id}`);
      const part = response.data;
      if (!part || typeof part !== "object") {
        return rejectWithValue("Invalid response: Part data is not valid.");
      }
      part.imagea = part.imagea || null;
      return part;
    } catch (error) {
      console.error("Fetch PC part by ID error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch PC part");
    }
  }
);

// Async thunk to add a PC component
export const addPCComponent = createAsyncThunk(
  "pcBuilder/addPCComponent",
  async ({ name, image }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem("authToken");
      if (!token) return rejectWithValue("No authentication token found.");

      const formData = new FormData();
      formData.append("pcbuilder", new Blob([JSON.stringify({ name })], { type: "application/json" }));
      formData.append("image", image);

      const response = await axios.post(`${API_BASE_URL}/api/PcBuilder/save`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Add PC component error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to add PC component");
    }
  }
);

// Async thunk to add a PC part
export const addPCPart = createAsyncThunk(
  "pcBuilder/addPCPart",
  async (
    { name, description, performance, ability, regularprice, specialprice, quantity, pcbuilder, image },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem("authToken");
      if (!token) return rejectWithValue("No authentication token found.");

      const formData = new FormData();
      const partData = {
        name,
        description,
        performance,
        ability,
        regularprice: parseFloat(regularprice),
        specialprice: parseFloat(specialprice),
        quantity: parseInt(quantity),
        pcbuilder: { id: parseInt(pcbuilder.id) },
      };
      formData.append("pcforpartadd", new Blob([JSON.stringify(partData)], { type: "application/json" }));
      formData.append("image", image);

      const response = await axios.post(`${API_BASE_URL}/api/PcForPartAdd/save`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Add PC part error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to add PC part");
    }
  }
);

// Async thunk to update a PC part
export const updatePCPart = createAsyncThunk(
  "pcBuilder/updatePCPart",
  async (
    { id, name, description, performance, ability, regularprice, specialprice, quantity, pcbuilder, imagea },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem("authToken");
      if (!token) return rejectWithValue("No authentication token found.");

      const formData = new FormData();
      const partData = {
        id: parseInt(id),
        name,
        description,
        performance,
        ability,
        regularprice: parseFloat(regularprice),
        specialprice: parseFloat(specialprice),
        quantity: parseInt(quantity),
        pcbuilder: { id: parseInt(pcbuilder.id) },
      };
      formData.append("pcpart", new Blob([JSON.stringify(partData)], { type: "application/json" }));
      if (imagea) {
        formData.append("imagea", imagea);
      }

      const response = await axios.put(`${API_BASE_URL}/api/pcforpartadd/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Update PC part error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to update PC part");
    }
  }
);

// Async thunk to delete a PC part
export const deletePCPart = createAsyncThunk(
  "pcBuilder/deletePCPart",
  async (id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem("authToken");
      if (!token) return rejectWithValue("No authentication token found.");

      await axios.delete(`${API_BASE_URL}/api/PcForPartAdd/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      console.error("Delete PC part error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to delete PC part");
    }
  }
);

// Async thunk to place a PC part order
export const    placePCPartOrder = createAsyncThunk(
  "pcBuilder/placePCPartOrder",
  async (orderData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem("authToken");
      if (!token) return rejectWithValue("No authentication token found.");

      const response = await axios.post(`${API_BASE_URL}/api/pcforpart/orders/save`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Place PC part order error:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to place PC part order");
    }
  }
);

const pcbuilderSlice = createSlice({
  name: "pcBuilder",
  initialState: {
    components: [],
    parts: [],
    categoryParts: [],
    currentPart: null,
    loading: { component: false, part: false, categoryParts: false, order: false, update: false, delete: false },
    error: { component: null, part: null, categoryParts: null, order: null, update: null, delete: null },
    successMessage: { component: null, part: null, order: null, update: null, delete: null },
  },
  reducers: {
    clearPCBError: (state) => {
      state.error.component = null;
      state.error.part = null;
      state.error.categoryParts = null;
      state.error.order = null;
      state.error.update = null;
      state.error.delete = null;
    },
    clearPCBSuccess: (state) => {
      state.successMessage.component = null;
      state.successMessage.part = null;
      state.successMessage.order = null;
      state.successMessage.update = null;
      state.successMessage.delete = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch PC Components
      .addCase(fetchPCComponents.pending, (state) => {
        state.loading.component = true;
        state.error.component = null;
      })
      .addCase(fetchPCComponents.fulfilled, (state, action) => {
        state.loading.component = false;
        state.components = action.payload;
      })
      .addCase(fetchPCComponents.rejected, (state, action) => {
        state.loading.component = false;
        state.error.component = action.payload;
      })
      // Fetch PC Parts by Builder ID
      .addCase(fetchPCPartsByBuilderId.pending, (state) => {
        state.loading.categoryParts = true;
        state.error.categoryParts = null;
      })
      .addCase(fetchPCPartsByBuilderId.fulfilled, (state, action) => {
        state.loading.categoryParts = false;
        state.categoryParts = action.payload;
      })
      .addCase(fetchPCPartsByBuilderId.rejected, (state, action) => {
        state.loading.categoryParts = false;
        state.error.categoryParts = action.payload;
      })
      // Fetch PC Parts
      .addCase(fetchPCParts.pending, (state) => {
        state.loading.part = true;
        state.error.part = null;
      })
      .addCase(fetchPCParts.fulfilled, (state, action) => {
        state.loading.part = false;
        state.parts = action.payload;
      })
      .addCase(fetchPCParts.rejected, (state, action) => {
        state.loading.part = false;
        state.error.part = action.payload;
      })
      // Fetch single PC Part by ID
      .addCase(fetchPCPartsById.pending, (state) => {
        state.loading.part = true;
        state.error.part = null;
        state.currentPart = null;
      })
      .addCase(fetchPCPartsById.fulfilled, (state, action) => {
        state.loading.part = false;
        state.currentPart = action.payload;
      })
      .addCase(fetchPCPartsById.rejected, (state, action) => {
        state.loading.part = false;
        state.error.part = action.payload;
      })
      // Add PC Component
      .addCase(addPCComponent.pending, (state) => {
        state.loading.component = true;
        state.error.component = null;
        state.successMessage.component = null;
      })
      .addCase(addPCComponent.fulfilled, (state, action) => {
        state.loading.component = false;
        state.components.push(action.payload);
        state.successMessage.component = "PC component added successfully!";
      })
      .addCase(addPCComponent.rejected, (state, action) => {
        state.loading.component = false;
        state.error.component = action.payload;
      })
      // Add PC Part
      .addCase(addPCPart.pending, (state) => {
        state.loading.part = true;
        state.error.part = null;
        state.successMessage.part = null;
      })
      .addCase(addPCPart.fulfilled, (state, action) => {
        state.loading.part = false;
        state.parts.push(action.payload);
        state.successMessage.part = "PC part added successfully!";
      })
      .addCase(addPCPart.rejected, (state, action) => {
        state.loading.part = false;
        state.error.part = action.payload;
      })
      // Update PC Part
      .addCase(updatePCPart.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
        state.successMessage.update = null;
      })
      .addCase(updatePCPart.fulfilled, (state, action) => {
        state.loading.update = false;
        state.parts = state.parts.map((part) =>
          part.id === action.payload.id ? action.payload : part
        );
        state.successMessage.update = "PC part updated successfully!";
      })
      .addCase(updatePCPart.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.payload;
      })
      // Delete PC Part
      .addCase(deletePCPart.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
        state.successMessage.delete = null;
      })
      .addCase(deletePCPart.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.parts = state.parts.filter((part) => part.id !== action.payload);
        state.successMessage.delete = "PC part deleted successfully!";
      })
      .addCase(deletePCPart.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload;
      })
      // Place PC Part Order
      .addCase(placePCPartOrder.pending, (state) => {
        state.loading.order = true;
        state.error.order = null;
        state.successMessage.order = null;
      })
      .addCase(placePCPartOrder.fulfilled, (state, action) => {
        state.loading.order = false;
        state.successMessage.order = "PC part order placed successfully!";
      })
      .addCase(placePCPartOrder.rejected, (state, action) => {
        state.loading.order = false;
        state.error.order = action.payload;
      });
  },
});

export const { clearPCBError, clearPCBSuccess } = pcbuilderSlice.actions;
export default pcbuilderSlice.reducer;