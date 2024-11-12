import { configureStore } from "@reduxjs/toolkit";
import actSlice from "./actSlice";
import userSlice from "./userSlice";
import authSlice from "./authSlice";
import DOMSlice from "./DOMSlice";
import characterSlice from "./characterSlice";
import townSlice from "./townSlice";
import projectSlice from "./projectSlice";
import companySlice from "./companySlice";
import commnentSlice from "./commentSlice";
import thematicSlice from "./thematicSlice";

export const store = configureStore({
  reducer: {
    act: actSlice,
    user: userSlice,
    auth: authSlice,
    dom: DOMSlice,
    character: characterSlice,
    town: townSlice,
    project: projectSlice,
    company: companySlice,
    comment: commnentSlice,
    thematic: thematicSlice,
  },
});
