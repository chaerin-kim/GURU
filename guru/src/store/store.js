import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userStore";
import findjobReducer from "./findjob";
import pageInfoReducer from "./pageInfo";
import updateItemStatusReducer from "./updateItemStatus";
import filterReducer from "./filter";

export const store = configureStore({
  reducer: {
    user: userReducer,
    findjob: findjobReducer,
    pageInfo: pageInfoReducer,
    itemStatus: updateItemStatusReducer,
    filter: filterReducer,
  },
});
