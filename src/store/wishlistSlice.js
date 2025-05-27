
import { createSlice } from "@reduxjs/toolkit";

const loadFromLocalStorage = (userId) => {
  try {
    const key = userId ? `wishlist_${userId}` : "wishlist_anonymous";
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading wishlist from localStorage", error);
    return [];
  }
};

const saveToLocalStorage = (items, userId) => {
  try {
    const key = userId ? `wishlist_${userId}` : "wishlist_anonymous";
    localStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving wishlist to localStorage", error);
  }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
  },
  reducers: {
    initializeWishlist: (state, action) => {
      state.items = loadFromLocalStorage(action.payload.userId);
    },
    addToWishlist: (state, action) => {
      const { userId, ...product } = action.payload;
      const exists = state.items.find(item => item.id === product.id);
      if (!exists) {
        state.items.push(product);
        saveToLocalStorage(state.items, userId);
      }
    },
    removeFromWishlist: (state, action) => {
      const { userId, id } = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      saveToLocalStorage(state.items, userId);
    },
    clearWishlist: (state, action) => {
      state.items = [];
      saveToLocalStorage(state.items, action.payload.userId);
    },
  },
});

export const { initializeWishlist, addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;