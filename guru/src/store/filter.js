import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filter",
  initialState: {
    cateField: "all",
    cateTalent: "all",
  },
  reducers: {
    setCateField(state, action) {
      state.cateField = action.payload;
    },
    setCateTalent(state, action) {
      state.cateTalent = action.payload;
    },
  },
});

export const { setCateField, setCateTalent } = filterSlice.actions;
export default filterSlice.reducer;
