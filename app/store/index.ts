import { configureStore } from "@reduxjs/toolkit";
import attributesReducer from "./slices/attributesSlice";
import detailsReducer from "./slices/detailsSlice";
import productReducer from "./slices/productSlice";

export const store = configureStore({
  reducer: {
    attributes: attributesReducer,
    details: detailsReducer,
    product: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
