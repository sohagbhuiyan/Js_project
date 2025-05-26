// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { API_BASE_URL } from './api';

// // Helper functions for local storage
// const getUserEmail = (state) => {
//   return state.auth?.profile?.email || 'guest';
// };

// const getCartForUser = (state) => {
//   const email = getUserEmail(state);
//   const cart = JSON.parse(localStorage.getItem(`cart_${email}`)) || { items: [], count: 0 };
//   return cart;
// };

// const saveCartForUser = (state) => {
//   const email = getUserEmail(state);
//   const cart = { items: state.items, count: state.count };
//   localStorage.setItem(`cart_${email}`, JSON.stringify(cart));
// };

// const removeCartForUser = (state) => {
//   const email = getUserEmail(state);
//   localStorage.removeItem(`cart_${email}`);
// };

// // Async thunk for fetching cart items
// export const fetchCartItemsAsync = createAsyncThunk(
//   'cart/fetchCartItemsAsync',
//   async (_, { getState, rejectWithValue }) => {
//     const state = getState();
//     const token = state.auth.token || localStorage.getItem('authToken');
//     const userId = state.auth.profile?.id;
//     console.log("id and token: ", userId, token)
//     if (!userId || !token) {
//       return rejectWithValue('User not authenticated');
//     }

//     try {
//       const response = await axios.get(
//         `${API_BASE_URL}/api/addcart/user/get/${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log("here is the response: ", response)
//       return response.data || [];
//     } catch (error) {
//       console.log("Failed", error)
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart items');
//     }
//   },
//   {
//     condition: (_, { getState }) => {
//       const { cart } = getState();
//       if (cart.status === 'loading') {
//         return false;
//       }
//       return true;
//     },
//   }
// );

// // Async thunk for adding to cart
// export const addToCartAsync = createAsyncThunk(
//   'cart/addToCartAsync',
//   async ({ productDetailsId, quantity, name, price, imagea }, { getState, rejectWithValue }) => {
   
//     const state = getState();
//     const token = state.auth.token || localStorage.getItem('authToken');
//     const profile = state.auth.profile;
//     const userId = profile?.id;

//     if (!token || !profile?.email || !userId) {
//       return { productDetailsId, quantity, name, price, imagea, isGuest: true };
//     }

//     try {
//       console.log("top \n\n\n", `${API_BASE_URL}/api/productdetails/AddTocart/save?userId=${userId}&productDetailsId=${productDetailsId}&quantity=${quantity}`)
//       const response = await axios.post(
//         `${API_BASE_URL}/api/productdetails/AddTocart/save?userId=${userId}&productDetailsId=${productDetailsId}&quantity=${quantity}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log("bottom")
//       return { ...response.data, name, price, imagea };
//     } catch (error) {
//       console.log("error", error)
//       return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
//     }
//   }
// );

// // Async thunk for removing from cart
// export const removeFromCartAsync = createAsyncThunk(
//   'cart/removeFromCartAsync',
//   async ({ id, productId, productName }, { getState, rejectWithValue }) => {
//     const state = getState();
//     const token = state.auth.token || localStorage.getItem('authToken');
//     console.log("sohag");

//     if (!token) {
//       return rejectWithValue('No authentication token found');
//     }

//     try {
//       await axios.delete(`${API_BASE_URL}/api/addcart/remove/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return { productId, productName };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to remove item from cart');
//     }
//   }
// );

// // Async thunk for updating cart item quantity
// export const updateCartQuantityAsync = createAsyncThunk(
//   'cart/updateCartQuantityAsync',
//   async ({ cartId, quantity }, { getState, rejectWithValue }) => {
//     const state = getState();
//     const token = state.auth.token || localStorage.getItem('authToken');

//     if (!token) {
//       return rejectWithValue('No authentication token found');
//     }

//     try {
//       const response = await axios.put(
//         `${API_BASE_URL}/api/addcart/update/${cartId}`,
//         { quantity },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return { cartId, quantity: response.data.quantity };
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
//           productId: item.productDetails?.id || item.productDetailsId,
//           name: item.productDetails?.name || 'Unknown Product',
//           price: item.productDetails?.specialprice || item.productDetails?.regularprice || 0,
//           quantity: item.quantity || 1,
//           imagea: item.productDetails?.imagea || item.imagea || '',
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
//         state.status = "succeeded";
//         const newItem = action.payload;
//         const localItem = {
//           cartId: newItem.id || newItem.cartId, // Adjust based on backend response
//           productId: newItem.productDetailsId || newItem.productId,
//           name: newItem.name || "Unknown Product",
//           price: newItem.price || 0,
//           quantity: newItem.quantity || 1,
//           imagea: newItem.imagea || "",
//         };

