import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "comment",
  initialState: { comments: [] },
  reducers: {
    storeComments: (state, action) => {
      state.comments = action.payload;
      return state;
    },
  },
});

export const { storeComments } = commentSlice.actions;

export default commentSlice.reducer;
