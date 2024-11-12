import { createSlice } from "@reduxjs/toolkit";

const actSlice = createSlice({
  name: "act",
  initialState: {
    acts: [],
    currentAct: null,
    currentQuestion: null,
    questionOrder: 0,
  },
  reducers: {
    storeCurrentAct: (state, action) => {
      const currentAct = action.payload;
      if (currentAct)
        state.currentAct = { ...currentAct, status: "IN PROGRESS" };

      return state;
    },
    storeQuestion: (state, action) => {
      state.currentQuestion = action.payload;
      return state;
    },

    storeQuestionOrder: (state, action) => {
      state.questionOrder = action.payload;
      return state;
    },
    updateCurrentAct: (state, action) => {
      state.currentAct = action.payload;
      return state;
    },
    storeActs: (state, action) => {
      let { acts, nbOfSaves } = action.payload;
      let isNextCurrAct = false;
      const newActs = acts.map((act) => {
        let newAct = { ...act };
        if (act.chapterNumber < nbOfSaves) newAct.status = "DONE";
        if (act.chapterNumber == nbOfSaves) {
          newAct.status = "DONE";
          isNextCurrAct = true;
        }
        if (act.chapterNumber > nbOfSaves) {
          if (isNextCurrAct || nbOfSaves == 0) {
            newAct.status = "IN PROGRESS";
            isNextCurrAct = false;
            nbOfSaves++;
          } else newAct.status = "NOT DONE";
        }

        return newAct;
      });

      state.acts = newActs;
      return state;
    },
  },
});

export const {
  storeActs,
  storeQuestion,
  storeQuestionOrder,
  updateCurrentAct,
  storeCurrentAct,
} = actSlice.actions;

export default actSlice.reducer;
