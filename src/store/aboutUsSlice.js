import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from './api';

// Async thunk to save About Us content
export const saveAboutUs = createAsyncThunk(
  'aboutUs/saveAboutUs',
  async (formData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('authToken');
      const role = state.auth.role || localStorage.getItem('authRole');

      if (!token) {
        return rejectWithValue('No authentication token found.');
      }
      if (role !== 'admin') {
        return rejectWithValue('Admin access required.');
      }

      const response = await axios.post(`${API_BASE_URL}/api/aboutus/save`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Save About Us error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to save About Us');
    }
  }
);

// Async thunk to fetch all About Us entries
export const getAllAboutUs = createAsyncThunk(
  'aboutUs/getAllAboutUs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/aboutus/get`); // all get of about us section
      return response.data;
    } catch (error) {
      console.error('Fetch About Us error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch About Us');
    }
  }
);

// Async thunk to fetch About Us by ID
export const getAboutUsById = createAsyncThunk(
  'aboutUs/getAboutUsById',
  async (id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('authToken');
      const role = state.auth.role || localStorage.getItem('authRole');

      if (!token) {
        return rejectWithValue('No authentication token found.');
      }
      if (role !== 'admin') {
        return rejectWithValue('Admin access required.');
      }

      const response = await axios.get(`${API_BASE_URL}/api/aboutus/get/${id}`, { // about us get by id
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Fetch About Us by ID error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch About Us');
    }
  }
);

// Async thunk to update About Us
export const updateAboutUs = createAsyncThunk(
  'aboutUs/updateAboutUs',
  async ({ id, formData }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('authToken');
      const role = state.auth.role || localStorage.getItem('authRole');

      if (!token) {
        return rejectWithValue('No authentication token found.');
      }
      if (role !== 'admin') {
        return rejectWithValue('Admin access required.');
      }

      const response = await axios.put(`${API_BASE_URL}/api/aboutus/updete/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Update About Us error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to update About Us');
    }
  }
);

// Async thunk to delete About Us
export const deleteAboutUs = createAsyncThunk(
  'aboutUs/deleteAboutUs',
  async (id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('authToken');
      const role = state.auth.role || localStorage.getItem('authRole');

      if (!token) {
        return rejectWithValue('No authentication token found.');
      }
      if (role !== 'admin') {
        return rejectWithValue('Admin access required.');
      }

      await axios.delete(`${API_BASE_URL}/api/aboutus/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id; // Return the deleted ID
    } catch (error) {
      console.error('Delete About Us error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete About Us');
    }
  }
);

const aboutUsSlice = createSlice({
  name: 'aboutUs',
  initialState: {
    aboutUsEntries: [],
    selectedAboutUs: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearAboutUsError: (state) => {
      state.error = null;
    },
    clearAboutUsSuccess: (state) => {
      state.successMessage = null;
    },
    clearSelectedAboutUs: (state) => {
      state.selectedAboutUs = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Save About Us
      .addCase(saveAboutUs.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(saveAboutUs.fulfilled, (state, action) => {
        state.loading = false;
        state.aboutUsEntries = [action.payload, ...state.aboutUsEntries];
        state.successMessage = 'About Us saved successfully!';
      })
      .addCase(saveAboutUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All About Us
      .addCase(getAllAboutUs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAboutUs.fulfilled, (state, action) => {
        state.loading = false;
        state.aboutUsEntries = action.payload;
      })
      .addCase(getAllAboutUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get About Us by ID
      .addCase(getAboutUsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAboutUsById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAboutUs = action.payload;
      })
      .addCase(getAboutUsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update About Us
      .addCase(updateAboutUs.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateAboutUs.fulfilled, (state, action) => {
        state.loading = false;
        state.aboutUsEntries = state.aboutUsEntries.map((entry) =>
          entry.id === action.payload.id ? action.payload : entry
        );
        state.selectedAboutUs = null;
        state.successMessage = 'About Us updated successfully!';
      })
      .addCase(updateAboutUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete About Us
      .addCase(deleteAboutUs.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteAboutUs.fulfilled, (state, action) => {
        state.loading = false;
        state.aboutUsEntries = state.aboutUsEntries.filter((entry) => entry.id !== action.payload);
        state.successMessage = 'About Us deleted successfully!';
      })
      .addCase(deleteAboutUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Refetch entries to restore state
        state.aboutUsEntries = [];
        // Optionally dispatch getAllAboutUs to restore state
      });
  },
});

export const { clearAboutUsError, clearAboutUsSuccess, clearSelectedAboutUs } = aboutUsSlice.actions;
export default aboutUsSlice.reducer;


// features/aboutus/aboutUsSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// const BASE_URL = "http://75.119.134.82:6161/api/aboutus";

// // Async Thunks
// export const createAboutUs = createAsyncThunk('aboutUs/create', async ({ data, token }) => {
//   const response = await axios.post(`${BASE_URL}/save`, data, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   return response.data;
// });

// export const fetchAllAboutUs = createAsyncThunk('aboutUs/fetchAll', async () => {
//   const response = await axios.get(`${BASE_URL}/get`);
//   return response.data;
// });

// export const fetchAboutUsById = createAsyncThunk('aboutUs/fetchById', async (id) => {
//   const response = await axios.get(`${BASE_URL}/get/${id}`);
//   return response.data;
// });

// export const updateAboutUs = createAsyncThunk('aboutUs/update', async ({ id, data, token }) => {
//   const response = await axios.put(`${BASE_URL}/updete/${id}`, data, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   return response.data;
// });

// export const deleteAboutUs = createAsyncThunk('aboutUs/delete', async ({ id, token }) => {
//   await axios.delete(`${BASE_URL}/delete/${id}`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   return id;
// });

// // Slice
// const aboutUsSlice = createSlice({
//   name: 'aboutUs',
//   initialState: {
//     items: [],
//     selected: null,
//     status: 'idle',
//     error: null
//   },
//   reducers: {
//     clearSelected: (state) => {
//       state.selected = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAllAboutUs.fulfilled, (state, action) => {
//         state.items = action.payload;
//       })
//       .addCase(fetchAboutUsById.fulfilled, (state, action) => {
//         state.selected = action.payload;
//       })
//       .addCase(deleteAboutUs.fulfilled, (state, action) => {
//         state.items = state.items.filter(item => item.id !== action.payload);
//       });
//   }
// });

// export const { clearSelected } = aboutUsSlice.actions;
// export default aboutUsSlice.reducer;
