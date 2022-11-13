import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
};

const usersSlicer = createSlice({
  name: "users",
  initialState,
  reducers: {
    fetchUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { fetchUsers } = usersSlicer.actions;
export default usersSlicer.reducer;
