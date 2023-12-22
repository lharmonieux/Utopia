import { createSlice } from "@reduxjs/toolkit";

const townSlice = createSlice({
  name: "town",
  initialState: { towns: null },
  reducers: {
    storeTowns: (state, action) => {
      const towns = action.payload;
      state.towns = towns.map(town =>({
        ...town,
        selected: false,
      }));
      return state;
    },

    updateTownSelected: (state, action) => {
      const {towns, selectedTown} = action.payload;
      state.towns = towns?.map(town => ({
        ...town,
        selected: selectedTown == town ? !town?.selected : false
      }));
      return state;
    }
  },
});

export const { storeTowns, updateTownSelected } = townSlice.actions;

export default townSlice.reducer;
