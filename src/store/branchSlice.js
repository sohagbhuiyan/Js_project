import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from './api';

// Async thunk to save a branch
export const saveBranch = createAsyncThunk(
  'branch/saveBranch',
  async (formData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('authToken');
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }
      const response = await axios.post(`${API_BASE_URL}/api/branches/save`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Save branch error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to save branch');
    }
  }
);

// Async thunk to fetch all branches
export const getAllBranches = createAsyncThunk(
  'branch/getAllBranches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/branches/get/all`);
      return response.data;
    } catch (error) {
      console.error('Fetch branches error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch branches');
    }
  }
);

// Async thunk to fetch a branch by ID
export const getBranchById = createAsyncThunk(
  'branch/getBranchById',
  async (id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('authToken');
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }
      const response = await axios.get(`${API_BASE_URL}/api/branches/getID/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Fetch branch by ID error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch branch');
    }
  }
);

// Async thunk to update a branch
export const updateBranch = createAsyncThunk(
  'branch/updateBranch',
  async ({ id, formData }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('authToken');
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }
      const response = await axios.put(`${API_BASE_URL}/api/branches/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Update branch error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to update branch');
    }
  }
);

// Async thunk to delete a branch
export const deleteBranch = createAsyncThunk(
  'branch/deleteBranch',
  async (id, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('authToken');
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }
      await axios.delete(`${API_BASE_URL}/api/branches/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id; // Return the deleted branch ID
    } catch (error) {
      console.error('Delete branch error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete branch');
    }
  }
);

const branchSlice = createSlice({
  name: 'branch',
  initialState: {
    branches: [],
    selectedBranch: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearBranchError: (state) => {
      state.error = null;
    },
    clearBranchSuccess: (state) => {
      state.successMessage = null;
    },
    clearSelectedBranch: (state) => {
      state.selectedBranch = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Save Branch
      .addCase(saveBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(saveBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = [action.payload, ...state.branches];
        state.successMessage = 'Branch saved successfully!';
      })
      .addCase(saveBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Branches
      .addCase(getAllBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(getAllBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Branch by ID
      .addCase(getBranchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBranchById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBranch = action.payload;
      })
      .addCase(getBranchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Branch
      .addCase(updateBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = state.branches.map((branch) =>
          branch.id === action.payload.id ? action.payload : branch
        );
        state.selectedBranch = null;
        state.successMessage = 'Branch updated successfully!';
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Branch
      .addCase(deleteBranch.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // Optimistic update: remove branch from state immediately
        state.branches = state.branches.filter((branch) => branch.id !== action.meta.arg);
      })
      .addCase(deleteBranch.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Branch deleted successfully!';
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Rollback optimistic update by refetching branches
        state.branches = [];
      });
  },
});

export const { clearBranchError, clearBranchSuccess, clearSelectedBranch } = branchSlice.actions;
export default branchSlice.reducer;