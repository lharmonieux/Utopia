import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
  name: "company",
  initialState: {
    companies: [],
  },
  reducers: {
    storeCompanies: (state, action) => {
      const companies = action.payload;
      state.companies = companies;
      return state;
    },
    storeNewCompany: (state, action) => {
      state.companies.push(action.payload);
      return state;
    },
  },
});

export const { storeCompanies, storeNewCompany } = companySlice.actions;

export default companySlice.reducer;
