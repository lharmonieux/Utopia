import { createSlice } from "@reduxjs/toolkit";

const thematicSlice = createSlice({
  name: "thematic",
  initialState: { thematics: null },
  reducers: {
    storeThematics: (state, action) => {
      state.thematics = action.payload;
      state.ok = true;
      return state;
    },
  },
});

export const { storeThematics } = thematicSlice.actions;

export default thematicSlice.reducer;
