import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    idUser: null,
    firstname: null,
    lastname: null,
    email: null,
    isPasswordChanged: null,
    successLogin: null,
    error: null,
    role: null,
    character: null,
    secondCharacter: null,
    currentAct: null,
    motto: null,
    town: null,
    townName: null,
    townStatus: null,
    partyName: null,
    symbol: null,
    comments: [],
    saves: [],
    nbOfSaves: -1,
    save: {
      act: null,
      logScores: [],
      logAnswers: [],
      totalResidentsGot: 0,
      totalResidentsPossible: 0,
    },
  },
  reducers: {
    createUserSuccess: (state, action) => {
      state.successLogin = action.payload;
      state.error = null;
    },
    createUserError: (state, action) => {
      state.error = action.payload;
      state.successLogin = null;
    },
    storeUserCharacter: (state, action) => {
      state.character = action.payload;
      return state;
    },
    storeUserSecondCharacter: (state, action) => {
      state.secondCharacter = action.payload;
      return state;
    },
    storeUserCurrentAct: (state, action) => {
      state.currentAct = action.payload;
      return state;
    },
    storeRole: (state, action) => {
      state.role = action.payload;
      return state;
    },
    storeMotto: (state, action) => {
      state.motto = action.payload;
      return state;
    },
    storeTownName: (state, action) => {
      state.townName = action.payload;
      return state;
    },
    storeTownStatus: (state, action) => {
      state.townStatus = action.payload;
      return state;
    },
    storeScoreAndAnswer: (state, action) => {
      state.save = action.payload;
      return state;
    },
    updateScoreAndAnswer: (state, action) => {
      const {
        totalResidentsGot,
        totalResidentsPossible,
        scoresObject,
        answersObject,
      } = action.payload;

      //Scores
      const { thematic, scoreGot, scoreMaxPossible } = scoresObject;

      //If thematic already stored, just update scores
      const thematicAlreadyStored = [...state.save.logScores].filter(
        (e) => e.thematic._id === thematic
      );
      if (thematicAlreadyStored[0]?.thematic._id) {
        const newLogScores = [...state.save.logScores].filter(
          (e) => e.thematic._id !== thematic
        );
        newLogScores.push({
          thematic: {_id: thematic},
          scoreGot: scoreGot + thematicAlreadyStored[0].scoreGot,
          scoreMaxPossible:
            scoreMaxPossible + thematicAlreadyStored[0].scoreMaxPossible,
        });
        state.save.logScores = newLogScores;
      } else {
        state.save.logScores.push({ thematic: {_id: thematic}, scoreGot, scoreMaxPossible });
      }

      //Answers
      const { question, answers } = answersObject;
      state.save.logAnswers.push({
        question,
        thematic,
        scoreMaxPossible,
        nbResidentsMaxPossible: totalResidentsPossible,
        answers,
      });

      //Residents
      state.save.totalResidentsGot += totalResidentsGot;
      state.save.totalResidentsPossible += totalResidentsPossible;
      return state;
    },
    storeTown: (state, action) => {
      state.town = action.payload;
      return state;
    },
    storePartyName: (state, action) => {
      state.partyName = action.payload;
      return state;
    },
    storeSymbol: (state, action) => {
      state.symbol = action.payload;
      return state;
    },
    storeUserInfos: (state, action) => {
      const { firstname, lastname, userId, email } = action.payload;
      state.firstname = firstname;
      state.lastname = lastname;
      state.idUser = userId;
      state.email = email;
      return state;
    },
    storeIsPasswordChanged: (state, action) => {
      state.isPasswordChanged = action.payload;
      return state;
    },
    storeSaves: (state, action) => {
      const { saves } = action.payload;
      state.saves = saves;
      state.nbOfSaves = saves.length;
      return state;
    },
    storeUserComments: (state, action) => {
      state.comments = action.payload;
      return state;
    },
  },
});

export const {
  createUserSuccess,
  createUserError,
  storeUserCharacter,
  storeUserSecondCharacter,
  storeMotto,
  storeTownName,
  storeTownStatus,
  storeScoreAndAnswer,
  updateScoreAndAnswer,
  storeTown,
  storeUserInfos,
  storeSaves,
  storeUserCurrentAct,
  storePartyName,
  storeSymbol,
  storeRole,
  storeUserComments,
  storeIsPasswordChanged,
} = userSlice.actions;

export default userSlice.reducer;
