import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from './api';

// Async thunks for API operations
export const saveContactUs = createAsyncThunk(
  'contactUs/save',
  async (contactData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('authToken');
      
      const response = await axios.post(`${API_BASE_URL}/api/contactus/save`, contactData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getContactUs = createAsyncThunk(
  'contactUs/get',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/contactus/get/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllContactUs = createAsyncThunk(
  'contactUs/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/contactus/getall`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateContactUs = createAsyncThunk(
  'contactUs/update',
  async ({ id, contactData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(`${API_BASE_URL}/api/contactus/update/${id}`, contactData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteContactUs = createAsyncThunk(
  'contactUs/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.delete(`${API_BASE_URL}/api/contactus/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { id };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const contactUsSlice = createSlice({
  name: 'contactUs',
  initialState: {
    contacts: [],
    currentContact: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Save Contact
      .addCase(saveContactUs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveContactUs.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts.push(action.payload);
      })
      .addCase(saveContactUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Get Contact
      .addCase(getContactUs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContactUs.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContact = action.payload;
      })
      .addCase(getContactUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Get All Contacts
      .addCase(getAllContactUs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllContactUs.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload;
      })
      .addCase(getAllContactUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Update Contact
      .addCase(updateContactUs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContactUs.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contacts.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
      })
      .addCase(updateContactUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Delete Contact
      .addCase(deleteContactUs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContactUs.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = state.contacts.filter(c => c.id !== action.payload.id);
      })
      .addCase(deleteContactUs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  }
});

export const { clearError } = contactUsSlice.actions;
export default contactUsSlice.reducer;