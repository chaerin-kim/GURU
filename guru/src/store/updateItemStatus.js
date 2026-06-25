import { createSlice } from "@reduxjs/toolkit";

const updateItemStatusSlice = createSlice({
  name: "itemStatus",
  initialState: {
    ItemStatus: {},
  },
  reducers: {
    updateItemStatus: (state, action) => {
      const { id, status, applicants } = action.payload;
      if (state.ItemStatus[id]) {
        state.ItemStatus[id].status = status;
        state.ItemStatus[id].applicants = applicants;
      } else {
        state.ItemStatus[id] = { status, applicants };
      }
    },
  },
});

export const { updateItemStatus } = updateItemStatusSlice.actions;
export default updateItemStatusSlice.reducer;
