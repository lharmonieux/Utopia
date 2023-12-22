import { createSlice } from "@reduxjs/toolkit";

const DOMSlice = createSlice({
  name: "dom",
  initialState: { width: 0, height: 0 },
  reducers: {
    setSizes: (state, action) => {
      const { width, height } = action.payload;
      state = { width, height };
      return state;
    },
  },
});

export const { setSizes } = DOMSlice.actions;

export default DOMSlice.reducer;
