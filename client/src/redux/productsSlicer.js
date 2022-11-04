import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

const productsSlicer = createSlice({
  name: "products",
  initialState,
  reducers: {
    fetchProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { fetchProducts } = productsSlicer.actions;
export default productsSlicer.reducer;
