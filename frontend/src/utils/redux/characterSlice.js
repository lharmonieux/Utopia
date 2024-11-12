import { createSlice } from "@reduxjs/toolkit";

const characterSlice = createSlice({
  name: "character",
  initialState: { characters: null },
  reducers: {
    storeCharacters: (state, action) => {
      const newState = action.payload;
      state.characters = newState.map((character) => ({
        ...character,
        width: 0.3,
        height: 0.7,
      }));
      return state;
    },
  },
});

export const { storeCharacters } = characterSlice.actions;

export default characterSlice.reducer;
