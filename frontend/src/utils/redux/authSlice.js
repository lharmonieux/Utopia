import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { error: null, token: null },
  reducers: {
    setToken: (state, action) => {
      const { token, error } = action.payload;
      state = {token, error};
      return state;
    },
    loginFail: (state, action) => {
      const { error, token } = action.payload;
      state = {error, token};
      return state;
    },
  },
});

export const { setToken, loginFail } = authSlice.actions;

export default authSlice.reducer;
