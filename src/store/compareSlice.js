// src/store/compareSlice.js
import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// Load initial state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("compare");
    if (serializedState === null) {
      return {
        items: [],
        maxItems: 4
      };
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn("Failed to load compare state:", e);
    return {
      items: [],
      maxItems: 4
    };
  }
};

const initialState = loadState();

const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    addToCompare: (state, action) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (exists) {
        toast.error("Product already in comparison");
        return;
      }
      if (state.items.length >= state.maxItems) {
        toast.error(`Maximum ${state.maxItems} products for comparison`);
        return;
      }
      state.items.push(action.payload);
      toast.success("Added to comparison");
      // Save to localStorage
      localStorage.setItem("compare", JSON.stringify(state));
    },
    removeFromCompare: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem("compare", JSON.stringify(state));
    },
    clearCompare: (state) => {
      state.items = [];
      localStorage.setItem("compare", JSON.stringify(state));
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions;
export default compareSlice.reducer;
