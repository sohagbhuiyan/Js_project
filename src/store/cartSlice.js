// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { createSelector } from 'reselect';
// import { API_BASE_URL } from './api';

// // Helper functions for local storage
// const getUserEmail = (state) => state.auth?.profile?.email || 'guest';
// const getCartForUser = (state) => {
//   const email = getUserEmail(state);
//   return JSON.parse(localStorage.getItem(`cart_${email}`)) || { items: [], count: 0 };
// };
// const saveCartForUser = (state) => {
//   const email = getUserEmail(state);
//   localStorage.setItem(`cart_${email}`, JSON.stringify({ items: state.items, count: state.count }));
// };
// const removeCartForUser = (state) => {
//   const email = getUserEmail(state);
//   localStorage.removeItem(`cart_${email}`);
// };

// // Selectors for memoized state access
// const selectCartState = (state) => state.cart;
// export const selectCartItems = createSelector([selectCartState], (cart) => cart.items);
// export const selectCartCount = createSelector([selectCartState], (cart) => cart.count);
// export const selectCartStatus = createSelector([selectCartState], (cart) => cart.status);
// export const selectCartError = createSelector([selectCartState], (cart) => cart.error);

// // Async thunk for fetching cart items

// export const fetchCartItemsAsync = createAsyncThunk(
//   'cart/fetchCartItemsAsync',
//   async (_, { getState, rejectWithValue }) => {
//     const state = getState();
//     const token = state.auth.token || localStorage.getItem('authToken');
//     const userId = state.auth.profile?.id;

//     if (!userId || !token) {
//       return rejectWithValue('User not authenticated');
//     }

//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/addcart/user/get/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log('fetchCartItems response:', response.data);
//       return response.data || [];
//     } catch (error) {
//       const errorMessage =
//         ("error.response?.data?.message || 'Failed to fetch cart items. Please try again.'");
//       return rejectWithValue(errorMessage);
//     }
//   },
//   {
//     condition: (_, { getState }) => {
//       const { cart } = getState();
//       return cart.status !== 'loading';
//     },
//   }
// );

// // Async thunk for adding regular products to cart
// export const addToCartAsync = createAsyncThunk(
//   'cart/addToCartAsync',
//   async ({ productDetailsId, quantity, name, price, imagea }, { getState, rejectWithValue }) => {
//     const state = getState();
//     const token = state.auth.token || localStorage.getItem('authToken');
//     const userId = state.auth.profile?.id;

//     if (!token || !userId) {
//       return { productDetailsId, quantity, name, price, imagea, isGuest: true };
//     }

//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/api/productdetails/AddTocart/save?userId=${userId}&productDetailsId=${productDetailsId}&quantity=${quantity}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       console.log("\n\n\n addToCart response: ->", response);
//       return { ...response.data, productDetailsId, name, price, imagea };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
//     }
//   }
// );

// // Async thunk for adding PC parts to cart
// export const addPCPartToCartAsync = createAsyncThunk(
//   'cart/addPCPartToCartAsync',
//   async ({ pcforpartadd_id, quantity, name, price, imagea }, { getState, rejectWithValue }) => {
//     const state = getState();
//     const token = state.auth.token || localStorage.getItem('authToken');
//     const userId = state.auth.profile?.id;

//     if (!token || !userId) {
//       return { pcforpartadd_id, quantity, name, price, imagea, isGuest: true };
//     }

//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/api/pcforpart/AddToCart/save?userId=${userId}&pcPartId=${pcforpartadd_id}&quantity=${quantity}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       console.log("\n\n\n addPCPartToCart response: ->", response);
//       return { ...response.data, productId: pcforpartadd_id, name, price, imagea };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to add PC part to cart');
//     }
//   }
// );

// // Async thunk for adding CC Builder items to cart
// export const addCCItemToCartAsync = createAsyncThunk(
//   'cart/addCCItemToCartAsync',
//   async ({ ccBuilderItemDitels, quantity, name, price, imagea }, { getState, rejectWithValue }) => {
//     const state = getState();
//     const token = state.auth.token || localStorage.getItem('authToken');
//     const userId = state.auth.profile?.id;

