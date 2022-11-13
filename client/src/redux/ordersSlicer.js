import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myOrders: [],
  totalValue: 0,
};

const cartBoxSlicer = createSlice({
  name: "myOrders",
  initialState,
  reducers: {
    fetchMyOrders: (state, action) => {
      state.myOrders = action.payload;
    },
    addToMyOrders: (state, action) => {
      state.myOrders = [action.payload, ...state.myOrders];
    },
    removeFromMyOrders: (state, action) => {
      state.myOrders = state.myOrders.filter(
        (ord) => ord._id !== action.payload
      );
    },
    removeAllOrders: (state, action) => {
      state.myOrders = [];
    },
    getTotalValue: (state, action) => {
      state.totalValue = action.payload;
    },
  },
});

export const {
  fetchMyOrders,
  addToMyOrders,
  removeFromMyOrders,
  getTotalValue,
  removeAllOrders,
} = cartBoxSlicer.actions;
export default cartBoxSlicer.reducer;
