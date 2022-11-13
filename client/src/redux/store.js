import { configureStore } from "@reduxjs/toolkit";
import cartBoxSlicer from "./cartBoxSlicer";
import currentUserSlicer from "./currentUserSlicer";
import loadSlicer from "./loadSlicer";
import ordersSlicer from "./ordersSlicer";
import productsSlicer from "./productsSlicer";

export const store = configureStore({
  reducer: {
    loadStatus: loadSlicer,
    currentUser: currentUserSlicer,
    products: productsSlicer,
    cartItems: cartBoxSlicer,
    myOrders: ordersSlicer,
  },
});
