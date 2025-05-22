import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "./api";

// Async thunk to fetch all PC components
export const fetchPCComponents = createAsyncThunk(
  "pcBuilder/fetchPCComponents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/PcBuilder/Allget`, {
      });

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

      const response = await axios.get(`${API_BASE_URL}/api/PcForPartAdd/getPcBuilder/Byid/${id}`, {
       
      });

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
   
      const response = await axios.get(`${API_BASE_URL}/api/PcForPartAdd/get`, {
       
      });

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
   
      const response = await axios.get(`${API_BASE_URL}/api/PcForPartAdd/get/${id}`, {
      });
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

const pcbuilderSlice = createSlice({
  name: "pcBuilder",
  initialState: {
    components: [],
    parts: [],
    categoryParts: [],
    currentPart: null, // Added to store single part
    loading: { component: false, part: false, categoryParts: false },
    error: { component: null, part: null, categoryParts: null },
    successMessage: { component: null, part: null },
  },
  reducers: {
    clearPCBError: (state) => {
      state.error.component = null;
      state.error.part = null;
      state.error.categoryParts = null;
    },
    clearPCBSuccess: (state) => {
      state.successMessage.component = null;
      state.successMessage.part = null;
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
        state.currentPart = null; // Reset currentPart
      })
      .addCase(fetchPCPartsById.fulfilled, (state, action) => {
        state.loading.part = false;
        state.currentPart = action.payload; // Store in currentPart
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
      });
  },
});

export const { clearPCBError, clearPCBSuccess } = pcbuilderSlice.actions;
export default pcbuilderSlice.reducer;
