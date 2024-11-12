import { createSlice } from "@reduxjs/toolkit";

const townSlice = createSlice({
  name: "town",
  initialState: { towns: null },
  reducers: {
    storeTowns: (state, action) => {
      state.towns = action.payload;
      return state;
    },
  },
});

export const { storeTowns } = townSlice.actions;

export default townSlice.reducer;
