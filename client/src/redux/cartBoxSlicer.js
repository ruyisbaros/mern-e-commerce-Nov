import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalValue: 0,
};

const cartBoxSlicer = createSlice({
  name: "cartItems",
  initialState,
  reducers: {
    fetchCartItems: (state, action) => {
      state.cartItems = action.payload;
    },
    addToCartItems: (state, action) => {
      state.cartItems = [action.payload, ...state.cartItems];
    },
    removeFromCartItems: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (crt) => crt.id !== action.payload
      );
    },
    getTotalValue: (state, action) => {
      state.totalValue = action.payload;
    },
  },
});

export const {
  fetchCartItems,
  addToCartItems,
  removeFromCartItems,
  getTotalValue,
} = cartBoxSlicer.actions;
export default cartBoxSlicer.reducer;
