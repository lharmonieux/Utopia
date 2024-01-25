import { createSlice } from "@reduxjs/toolkit";

const actSlice = createSlice({
  name: "act",
  initialState: {
    acts: null,
    currentAct: null,
    currentQuestion: null,
    questionOrder: 0,
  },
  reducers: {
    storeActs: (state, action) => {
      const { acts } = action.payload;
      state.acts = acts;
      return state;
    },
    storeCurrentAct: (state, action) => {
      const currentAct = action.payload;
      state.currentAct = { ...currentAct, status: "IN PROGRESS" };
      return state;
    },
    setQuestion: (state, action) => {
      const newCurrentQuestion = action.payload;
      state.currentQuestion = {
        ...newCurrentQuestion,
        answers: newCurrentQuestion?.answers?.map((answer) => ({
          ...answer,
          selected: false,
        })),
      };
      return state;
    },

    updateQuestion: (state, action) => {
      const { currentQuestion, selectedAnswer, typeAnswer } = action.payload;
      state.currentQuestion = {
        ...currentQuestion,
        answers: currentQuestion?.answers?.map((answer) => ({
          ...answer,
          selected:
            selectedAnswer._id == answer._id
              ? !answer.selected
              : typeAnswer == "single"
              ? false
              : answer.selected,
        })),
      };
      return state;
    },

    setQuestionOrder: (state, action) => {
      state.questionOrder = action.payload;
      return state;
    },
    updateCurrentAct: (state, action) => {
      state.currentAct = action.payload;
      return state;
    },
    updateStatusActs: (state, action) => {
      let { acts, nbOfSaves } = action.payload;
      let isNextCurrAct = false;
      const newActs = acts.map((act) => {
        let newAct = { ...act };
        if (act.chapter < nbOfSaves) newAct.status = "DONE";
        if (act.chapter == nbOfSaves) {
          newAct.status = "DONE";
          isNextCurrAct = true;
        }
        if (act.chapter > nbOfSaves) {
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
  setQuestion,
  updateQuestion,
  setQuestionOrder,
  updateCurrentAct,
  storeCurrentAct,
  updateStatusActs,
} = actSlice.actions;

export default actSlice.reducer;
