import { configureStore } from "@reduxjs/toolkit";
import attributesReducer from "./slices/attributesSlice";
import detailsReducer from "./slices/detailsSlice";

export const store = configureStore({
  reducer: {
    attributes: attributesReducer,
    details: detailsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
