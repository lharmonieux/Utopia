import { configureStore } from "@reduxjs/toolkit";
import actSlice from "./actSlice";
import userSlice from "./userSlice";
import authSlice from "./authSlice";
import DOMSlice from "./DOMSlice";
import characterSlice from "./characterSlice";
import townSlice from "./townSlice";


export const store = configureStore({
  reducer: {
    act: actSlice,
    user: userSlice,
    auth: authSlice,
    dom: DOMSlice,
    character: characterSlice,
    town: townSlice
  },
});
