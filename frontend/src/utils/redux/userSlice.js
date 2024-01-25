import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    idUser: null,
    firstname: null,
    lastname: null,
    successLogin: null,
    error: null,
    character: null,
    secondCharacter: null,
    currentAct: null,
    motto: null,
    town: { region: "", description: "" },
    townName: null,
    townStatus: null,
    saves: [],
    save: {
      logScores: {},
      logAnswers: [],
      totalResidents: 0
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
    setUserCharacter: (state, action) => {
      state.character = action.payload;
      return state;
    },
    setUserSecondCharacter: (state, action) => {
      state.secondCharacter = action.payload;
      return state;
    },
    setCurrentAct: (state, action) => {
      state.currentAct = action.payload;
      return state;
    },
    setMotto: (state, action) => {
      state.motto = action.payload;
      return state;
    },
    storeTownName: (state, action) => {
      state.townName = action.payload;
      return state;
    },
    setTownStatus: (state, action) => {
      state.townStatus = action.payload;
      return state;
    },
    setThematicScore: (state, action) => {
      const { scoresThematic, givenResidents } = action.payload;
      state.save.logScores = scoresThematic;
      state.save.totalResidents += givenResidents;
      return state;
    },
    setTown: (state, action) => {
      const { region, description } = action.payload;
      state.town = { region, description };
      return state;
    },
    setUserInfos: (state, action) => {
      const {firstname, lastname} = action.payload;
      state.firstname = firstname;
      state.lastname = lastname;
      return state;
    },
    storeSaves: (state, action) => {
      state.saves = action.payload;
      return state;
    },
    setIdUser: (state, action) => {
      state.idUser = action.payload;
      return state;
    }
  },
});

export const {
  createUserSuccess,
  createUserError,
  setUserCharacter,
  setUserSecondCharacter,
  setMotto,
  storeTownName,
  setTownStatus,
  setThematicScore,
  setTown,
  setUserInfos,
  storeSaves,
  setIdUser,
  setCurrentAct
} = userSlice.actions;

export default userSlice.reducer;
