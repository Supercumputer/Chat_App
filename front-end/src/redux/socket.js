import { createSlice } from "@reduxjs/toolkit";

export const socketSlice = createSlice({
  name: "socket",
  initialState: {
    userOnline: [],
    messNew: [],
    messNew2: [],
  },
  reducers: {
    userOnline: (state, action) => {
      state.userOnline = action.payload;
    },
    newMess: (state, action) => {
      state.messNew = action.payload;
    },
    messNew2: (state, action) => {
      state.messNew2 = action.payload;
    },
  },
});

export const { userOnline, newMess, messNew2 } = socketSlice.actions;
export default socketSlice.reducer;
