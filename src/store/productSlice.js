import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from './api';

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/productDetails/getall`);
      return response.data.map(product => ({
        ...product,
        regularprice: Number(product.regularprice),
        specialprice: Number(product.specialprice),
        isPublished: product.isPublished || false, // Ensure isPublished is included
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch related products
export const fetchRelatedProducts = createAsyncThunk(
  'products/fetchRelatedByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/productDetails/byCategory/${categoryId}`);
      return response.data.map(product => ({
        ...product,
        regularprice: Number(product.regularprice),
        specialprice: Number(product.specialprice),
        isPublished: product.isPublished || false,
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to add product
export const addProductDetails = createAsyncThunk(
  'products/addProductDetails',
  async ({ formDataObject, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      const productDetails = {
        ...formDataObject.productDetails,
        isPublished: false, // Set isPublished to false by default
      };
      const jsonBlob = new Blob(
        [JSON.stringify(productDetails)],
        { type: 'application/json' }
      );
      formData.append('productDetails', jsonBlob);
      
      if (formDataObject.imagea) formData.append('imagea', formDataObject.imagea);
      if (formDataObject.imageb) formData.append('imageb', formDataObject.imageb);
      if (formDataObject.imagec) formData.append('imagec', formDataObject.imagec);

      const response = await axios.post(
        `${API_BASE_URL}/api/ProductDetails/save`,
        formData,
        { 
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          } 
        }
      );
      return { 
        ...response.data,
        regularprice: Number(response.data.regularprice),
        specialprice: Number(response.data.specialprice),
        isPublished: false, // Ensure response reflects default
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch single product
export const fetchProductDetailsById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/productDetails/${id}`);
      return {
        ...response.data,
        isPublished: response.data.isPublished || false,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch product ID by product details ID
export const fetchProductIdByDetailsId = createAsyncThunk(
  'products/fetchProductIdByDetailsId',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/productDetails/Product/get/ById/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to update product details
export const updateProductDetails = createAsyncThunk(
  'products/updateProductDetails',
  async ({ id, formDataObject, token }, { rejectWithValue }) => {
    try {
      console.log('Updating product with ID:', id);
      console.log('Form data object:', formDataObject);
      
      const formData = new FormData();
      const productDetails = {
        ...formDataObject.productDetails,
        isPublished: formDataObject.productDetails.isPublished || false, // Preserve isPublished
      };
      const jsonBlob = new Blob(
        [JSON.stringify(productDetails)],
        { type: 'application/json' }
      );
      formData.append('productdetails', jsonBlob);
      
      if (formDataObject.imagea) formData.append('imagea', formDataObject.imagea);
      if (formDataObject.imageb) formData.append('imageb', formDataObject.imageb);
      if (formDataObject.imagec) formData.append('imagec', formDataObject.imagec);

      const response = await axios.put(
        `${API_BASE_URL}/api/ProductDetails/update/${id}`,
        formData,
        { 
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          } 
        }
      );
      
      console.log('Update response:', response.data);
      
      return { 
        id: parseInt(id),
        ...response.data,
        regularprice: Number(response.data.regularprice),
        specialprice: Number(response.data.specialprice),
        isPublished: response.data.isPublished || false,
      };
    } catch (error) {
      console.error('Update error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to delete product details
export const deleteProductDetails = createAsyncThunk(
  'products/deleteProductDetails',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/product/Ditels/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "This product is already in a user's cart! Admin cannot delete it immediately!");
    }
  }
);

// Async thunk to publish product
export const publishProduct = createAsyncThunk(
  'products/publishProduct',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/productDetails/publish/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { id, isPublished: true };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to unpublish product
export const unpublishProduct = createAsyncThunk(
  'products/unpublishProduct',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/productDetails/unpublish/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { id, isPublished: false };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Clear current product action
export const clearCurrentProduct = createAsyncThunk(
  'products/clearCurrentProduct',
  async () => {
    return null;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    currentProduct: null,
    relatedProducts: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearCurrentProduct(state) {
      state.currentProduct = null;
      state.error = null;
      state.successMessage = null;
    },
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.map(product => ({
          ...product,
          imagea: product.imagea ? `${API_BASE_URL}/images/${product.imagea}` : null,
          imageb: product.imageb ? `${API_BASE_URL}/images/${product.imageb}` : null,
          imagec: product.imagec ? `${API_BASE_URL}/images/${product.imagec}` : null,
          regularprice: Number(product.regularprice),
          specialprice: Number(product.specialprice),
          isPublished: product.isPublished || false,
        }));
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Product
      .addCase(addProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Product added successfully';
        state.products.push({
          ...action.payload,
          imagea: action.payload.imagea ? `${API_BASE_URL}/images/${action.payload.imagea}` : null,
          imageb: action.payload.imageb ? `${API_BASE_URL}/images/${action.payload.imageb}` : null,
          imagec: action.payload.imagec ? `${API_BASE_URL}/images/${action.payload.imagec}` : null,
          isPublished: false,
        });
      })
      .addCase(addProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch product by ID (single product)
      .addCase(fetchProductDetailsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetailsById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = {
          ...action.payload,
          imagea: action.payload.imagea ? `${API_BASE_URL}/images/${action.payload.imagea}` : null,
          imageb: action.payload.imageb ? `${API_BASE_URL}/images/${action.payload.imageb}` : null,
          imagec: action.payload.imagec ? `${API_BASE_URL}/images/${action.payload.imagec}` : null,
          isPublished: action.payload.isPublished || false,
        };
      })
      .addCase(fetchProductDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch related products by category
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.relatedProducts = action.payload.map(product => ({
          ...product,
          imagea: product.imagea ? `${API_BASE_URL}/images/${product.imagea}` : null,
          imageb: product.imageb ? `${API_BASE_URL}/images/${product.imageb}` : null,
          imagec: product.imagec ? `${API_BASE_URL}/images/${product.imagec}` : null,
          isPublished: product.isPublished || false,
        }));
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch product ID by details ID
      .addCase(fetchProductIdByDetailsId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductIdByDetailsId.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentProduct) {
          state.currentProduct.product = { id: action.payload };
        }
      })
      .addCase(fetchProductIdByDetailsId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update product
      .addCase(updateProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Product updated successfully';
        
        const updatedProduct = {
          ...action.payload,
          imagea: action.payload.imagea ? `${API_BASE_URL}/images/${action.payload.imagea}` : null,
          imageb: action.payload.imageb ? `${API_BASE_URL}/images/${action.payload.imageb}` : null,
          imagec: action.payload.imagec ? `${API_BASE_URL}/images/${action.payload.imagec}` : null,
          isPublished: action.payload.isPublished || false,
        };
        
        state.products = state.products.map(product =>
          product.id === action.payload.id ? updatedProduct : product
        );
        
        state.currentProduct = updatedProduct;
      })
      .addCase(updateProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete product
      .addCase(deleteProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Product deleted successfully';
        state.products = state.products.filter(product => product.id !== action.payload);
        if (state.currentProduct && state.currentProduct.id === action.payload) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Publish product
      .addCase(publishProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(publishProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Product published successfully';
        state.products = state.products.map(product =>
          product.id === action.payload.id ? { ...product, isPublished: true } : product
        );
        if (state.currentProduct && state.currentProduct.id === action.payload.id) {
          state.currentProduct.isPublished = true;
        }
      })
      .addCase(publishProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Unpublish product
      .addCase(unpublishProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(unpublishProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Product unpublished successfully';
        state.products = state.products.map(product =>
          product.id === action.payload.id ? { ...product, isPublished: false } : product
        );
        if (state.currentProduct && state.currentProduct.id === action.payload.id) {
          state.currentProduct.isPublished = false;
        }
      })
      .addCase(unpublishProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = productSlice.actions;
export default productSlice.reducer;

// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { API_BASE_URL } from './api';

// // Async thunk to fetch products
// export const fetchProducts = createAsyncThunk(
//   'products/fetchAll',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/productDetails/getall`);
//       return response.data.map(product => ({
//         ...product,
//         regularprice: Number(product.regularprice),
//         specialprice: Number(product.specialprice)
//       }));
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// // Async thunk to fetch single product
// export const fetchProductDetailsById = createAsyncThunk(
//   'products/fetchById',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/productDetails/${id}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// // Async thunk to fetch related products
// export const fetchRelatedProducts = createAsyncThunk(
//   'products/fetchRelatedByCategory',
//   async (categoryId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/productDetails/byCategory/${categoryId}`);
//       return response.data.map(product => ({
//         ...product,
//         regularprice: Number(product.regularprice),
//         specialprice: Number(product.specialprice),
//       }));
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );


// // Async thunk to add product
// export const addProductDetails = createAsyncThunk(
//   'products/addProductDetails',
//   async ({ formDataObject, token }, { rejectWithValue }) => {
//     try {
//       const formData = new FormData();
//       const jsonBlob = new Blob(
//         [JSON.stringify(formDataObject.productDetails)],
//         { type: 'application/json' }
//       );
//       formData.append('productDetails', jsonBlob);
//       formData.append('imagea', formDataObject.imagea);
//       formData.append('imageb', formDataObject.imageb);
//       formData.append('imagec', formDataObject.imagec);

//       const response = await axios.post(
//         `${API_BASE_URL}/api/ProductDetails/save`,
//         formData,
//         { 
//           headers: {
//           //  'Content-Type': 'multipart/form-data' ,
//            Authorization: `Bearer ${token}`,
//           } 
//         }
        
//       );
//       return { 
//         ...response.data,
//         regularprice: Number(response.data.regularprice),
//         specialprice: Number(response.data.specialprice)
//       };
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// // Async thunk to fetch single product
// export const fetchProductById = createAsyncThunk(
//   'products/fetchById',
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/productDetails/${id}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// const productSlice = createSlice({
//   name: 'products',
// initialState: {
//   products: [],
//   currentProduct: null,
//   relatedProducts: [],
//   loading: false,
//   error: null,
//   successMessage: null,
// },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Fetch Products
//       .addCase(fetchProducts.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProducts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.products = action.payload.map(product => ({
//             ...product,
//             imagea: product.imagea ? `${API_BASE_URL}/images/${product.imagea}` : '',
//             imageb: product.imageb ? `${API_BASE_URL}/images/${product.imageb}` : '',
//             imagec: product.imagec ? `${API_BASE_URL}/images/${product.imagec}` : '',
//             regularprice: Number(product.regularprice),
//             specialprice: Number(product.specialprice)
//         }));
//     })
//       .addCase(fetchProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Add Product
//       .addCase(addProductDetails.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.successMessage = null;
//       })
//       .addCase(addProductDetails.fulfilled, (state, action) => {
//         state.loading = false;
//         state.successMessage = action.payload;
//         state.products.push(action.payload);
//       })
//       .addCase(addProductDetails.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       //fetch product by Id (single product)
//       .addCase(fetchProductById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.currentProduct = null;
//       })
//       .addCase(fetchProductById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentProduct = action.payload;
//       })
//       .addCase(fetchProductById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//      // Fetch product by ID (single product)
//       .addCase(fetchProductDetailsById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.currentProduct = null;
//       })
//       .addCase(fetchProductDetailsById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentProduct = {
//           ...action.payload,
//           imagea: action.payload.imagea ? `${API_BASE_URL}/images/${action.payload.imagea}` : null,
//           imageb: action.payload.imageb ? `${API_BASE_URL}/images/${action.payload.imageb}` : null,
//           imagec: action.payload.imagec ? `${API_BASE_URL}/images/${action.payload.imagec}` : null,
//         };
//       })
//       .addCase(fetchProductDetailsById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Fetch related products by category
//       .addCase(fetchRelatedProducts.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.relatedProducts = action.payload.map(product => ({
//           ...product,
//           imagea: product.imagea ? `${API_BASE_URL}/images/${product.imagea}` : null,
//           imageb: product.imageb ? `${API_BASE_URL}/images/${product.imageb}` : null,
//           imagec: product.imagec ? `${API_BASE_URL}/images/${product.imagec}` : null,
//         }));
//       })
//       .addCase(fetchRelatedProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default productSlice.reducer;