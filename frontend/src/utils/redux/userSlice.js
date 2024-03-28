import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    idUser: null,
    firstname: null,
    lastname: null,
    successLogin: null,
    error: null,
    successRegister: null,
    errorRegister: null,
    character: null,
    secondCharacter: null,
    currentAct: null,
    motto: null,
    town: { region: "", description: "" },
    townName: null,
    townStatus: null,
    partyName: null,
    symbol: null,
    feelings: null,
    saves: [],
    save: {
      logScores: {},
      logAnswers: [],
      totalResidents: 0,
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
      state.save.totalResidents = givenResidents;
      return state;
    },
    setTown: (state, action) => {
      const { region, description } = action.payload;
      state.town = { region, description };
      return state;
    },
    setPartyName: (state, action) => {
      state.partyName = action.payload;
      return state;
    },
    setFeelings: (state, action) => {
      state.feelings = action.payload;
      return state;
    },
    setSymbol: (state, action) => {
      state.symbol = action.payload;
      return state;
    },
    setUserInfos: (state, action) => {
      const { firstname, lastname } = action.payload;
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
    },
    setSuccessRegister: (state, action)=>{
      state.successRegister = action.payload;
      return state;
    },
    setErrorRegister: (state, action)=>{
      state.errorRegister = action.payload;
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
  setCurrentAct,
  setPartyName,
  setSymbol,
  setFeelings,
  setSuccessRegister,
  setErrorRegister
} = userSlice.actions;

export default userSlice.reducer;
