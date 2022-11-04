import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: "",
  token: "",
  logging: false,
};

const currentUserSlicer = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    userLoggedStart: (state) => {
      state.logging = true;
    },
    userLoggedFinish: (state) => {
      state.logging = false;
    },
    userLoggedSucces: (state, action) => {
      state.logging = false;
      state.currentUser = action.payload.currentUser;
      state.token = action.payload.token;
    },
  },
});

export const { userLoggedStart, userLoggedFinish, userLoggedSucces } =
  currentUserSlicer.actions;

export default currentUserSlicer.reducer;