//     if (!token || !userId) {
//       return { ccBuilderItemDitels, quantity, name, price, imagea, isGuest: true };
//     }

//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/api/ccitembuilder/AddToCart/save?userId=${userId}&CCItemBulderId=${ccBuilderItemDitels}&quantity=${quantity}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       console.log("\n\n\n addCCItemToCart response: ->", response);
//       return { ...response.data, productId: ccBuilderItemDitels, name, price, imagea };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to add CC Builder item to cart');
//     }
//   }
// );

// // Async thunk for removing from cart
// export const removeFromCartAsync = createAsyncThunk(
//   'cart/removeFromCartAsync',
//   async ({ id, productId, productName }, { getState, rejectWithValue }) => {
//     const state = getState();
//     const token = state.auth.token || localStorage.getItem('authToken');

//     if (!token) {
//       return { productId, productName, isGuest: true };
//     }

//     try {
//       await axios.delete(`${API_BASE_URL}/api/addcart/remove/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return { id, productId, productName };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to remove item from cart');
//     }
//   }
// );

// // Async thunk for updating cart item quantity
// export const updateCartQuantityAsync = createAsyncThunk(
//   'cart/updateCartQuantityAsync',
//   async ({ id, quantity }, { getState, rejectWithValue }) => {
//     const state = getState();
//     const token = state.auth.token || localStorage.getItem('authToken');

//     if (!token) {
//       return rejectWithValue('No authentication token found');
//     }

