
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { API_BASE_URL } from './api';

// Fetch Categories
export const fetchCategories = createAsyncThunk('categories/fetch', async () => {
  const response = await api.get(`${API_BASE_URL}/api/catagories/get`);
  return response.data;
});

// Add Category with token
export const addCategory = createAsyncThunk(
  'categories/add',
  async ({ name, token }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${API_BASE_URL}/api/catagories/save`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Adding category failed');
    }
  }
);

// Add Item (Product) with token
export const addItem = createAsyncThunk(
  'categories/addItem',
  async ({ itemName, categoryId, token, categories }, { rejectWithValue }) => {
    try {
      // Find the selected category
      const selectedCategory = categories.find(
        (cat) => String(cat.id) === String(categoryId)
      );

      if (!selectedCategory) {
        return rejectWithValue('Selected category not found.');
      }

      // Build product JSON
      const productData = {
        name: itemName,
        catagory: {
          id: selectedCategory.id,
          name: selectedCategory.name,
        },
      };

      const response = await api.post(
        `${API_BASE_URL}/api/Product/save`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Adding item failed');
    }
  }
);

// Fetch Categories and Products with Submenu Structure
export const fetchCategoriesAndProducts = createAsyncThunk(
  'categories/fetchCategoriesAndProducts',
  async (_, { rejectWithValue }) => {
    try {
      const [catRes, prodRes] = await Promise.all([
        api.get(`${API_BASE_URL}/api/catagories/get`),
        api.get(`${API_BASE_URL}/api/Product/getall`),
      ]);

      const categories = catRes.data;
      const products = prodRes.data;

      if (!Array.isArray(categories) || !Array.isArray(products)) {
        return rejectWithValue('API did not return arrays');
      }

      const categoriesWithProducts = categories.map((category) => ({
        ...category,
        path: `/collections?category=${encodeURIComponent(category.name)}`,
        subMenu: products
          .filter((product) => product.catagory?.id === category.id)
          .map((product) => ({
            name: product.name,
            path: `/collections?category=${encodeURIComponent(category.name)}&product=${encodeURIComponent(product.product?.name || product.name)}`,
          })),
      }));

      return categoriesWithProducts;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Fetching categories and products failed');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: { items: [], categoriesWithSub: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addItem.fulfilled, (state, action) => {
        // Refresh products after adding
        // Note: Actual refresh happens in component via dispatch
      })
      .addCase(addItem.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add item';
      })
      .addCase(fetchCategoriesAndProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesAndProducts.fulfilled, (state, action) => {
        state.categoriesWithSub = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategoriesAndProducts.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch categories and products';
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;

