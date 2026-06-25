import { createSlice } from "@reduxjs/toolkit";

const pageInfoSlice = createSlice({
  name: "pageInfo",
  initialState: {
    menuKR: "",
    menuEn: "",
    subMenu: [],
    currentPage: {},
  },
  reducers: {
    setPageInfo: (state, action) => {
      state.menuKR = action.payload.menuKR;
      state.menuEn = action.payload.menuEn;
      state.currentPage = action.payload.currentPage;
    },
    setSubPage: (state, action) => {
      state.subMenu = action.payload.subMenu;
    },
    resetSubPage: (state) => {
      state.subMenu = [];
    },
  },
});

export const { setPageInfo, setSubPage, resetSubPage } = pageInfoSlice.actions;
export default pageInfoSlice.reducer;
