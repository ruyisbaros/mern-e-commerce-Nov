import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
};

const loadindSlicer = createSlice({
  name: "loadStatus",
  initialState,
  reducers: {
    loadingStart: (state) => {
      state.loading = true;
    },
    loadingFinish: (state) => {
      state.loading = false;
    },
    loadingFail: (state) => {
      state.loading = false;
    },
  },
});

export const { loadingStart, loadingFinish, loadingFail } =
  loadindSlicer.actions;

export default loadindSlicer.reducer;
