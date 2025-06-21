import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../api';

// Async thunk to fetch filtered desktops
export const fetchFilteredDesktops = createAsyncThunk(
  'allfilter/fetchFilteredDesktops',
  async (filters, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.processorbrand) queryParams.append('processorbrand', filters.processorbrand);
      if (filters.generation) queryParams.append('generation', filters.generation);
      if (filters.processortype) queryParams.append('processortype', filters.processortype);
      if (filters.warranty) queryParams.append('warranty', filters.warranty);
      if (filters.displaysizerange) queryParams.append('displaysizerange', filters.displaysizerange);
      if (filters.ram) queryParams.append('ram', filters.ram);
      if (filters.graphicsmemory) queryParams.append('graphicsmemory', filters.graphicsmemory);
      if (filters.operatingsystem) queryParams.append('operatingsystem', filters.operatingsystem);
      if (filters.color) queryParams.append('color', filters.color);
      if (filters.brandName) queryParams.append('brandName', filters.brandName);

      const response = await fetch(
        `${API_BASE_URL}/api/desktoppcall/filter?${queryParams.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch filtered desktops');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch filtered laptops
export const fetchFilteredLaptops = createAsyncThunk(
  'allfilter/fetchFilteredLaptops',
  async (filters, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.generation) queryParams.append('generation', filters.generation);
      if (filters.processortype) queryParams.append('processortype', filters.processortype);
      if (filters.warranty) queryParams.append('warranty', filters.warranty);
      if (filters.displaysizerange) queryParams.append('displaysizerange', filters.displaysizerange);
      if (filters.ram) queryParams.append('ram', filters.ram);
      if (filters.graphicsmemory) queryParams.append('graphicsmemory', filters.graphicsmemory);
      if (filters.operatingsystem) queryParams.append('operatingsystem', filters.operatingsystem);
      if (filters.color) queryParams.append('color', filters.color);
      if (filters.weightrange) queryParams.append('weightrange', filters.weightrange);
      if (filters.fingerprintsensor) queryParams.append('fingerprintsensor', filters.fingerprintsensor);
      if (filters.lan) queryParams.append('lan', filters.lan);
      if (filters.graphicschipset) queryParams.append('graphicschipset', filters.graphicschipset);
      if (filters.maxramsupport) queryParams.append('maxramsupport', filters.maxramsupport);
      if (filters.touchscreen) queryParams.append('touchscreen', filters.touchscreen);
      if (filters.displayresolutionrange) queryParams.append('displayresolutionrange', filters.displayresolutionrange);
      if (filters.regularprice) queryParams.append('regularprice', filters.regularprice);

      const response = await fetch(
        `${API_BASE_URL}/api/alllaptop/filter?${queryParams.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch filtered laptops');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch filtered printers
export const fetchFilteredPrinters = createAsyncThunk(
  'allfilter/fetchFilteredPrinters',
  async (filters, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.printspeed) queryParams.append('printspeed', filters.printspeed);
      if (filters.printwidth) queryParams.append('printwidth', filters.printwidth);
      if (filters.printresolution) queryParams.append('printresolution', filters.printresolution);
      if (filters.interfaces) queryParams.append('interfaces', filters.interfaces);
      if (filters.bodycolor) queryParams.append('bodycolor', filters.bodycolor);
      if (filters.regularprice) queryParams.append('regularprice', filters.regularprice);
      if (filters.warranty) queryParams.append('warranty', filters.warranty);
      if (filters.catagoryName) queryParams.append('catagoryName', filters.catagoryName);
      if (filters.productName) queryParams.append('productName', filters.productName);
      if (filters.brandName) queryParams.append('brandName', filters.brandName);
      if (filters.productItemName) queryParams.append('productItemName', filters.productItemName);

      const response = await fetch(
        `${API_BASE_URL}/api/allprinter/filter?${queryParams.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch filtered printers');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch filtered cameras
export const fetchFilteredCameras = createAsyncThunk(
  'allfilter/fetchFilteredCameras',
  async (filters, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.name) queryParams.append('name', filters.name);
      if (filters.totalpixel) queryParams.append('totalpixel', filters.totalpixel);
      if (filters.displaysize) queryParams.append('displaysize', filters.displaysize);
      if (filters.digitalzoom) queryParams.append('digitalzoom', filters.digitalzoom);
      if (filters.opticalzoom) queryParams.append('opticalzoom', filters.opticalzoom);
      if (filters.regularprice) queryParams.append('regularprice', filters.regularprice);
      if (filters.specialprice) queryParams.append('specialprice', filters.specialprice);
      if (filters.warranty) queryParams.append('warranty', filters.warranty);
      if (filters.brandName) queryParams.append('brandName', filters.brandName);
      if (filters.catagoryName) queryParams.append('catagoryName', filters.catagoryName);
      if (filters.productName) queryParams.append('productName', filters.productName);
      if (filters.productItemName) queryParams.append('productItemName', filters.productItemName);

      const response = await fetch(
        `${API_BASE_URL}/api/allcamera/filter?${queryParams.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch filtered cameras');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch filtered networks
export const fetchFilteredNetworks = createAsyncThunk(
  'allfilter/fetchFilteredNetworks',
  async (filters, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.portside) queryParams.append('portside', filters.portside);
      if (filters.color) queryParams.append('color', filters.color);
      if (filters.regularprice) queryParams.append('regularprice', filters.regularprice);
      if (filters.warranty) queryParams.append('warranty', filters.warranty);
      if (filters.brandName) queryParams.append('brandName', filters.brandName);
      if (filters.catagoryName) queryParams.append('catagoryName', filters.catagoryName);
      if (filters.productName) queryParams.append('productName', filters.productName);
      if (filters.productItemName) queryParams.append('productItemName', filters.productItemName);

      const response = await fetch(
        `${API_BASE_URL}/api/allnetwork/filter?${queryParams.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch filtered networks');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const allfilterSlice = createSlice({
  name: 'allfilter',
  initialState: {
    filteredDesktops: [],
    filteredLaptops: [],
    filteredPrinters: [],
    filteredCameras: [],
    filteredNetworks: [],
    filters: {
      processorbrand: '',
      generation: '',
      processortype: '',
      warranty: '',
      displaysizerange: '',
      ram: '',
      graphicsmemory: '',
      operatingsystem: '',
      color: '',
      brandName: '',
      weightrange: '',
      fingerprintsensor: '',
      lan: '',
      graphicschipset: '',
      maxramsupport: '',
      touchscreen: '',
      displayresolutionrange: '',
      regularprice: '',
      type: '',
      printspeed: '',
      printwidth: '',
      printresolution: '',
      interfaces: '',
      bodycolor: '',
      catagoryName: '',
      productName: '',
      productItemName: '',
      name: '',
      totalpixel: '',
      displaysize: '',
      digitalzoom: '',
      opticalzoom: '',
      specialprice: '',
      portside: '',
    },
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        processorbrand: '',
        generation: '',
        processortype: '',
        warranty: '',
        displaysizerange: '',
        ram: '',
        graphicsmemory: '',
        operatingsystem: '',
        color: '',
        brandName: '',
        weightrange: '',
        fingerprintsensor: '',
        lan: '',
        graphicschipset: '',
        maxramsupport: '',
        touchscreen: '',
        displayresolutionrange: '',
        regularprice: '',
        type: '',
        printspeed: '',
        printwidth: '',
        printresolution: '',
        interfaces: '',
        bodycolor: '',
        catagoryName: '',
        productName: '',
        productItemName: '',
        name: '',
        totalpixel: '',
        displaysize: '',
        digitalzoom: '',
        opticalzoom: '',
        specialprice: '',
        portside: '',
      };
      state.filteredDesktops = [];
      state.filteredLaptops = [];
      state.filteredPrinters = [];
      state.filteredCameras = [];
      state.filteredNetworks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Desktop filtering
      .addCase(fetchFilteredDesktops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredDesktops.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredDesktops = action.payload;
      })
      .addCase(fetchFilteredDesktops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Laptop filtering
      .addCase(fetchFilteredLaptops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredLaptops.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredLaptops = action.payload;
      })
      .addCase(fetchFilteredLaptops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Printer filtering
      .addCase(fetchFilteredPrinters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredPrinters.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredPrinters = action.payload;
      })
      .addCase(fetchFilteredPrinters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Camera filtering
      .addCase(fetchFilteredCameras.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredCameras.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredCameras = action.payload;
      })
      .addCase(fetchFilteredCameras.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Network filtering
      .addCase(fetchFilteredNetworks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredNetworks.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredNetworks = action.payload;
      })
      .addCase(fetchFilteredNetworks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, resetFilters } = allfilterSlice.actions;
export default allfilterSlice.reducer;
