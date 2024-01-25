import { createSlice } from "@reduxjs/toolkit";

const characterSlice = createSlice({
  name: "character",
  initialState: { characters: null },
  reducers: {
    storeCharacters: (state, action) => {
      const newState = action.payload;
      state.characters = newState.map((character) => ({
        ...character,
        selected: false,
        width: 0.3,
        height: 0.7
      }));
      return state;
    },

    updateCharactersSelected: (state, action) => {
      const { characters, selectedCharacter } = action.payload;
      state.characters = characters.map((character) => ({
        ...character,
        selected: selectedCharacter == character ? !character.selected : false
      }));
      return state;
    },
  },
});

export const { storeCharacters, updateCharactersSelected } =
  characterSlice.actions;

export default characterSlice.reducer;
