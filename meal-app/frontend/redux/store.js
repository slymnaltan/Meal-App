import { configureStore } from "@reduxjs/toolkit";
import mealReducer from "./slice/mealSlice";
import authReducer from "./slice/authSlice";

export const store = configureStore({
  reducer: {
    meals: mealReducer,
    auth: authReducer,
  },
});
