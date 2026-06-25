import { createSlice } from "@reduxjs/toolkit";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return {
    date: `${year}. ${month}. ${day}`,
    time: `${hours}:${minutes}`,
  };
};

const calculateDFormat = (endDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const diffTime = end - today;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0) {
    return `D-${diffDays}`;
  } else if (diffDays === 0) {
    return "D-Day";
  } else {
    return `지원마감`;
  }
};

const findjobSlice = createSlice({
  name: "findjob",
  initialState: {
    cateType: "onLine",
  },
  reducers: {
    setCateType: (state, action) => {
      state.cateType = action.payload.cateType;
    },
    setDates: (state, action) => {
      const { id, workStartDate, workEndDate, endDate } = action.payload;
      state[id] = {
        workStartDate: formatDate(new Date(workStartDate)),
        workEndDate: formatDate(new Date(workEndDate)),
        endDate: formatDate(new Date(endDate)),
        dFormat: calculateDFormat(new Date(endDate)),
      };
    },
  },
});

export const { setCateType, setDates } = findjobSlice.actions;
export default findjobSlice.reducer;
