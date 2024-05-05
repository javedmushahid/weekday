import { configureStore } from "@reduxjs/toolkit";
import { jobListingsApi } from "./jobListingsApiSlice";

export const store = configureStore({
  reducer: {
    [jobListingsApi.reducerPath]: jobListingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(jobListingsApi.middleware),
});
