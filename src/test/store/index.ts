import cosdfmtReducer from "./cosdfmtSlice";
import comtReducer from "./comtSlice";
import commenytReducer from "./commenytSlice";
import commentReducer from "./commentSlice";
import productsReducer from "./productsSlice";
import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    products: productsReducer,
    comments: commentReducer,
    commenyts: commenytReducer,

    comts: comtReducer,

    cosdfmts: cosdfmtReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
