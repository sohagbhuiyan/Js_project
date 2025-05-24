import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { API_BASE_URL } from './api';

// Fetch Categories
export const fetchCategories = createAsyncThunk('categories/fetch', async () => {
  const response = await api.get(`${API_BASE_URL}/api/catagories/get`);
  return response.data;
});

// Fetch Category by ID
export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/api/catagories/get/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Fetching category failed');
    }
  }
);

// Fetch Products by Category
export const fetchProductsByCategory = createAsyncThunk(
  'categories/fetchProductsByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/api/catagorybyproduct/id?catagoryId=${categoryId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Fetching products failed');
    }
  }
);

// Fetch Product by ID
export const fetchProductById = createAsyncThunk(
  'categories/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/api/Product/get/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Fetching product failed');
    }
  }
);

// Fetch Product Item by ID
export const fetchProductItemById = createAsyncThunk(
  'categories/fetchProductItemById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/api/product/items/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Fetching product item failed');
    }
  }
);

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

// Update Category with token
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, name, token }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `${API_BASE_URL}/api/catagories/update/${id}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Updating category failed');
    }
  }
);

// Add Product with token
export const addProduct = createAsyncThunk(
  'categories/addProduct',
  async ({ productName, categoryId, token, categories }, { rejectWithValue }) => {
    try {
      const selectedCategory = categories.find((cat) => String(cat.id) === String(categoryId));
      if (!selectedCategory) {
        return rejectWithValue('Selected category not found.');
      }

      const productData = {
        name: productName,
        catagory: { id: selectedCategory.id },
      };

      const response = await api.post(
        `${API_BASE_URL}/api/Product/save`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Adding product failed');
    }
  }
);

// Update Product with token
export const updateProduct = createAsyncThunk(
  'categories/updateProduct',
  async ({ id, name, categoryId, token, categories }, { rejectWithValue }) => {
    try {
      const selectedCategory = categories.find((cat) => String(cat.id) === String(categoryId));
      if (!selectedCategory) {
        return rejectWithValue('Selected category not found.');
      }

      const productData = {
        name,
        catagory: { id: selectedCategory.id },
      };

      const response = await api.put(
        `${API_BASE_URL}/api/Product/update/${id}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Updating product failed');
    }
  }
);

// Add Item (Product Item) with token
export const addItem = createAsyncThunk(
  'categories/addItem',
  async ({ itemName, categoryId, productId, token, categories, products }, { rejectWithValue }) => {
    try {
      const selectedCategory = categories.find((cat) => String(cat.id) === String(categoryId));
      const selectedProduct = products.find((prod) => String(prod.id) === String(productId));

      if (!selectedCategory || !selectedProduct) {
        return rejectWithValue('Selected category or product not found.');
      }

      const itemData = {
        productitemname: itemName,
        catagory: { id: selectedCategory.id },
        product: { id: selectedProduct.id },
      };

      const response = await api.post(
        `${API_BASE_URL}/api/product/items/save`,
        itemData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Adding item failed');
    }
  }
);

// Update Item (Product Item) with token
export const updateProductItem = createAsyncThunk(
  'categories/updateProductItem',
  async ({ id, itemName, categoryId, productId, token, categories, products }, { rejectWithValue }) => {
    try {
      const selectedCategory = categories.find((cat) => String(cat.id) === String(categoryId));
      const selectedProduct = products.find((prod) => String(prod.id) === String(productId));

      if (!selectedCategory || !selectedProduct) {
        return rejectWithValue('Selected category or product not found.');
      }

      const itemData = {
        productitemname: itemName,
        catagory: { id: selectedCategory.id },
        product: { id: selectedProduct.id },
      };

      const response = await api.put(
        `${API_BASE_URL}/api/product/items/update/${id}`,
        itemData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Updating product item failed');
    }
  }
);

// Fetch Categories, Products, and Items for Mega Menu
export const fetchCategoriesAndProducts = createAsyncThunk(
  'categories/fetchCategoriesAndProducts',
  async (_, { rejectWithValue }) => {
    try {
      const [catRes, prodRes, itemRes] = await Promise.all([
        api.get(`${API_BASE_URL}/api/catagories/get`),
        api.get(`${API_BASE_URL}/api/Product/getall`),
        api.get(`${API_BASE_URL}/api/product/items/get`),
      ]);

      const categories = catRes.data;
      const products = prodRes.data;
      const items = itemRes.data;

      if (!Array.isArray(categories) || !Array.isArray(products) || !Array.isArray(items)) {
        return rejectWithValue('API did not return arrays');
      }

      const categoriesWithProductsAndItems = categories.map((category) => ({
        ...category,
        path: `/collections?category=${encodeURIComponent(category.name)}`,
        products: products
          .filter((product) => product.catagory?.id === category.id)
          .map((product) => ({
            ...product,
            path: `/collections?category=${encodeURIComponent(category.name)}&product=${encodeURIComponent(product.name)}`,
            items: items
              .filter((item) => item.product?.id === product.id && item.catagory?.id === category.id)
              .map((item) => ({
                name: item.productitemname,
                path: `/collections?category=${encodeURIComponent(category.name)}&product=${encodeURIComponent(product.name)}&item=${encodeURIComponent(item.productitemname)}`,
              })),
          })),
      }));

      return categoriesWithProductsAndItems;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Fetching data failed');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [], // Categories
    products: [], // Products for selected category
    categoriesWithSub: [], // Mega menu data
    selectedCategory: null, // Single category
    selectedProduct: null, // Single product
    selectedProductItem: null, // Single product item
    loading: false,
    error: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.products = [];
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearSelectedProductItem: (state) => {
      state.selectedProductItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch category';
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch products';
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch product';
      })
      .addCase(fetchProductItemById.fulfilled, (state, action) => {
        state.selectedProductItem = action.payload;
      })
      .addCase(fetchProductItemById.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch product item';
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        state.selectedCategory = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update category';
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        // Refresh happens in component
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add product';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.selectedProduct = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update product';
      })
      .addCase(addItem.fulfilled, (state, action) => {
        // Refresh happens in component
      })
      .addCase(addItem.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add item';
      })
      .addCase(updateProductItem.fulfilled, (state, action) => {
        state.selectedProductItem = null;
      })
      .addCase(updateProductItem.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update product item';
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

export const { clearProducts, clearSelectedCategory, clearSelectedProduct, clearSelectedProductItem } = categorySlice.actions;
export default categorySlice.reducer;