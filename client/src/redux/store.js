import { configureStore } from "@reduxjs/toolkit";
import cartBoxSlicer from "./cartBoxSlicer";
import currentUserSlicer from "./currentUserSlicer";
import loadSlicer from "./loadSlicer";
import productsSlicer from "./productsSlicer";

export const store = configureStore({
  reducer: {
    loadStatus: loadSlicer,
    currentUser: currentUserSlicer,
    products: productsSlicer,
    cartItems: cartBoxSlicer,
  },
});