//     try {
//       const response = await axios.put(
//         `${API_BASE_URL}/api/addcart/update/${id}`,
//         { quantity },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return { id, quantity: response.data.quantity };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to update cart quantity');
//     }
//   }
// );

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState: {
//     items: [],
//     count: 0,
//     status: 'idle',
//     error: null,
//   },
//   reducers: {
//     initializeCart: (state, action) => {
//       const cart = getCartForUser(action.payload);
//       state.items = cart.items;
//       state.count = cart.count;
//     },
//     addToCart: (state, action) => {
//       const newItem = action.payload;
//       const existingItem = state.items.find((item) => item.productId === newItem.productId);

//       if (existingItem) {
//         existingItem.quantity += newItem.quantity;
//       } else {
//         state.items.push(newItem);
//       }
//       state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
//       saveCartForUser(state);
//     },
//     removeFromCart: (state, action) => {
//       state.items = state.items.filter((item) => item.productId !== action.payload);
//       state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
//       saveCartForUser(state);
//     },
//     updateQuantity: (state, action) => {
//       const { productId, quantity } = action.payload;
//       const existingItem = state.items.find((item) => item.productId === productId);
//       if (existingItem && quantity >= 1) {
//         existingItem.quantity = quantity;
//         state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
//         saveCartForUser(state);
//       }
//     },
//     clearCart: (state) => {
//       state.items = [];
//       state.count = 0;
//       removeCartForUser(state);
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCartItemsAsync.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(fetchCartItemsAsync.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.items = action.payload.map((item) => ({
//           cartId: item.id,
//           productId: item.productDetails?.id || item.pcForPartAdd?.id || item.ccBuilderItemDitels?.id || item.productDetailsId,
//           name: item.productDetails?.name || item.pcForPartAdd?.name || item.ccBuilderItemDitels?.name || 'Unknown Product',
//           price: item.productDetails[0]?.specialprice || item.productDetails?.regularprice || item.pcForPartAdd?.specialprice || item.pcForPartAdd?.regularprice || item.ccBuilderItemDitels?.specialprice || item.ccBuilderItemDitels?.regularprice || item.price || 0,
//           quantity: item.quantity || 1,
//           imagea: item.productDetails?.imagea || item.pcForPartAdd?.imagea || item.ccBuilderItemDitels?.imagea || item.imagea || '',
//         }));
//         state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
//         saveCartForUser(state);
//       })
//       .addCase(fetchCartItemsAsync.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//         const cart = getCartForUser(state);
//         state.items = cart.items;
//         state.count = cart.count;
//       })
//       .addCase(addToCartAsync.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(addToCartAsync.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         const newItem = action.payload;
//         const localItem = {
//           cartId: newItem.id || newItem.cartId,
//           productId: newItem.productDetailsId || newItem.productId,
//           name: newItem.name || 'Unknown Product',
//           price: newItem.price || 0,
//           quantity: newItem.quantity || 1,
//           imagea: newItem.imagea || '',
//         };

//         if (newItem.isGuest) {
//           const existingItem = state.items.find((item) => item.productId === localItem.productId);
//           if (existingItem) {
//             existingItem.quantity += localItem.quantity;
//           } else {
//             state.items.push(localItem);
//           }
//         } else {
//           const existingItem = state.items.find((item) => item.productId === localItem.productId);
//           if (existingItem) {
//             existingItem.quantity += localItem.quantity;
//             existingItem.cartId = localItem.cartId;
//           } else {
//             state.items.push(localItem);
//           }
//         }

//         state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
//         saveCartForUser(state);
//         toast.success('Item added to cart!', {
//           duration: 2000,
//           style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
//         });
//       })
//       .addCase(addToCartAsync.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//         toast.error(action.payload || 'Failed to add item to cart', { duration: 2000 });
//       })
//       .addCase(addPCPartToCartAsync.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(addPCPartToCartAsync.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         const newItem = action.payload;
//         const localItem = {
//           cartId: newItem.id || newItem.cartId,
//           productId: newItem.productId || newItem.pcforpartadd_id,
//           name: newItem.name || 'Unknown PC Part',
//           price: newItem.price || 0,
//           quantity: newItem.quantity || 1,
//           imagea: newItem.imagea || '',
//         };

//         if (newItem.isGuest) {
//           const existingItem = state.items.find((item) => item.productId === localItem.productId);
//           if (existingItem) {
//             existingItem.quantity += localItem.quantity;
//           } else {
//             state.items.push(localItem);
//           }
//         } else {
//           const existingItem = state.items.find((item) => item.productId === localItem.productId);
//           if (existingItem) {
//             existingItem.quantity += localItem.quantity;
//             existingItem.cartId = localItem.cartId;
//           } else {
//             state.items.push(localItem);
//           }
//         }

//         state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
//         saveCartForUser(state);
//         toast.success('PC Part added to cart!', {
//           duration: 2000,
//           style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
//         });
//       })
//       .addCase(addPCPartToCartAsync.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//         toast.error(action.payload || 'Failed to add PC part to cart', { duration: 2000 });
//       })
//       .addCase(addCCItemToCartAsync.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(addCCItemToCartAsync.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         const newItem = action.payload;
//         const localItem = {
//           cartId: newItem.id || newItem.cartId,
//           productId: newItem.productId || newItem.ccBuilderItemDitels,
//           name: newItem.name || 'Unknown CC Builder Item',
//           price: newItem.price || 0,
//           quantity: newItem.quantity || 1,
//           imagea: newItem.imagea || '',
//         };

//         if (newItem.isGuest) {
//           const existingItem = state.items.find((item) => item.productId === localItem.productId);
//           if (existingItem) {
//             existingItem.quantity += localItem.quantity;
//           } else {
//             state.items.push(localItem);
//           }
//         } else {
//           const existingItem = state.items.find((item) => item.productId === localItem.productId);
//           if (existingItem) {
//             existingItem.quantity += localItem.quantity;
//             existingItem.cartId = localItem.cartId;
//           } else {
//             state.items.push(localItem);
//           }
//         }

//         state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
//         saveCartForUser(state);
//         toast.success('CC Builder Item added to cart!', {
//           duration: 2000,
//           style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
//         });
//       })
//       .addCase(addCCItemToCartAsync.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//         toast.error(action.payload || 'Failed to add CC Builder item to cart', { duration: 2000 });
//       })
//       .addCase(removeFromCartAsync.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(removeFromCartAsync.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         const { id, productName } = action.payload;
//         state.items = state.items.filter((item) => item.cartId !== id);
//         state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
//         saveCartForUser(state);
//         toast.success(`${productName} removed from cart!`, {
//           duration: 2000,
//           style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
//         });
//       })
//       .addCase(removeFromCartAsync.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//         toast.error(action.payload || 'Failed to remove item from cart', { duration: 2000 });
//       })
//       .addCase(updateCartQuantityAsync.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(updateCartQuantityAsync.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         const { id, quantity } = action.payload;
//         const item = state.items.find((item) => item.cartId === id);
//         if (item) {
//           item.quantity = quantity;
//           state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
//           saveCartForUser(state);
//           toast.success('Quantity updated!', {
//             duration: 2000,
//             style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
//           });
//         }
//       })
//       .addCase(updateCartQuantityAsync.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//         toast.error(action.payload || 'Failed to update quantity', { duration: 2000 });
//       });
//   },
// });

// export const { initializeCart, addToCart, removeFromCart, updateQuantity, clearCart, clearError } = cartSlice.actions;
// export default cartSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { createSelector } from 'reselect';
import { API_BASE_URL } from './api';

// Helper functions for local storage
const getUserEmail = (state) => state.auth?.profile?.email || 'guest';
const getCartForUser = (state) => {
  const email = getUserEmail(state);
  return JSON.parse(localStorage.getItem(`cart_${email}`)) || { items: [], count: 0 };
};
const saveCartForUser = (state) => {
  const email = getUserEmail(state);
  localStorage.setItem(`cart_${email}`, JSON.stringify({ items: state.items, count: state.count }));
};
const removeCartForUser = (state) => {
  const email = getUserEmail(state);
  localStorage.removeItem(`cart_${email}`);
};

// Selectors for memoized state access
const selectCartState = (state) => state.cart;
export const selectCartItems = createSelector([selectCartState], (cart) => cart.items);
export const selectCartCount = createSelector([selectCartState], (cart) => cart.count);
export const selectCartStatus = createSelector([selectCartState], (cart) => cart.status);
export const selectCartError = createSelector([selectCartState], (cart) => cart.error);

// Async thunk for fetching cart items
export const fetchCartItemsAsync = createAsyncThunk(
  'cart/fetchCartItemsAsync',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token || localStorage.getItem('authToken');
    const userId = state.auth.profile?.id;

    if (!userId || !token) {
      return rejectWithValue('User not authenticated');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/addcart/user/get/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('fetchCartItems response:', response.data);
      return response.data || [];
    } catch (error) {
      const errorMessage =
        error.response?.status === 401
          ? 'Session expired. Please log in again.'
          : error.response?.data?.message || 'Failed to fetch cart items. Please try again.';
      return rejectWithValue(errorMessage);
    }
  },
  {
    condition: (_, { getState }) => {
      const { cart } = getState();
      return cart.status !== 'loading';
    },
  }
);

// Async thunk for adding regular products to cart
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async ({ productDetailsId, quantity, name, price, imagea }, { getState, rejectWithValue, dispatch }) => {
    const state = getState();
    const token = state.auth.token || localStorage.getItem('authToken');
    const userId = state.auth.profile?.id;

    if (!token || !userId) {
      return { productDetailsId, quantity, name, price, imagea, isGuest: true };
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/productdetails/AddTocart/save?userId=${userId}&productDetailsId=${productDetailsId}&quantity=${quantity}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('addToCart response:', response.data);
      dispatch(fetchCartItemsAsync());
      return { ...response.data, productDetailsId, name, price, imagea };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

// Async thunk for adding PC parts to cart
export const addPCPartToCartAsync = createAsyncThunk(
  'cart/addPCPartToCartAsync',
  async ({ pcforpartadd_id, quantity, name, price, imagea }, { getState, rejectWithValue, dispatch }) => {
    const state = getState();
    const token = state.auth.token || localStorage.getItem('authToken');
    const userId = state.auth.profile?.id;

    if (!token || !userId) {
      return { productId: pcforpartadd_id, quantity, name, price, imagea, isGuest: true };
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/pcforpart/AddToCart/save?userId=${userId}&pcPartId=${pcforpartadd_id}&quantity=${quantity}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('addPCPartToCart response:', response.data);
      dispatch(fetchCartItemsAsync());
      return { ...response.data, productId: pcforpartadd_id, name, price, imagea };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add PC part to cart');
    }
  }
);

// Async thunk for adding CC Builder items to cart
export const addCCItemToCartAsync = createAsyncThunk(
  'cart/addCCItemToCartAsync',
  async ({ ccBuilderItemDitels, quantity, name, price, imagea }, { getState, rejectWithValue, dispatch }) => {
    const state = getState();
    const token = state.auth.token || localStorage.getItem('authToken');
    const userId = state.auth.profile?.id;

    if (!token || !userId) {
      return { productId: ccBuilderItemDitels, quantity, name, price, imagea, isGuest: true };
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/ccitembuilder/AddToCart/save?userId=${userId}&CCItemBulderId=${ccBuilderItemDitels}&quantity=${quantity}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('addCCItemToCart response:', response.data);
      dispatch(fetchCartItemsAsync());
      return { ...response.data, productId: ccBuilderItemDitels, name, price, imagea };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add CC Builder item to cart');
    }
  }
);

// Async thunk for removing from cart
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async ({ id, productId, productName }, { getState, rejectWithValue, dispatch }) => {
    const state = getState();
    const token = state.auth.token || localStorage.getItem('authToken');

    if (!token) {
      return { productId, productName, isGuest: true };
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/addcart/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchCartItemsAsync()); // Background fetch to ensure consistency
      return { id, productId, productName };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item from cart');
    }
  }
);

// Async thunk for updating cart item quantity
export const updateCartQuantityAsync = createAsyncThunk(
  'cart/updateCartQuantityAsync',
  async ({ id, quantity }, { getState, rejectWithValue, dispatch }) => {
    const state = getState();
    const token = state.auth.token || localStorage.getItem('authToken');

    if (!token) {
      return rejectWithValue('No authentication token found');
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/addcart/update/${id}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(fetchCartItemsAsync());
      return { id, quantity: response.data.quantity };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart quantity');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    count: 0,
    status: 'idle',
    error: null,
    pendingRemovals: [], // Track items being removed optimistically
  },
  reducers: {
    initializeCart: (state, action) => {
      const cart = getCartForUser(action.payload);
      state.items = cart.items;
      state.count = cart.count;
    },
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.productId === newItem.productId);

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.items.push(newItem);
      }
      state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
      saveCartForUser(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
      state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
      saveCartForUser(state);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.productId === productId);
      if (existingItem && quantity >= 1) {
        existingItem.quantity = quantity;
        state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
        saveCartForUser(state);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.count = 0;
      state.status = 'idle';
      state.error = null;
      state.pendingRemovals = [];
      removeCartForUser(state);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItemsAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCartItemsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.map((item) => ({
          cartId: item.id,
          productId:
            item.productDetails?.id ||
            item.pcForPartAdd?.id ||
            item.ccBuilderItemDitels?.id ||
            item.productDetailsId ||
            item.pcforpartadd_id ||
            item.ccBuilderItemDitels,
          name:
            item.productDetails?.name ||
            item.pcForPartAdd?.name ||
            item.ccBuilderItemDitels?.name ||
            item.name ||
            'Unknown Product',
          price:
            item.productDetails?.specialprice ||
            item.productDetails?.regularprice ||
            item.pcForPartAdd?.specialprice ||
            item.pcForPartAdd?.regularprice ||
            item.ccBuilderItemDitels?.specialprice ||
            item.ccBuilderItemDitels?.regularprice ||
            item.price ||
            0,
          quantity: item.quantity || 1,
          imagea:
            item.productDetails?.imagea ||
            item.pcForPartAdd?.imagea ||
            item.ccBuilderItemDitels?.imagea ||
            item.imagea ||
            '',
        }));
        state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
        state.pendingRemovals = []; // Clear pending removals after successful fetch
        saveCartForUser(state);
      })
      .addCase(fetchCartItemsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        const cart = getCartForUser(state);
        state.items = cart.items;
        state.count = cart.count;
      })
      .addCase(addToCartAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.isGuest) {
          const newItem = action.payload;
          const localItem = {
            cartId: newItem.id || newItem.cartId,
            productId: newItem.productDetailsId || newItem.productId,
            name: newItem.name || 'Unknown Product',
            price: newItem.price || 0,
            quantity: newItem.quantity || 1,
            imagea: newItem.imagea || '',
          };
          const existingItem = state.items.find((item) => item.productId === localItem.productId);
          if (existingItem) {
            existingItem.quantity += localItem.quantity;
          } else {
            state.items.push(localItem);
          }
          state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
          saveCartForUser(state);
        }
        // For authenticated users, rely on fetchCartItemsAsync
        toast.success('Item added to cart!', {
          duration: 2000,
          style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
        });
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(action.payload || 'Failed to add item to cart', { duration: 2000 });
      })
      .addCase(addPCPartToCartAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addPCPartToCartAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.isGuest) {
          const newItem = action.payload;
          const localItem = {
            cartId: newItem.id || newItem.cartId,
            productId: newItem.productId || newItem.pcforpartadd_id,
            name: newItem.name || 'Unknown PC Part',
            price: newItem.price || 0,
            quantity: newItem.quantity || 1,
            imagea: newItem.imagea || '',
          };
          const existingItem = state.items.find((item) => item.productId === localItem.productId);
          if (existingItem) {
            existingItem.quantity += localItem.quantity;
          } else {
            state.items.push(localItem);
          }
          state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
          saveCartForUser(state);
        }
        toast.success('PC Part added to cart!', {
          duration: 2000,
          style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
        });
      })
      .addCase(addPCPartToCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(action.payload || 'Failed to add PC part to cart', { duration: 2000 });
      })
      .addCase(addCCItemToCartAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addCCItemToCartAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.isGuest) {
          const newItem = action.payload;
          const localItem = {
            cartId: newItem.id || newItem.cartId,
            productId: newItem.productId || newItem.ccBuilderItemDitels,
            name: newItem.name || 'Unknown CC Builder Item',
            price: newItem.price || 0,
            quantity: newItem.quantity || 1,
            imagea: newItem.imagea || '',
          };
          const existingItem = state.items.find((item) => item.productId === localItem.productId);
          if (existingItem) {
            existingItem.quantity += localItem.quantity;
          } else {
            state.items.push(localItem);
          }
          state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
          saveCartForUser(state);
        }
        toast.success('CC Builder Item added to cart!', {
          duration: 2000,
          style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
        });
      })
      .addCase(addCCItemToCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(action.payload || 'Failed to add CC Builder item to cart', { duration: 2000 });
      })
      .addCase(removeFromCartAsync.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        const { id, productId } = action.meta.arg;
        state.pendingRemovals.push(id || productId); // Track pending removal
        // Optimistically remove item from state
        if (action.meta.arg.isGuest) {
          state.items = state.items.filter((item) => item.productId !== productId);
        } else {
          state.items = state.items.filter((item) => item.cartId !== id);
        }
        state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
        saveCartForUser(state);
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id, productId, productName, isGuest } = action.payload;
        // Item already removed optimistically, just clear pending removal
        state.pendingRemovals = state.pendingRemovals.filter((removalId) => removalId !== (id || productId));
        if (isGuest) {
          // For guests, toast here as state is already updated
          toast.success(`${productName} removed from cart!`, {
            duration: 2000,
            style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
          });
        }
        // For authenticated users, fetchCartItemsAsync updates state and shows toast
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        const { id, productId } = action.meta.arg;
        state.pendingRemovals = state.pendingRemovals.filter((removalId) => removalId !== (id || productId));
        // Revert optimistic update by refetching or restoring from local storage
        const cart = getCartForUser(state);
        state.items = cart.items;
        state.count = cart.count;
        saveCartForUser(state);
        toast.error(action.payload || 'Failed to remove item from cart', { duration: 2000 });
      })
      .addCase(updateCartQuantityAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCartQuantityAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Rely on fetchCartItemsAsync to update state
      })
      .addCase(updateCartQuantityAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(action.payload || 'Failed to update quantity', { duration: 2000 });
      });
  },
});

export const { initializeCart, addToCart, removeFromCart, updateQuantity, clearCart, clearError } = cartSlice.actions;
export default cartSlice.reducer;