//         const existingItem = state.items.find((item) => item.productId === localItem.productId);

//         if (existingItem) {
//           existingItem.quantity += localItem.quantity;
//           existingItem.cartId = localItem.cartId;
//         } else {
//           state.items.push(localItem);
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

//         const newItem = action.meta.arg;
//         const localItem = {
//           productId: newItem.productDetailsId,
//           name: newItem.name || 'Unknown Product',
//           price: newItem.price || 0,
//           quantity: newItem.quantity,
//           imagea: newItem.imagea || '',
//         };

//         const existingItem = state.items.find((item) => item.productId === localItem.productId);

//         if (existingItem) {
//           existingItem.quantity += localItem.quantity;
//         } else {
//           state.items.push(localItem);
//         }

//         state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
//         saveCartForUser(state);
//       })
//       .addCase(removeFromCartAsync.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(removeFromCartAsync.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         const { productId, productName } = action.payload;
//         state.items = state.items.filter((item) => item.productId !== productId);
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
//         toast.error(action.payload || 'Failed to remove item from cart', {
//           duration: 2000,
//           style: { background: '#EF4444', color: '#FFFFFF', fontWeight: 'bold' },
//         });
//       })
//       .addCase(updateCartQuantityAsync.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(updateCartQuantityAsync.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         const { cartId, quantity } = action.payload;
//         const item = state.items.find((item) => item.cartId === cartId);
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
//         toast.error(action.payload || 'Failed to update quantity', {
//           duration: 2000,
//           style: { background: '#EF4444', color: '#FFFFFF', fontWeight: 'bold' },
//         });
//       });
//   },
// });

// export const { initializeCart, addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
// export default cartSlice.reducer;

//-----------------
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
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
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart items');
    }
  },
  {
    condition: (_, { getState }) => {
      const { cart } = getState();
      return cart.status !== 'loading';
    },
  }
);

// Async thunk for adding to cart
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async ({ productDetailsId, quantity, name, price, imagea }, { getState, rejectWithValue }) => {
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
      return { ...response.data, productDetailsId, name, price, imagea };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

// Async thunk for removing from cart
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async ({ id, productId, productName }, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token || localStorage.getItem('authToken');

    if (!token) {
      return { productId, productName, isGuest: true };
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/addcart/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { id, productId, productName };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item from cart');
    }
  }
);

// Async thunk for updating cart item quantity
export const updateCartQuantityAsync = createAsyncThunk(
  'cart/updateCartQuantityAsync',
  async ({ id, quantity }, { getState, rejectWithValue }) => {
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
          productId: item.productDetails?.id || item.productDetailsId,
          name: item.productDetails?.name || 'Unknown Product',
          price: item.productDetails?.specialprice || item.productDetails?.regularprice || 0,
          quantity: item.quantity || 1,
          imagea: item.productDetails?.imagea || item.imagea || '',
        }));
        state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
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
        const newItem = action.payload;
        const localItem = {
          cartId: newItem.id || newItem.cartId,
          productId: newItem.productDetailsId || newItem.productId,
          name: newItem.name || 'Unknown Product',
          price: newItem.price || 0,
          quantity: newItem.quantity || 1,
          imagea: newItem.imagea || '',
        };

        if (newItem.isGuest) {
          const existingItem = state.items.find((item) => item.productId === localItem.productId);
          if (existingItem) {
            existingItem.quantity += localItem.quantity;
          } else {
            state.items.push(localItem);
          }
        } else {
          const existingItem = state.items.find((item) => item.productId === localItem.productId);
          if (existingItem) {
            existingItem.quantity += localItem.quantity;
            existingItem.cartId = localItem.cartId;
          } else {
            state.items.push(localItem);
          }
        }

        state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
        saveCartForUser(state);
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
      .addCase(removeFromCartAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { productId, productName } = action.payload;
        state.items = state.items.filter((item) => item.productId !== productId);
        state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
        saveCartForUser(state);
        toast.success(`${productName} removed from cart!`, {
          duration: 2000,
          style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
        });
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(action.payload || 'Failed to remove item from cart', { duration: 2000 });
      })
      .addCase(updateCartQuantityAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCartQuantityAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { cartId, quantity } = action.payload;
        const item = state.items.find((item) => item.cartId === cartId);
        if (item) {
          item.quantity = quantity;
          state.count = state.items.reduce((acc, item) => acc + item.quantity, 0);
          saveCartForUser(state);
          toast.success('Quantity updated!', {
            duration: 2000,
            style: { background: '#10B981', color: '#FFFFFF', fontWeight: 'bold' },
          });
        }
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