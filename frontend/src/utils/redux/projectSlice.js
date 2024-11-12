import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
  },
  reducers: {
    storeProjects: (state, action) => {
      const projects = action.payload;
      state.projects = projects;
      return state;
    },
    storeNewProject: (state, action) => {
      state.projects.push(action.payload);
      return state;
    },
  },
});

export const { storeProjects, storeNewProject } = projectSlice.actions;

export default projectSlice.reducer;
