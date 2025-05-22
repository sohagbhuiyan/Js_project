
// store/wishlistSlice.js
import { createSlice } from "@reduxjs/toolkit";

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem("wishlist");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading wishlist from localStorage", error);
    return [];
  }
};

const saveToLocalStorage = (items) => {
  try {
    localStorage.setItem("wishlist", JSON.stringify(items));
  } catch (error) {
    console.error("Error saving wishlist to localStorage", error);
  }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: loadFromLocalStorage(),
  },
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.find(item => item.name === action.payload.name);
      if (!exists) {
        state.items.push(action.payload);
        saveToLocalStorage(state.items);
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(item => item.name !== action.payload);
      saveToLocalStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveToLocalStorage(state.items);
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
