import { configureStore } from "@reduxjs/toolkit";
import { adminApi } from "../services/api";
import { cloudinaryApi } from "../services/cloudinary";

const store = configureStore({
  reducer: {
    [adminApi.reducerPath]: adminApi.reducer,
    [cloudinaryApi.reducerPath]: cloudinaryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApi.middleware, cloudinaryApi.middleware),
});

export default store;
