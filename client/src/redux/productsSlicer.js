import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

const productsSlicer = createSlice({
  name: "products",
  initialState,
  reducers: {
    getProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { getProducts } = productsSlicer.actions;
export default productsSlicer.reducer;
