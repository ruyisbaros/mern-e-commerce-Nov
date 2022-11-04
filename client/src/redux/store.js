import { configureStore } from "@reduxjs/toolkit";
import loadSlicer from "./loadSlicer";

export const store = configureStore({
  reducer: {
    loadStatus: loadSlicer,
  },
});
