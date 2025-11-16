import { configureStore } from "@reduxjs/toolkit";
import attributesReducer from "./slices/attributesSlice";
import detailsReducer from "./slices/detailsSlice";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    attributes: attributesReducer,
    details: detailsReducer,
    product: productReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;