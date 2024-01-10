import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const cloudinaryApi = createApi({
  reducerPath: "cloudinaryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.cloudinary.com/v1_1/phantom1245" }),
  endpoints: (builder) => ({
    addImage: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "h8bgt8bc");

        return {
          url: "/image/upload",
          method: "POST",
          body: formData,
        };
      },
    }),

    // Other endpoints go here

  }),
});

export const {
  useAddImageMutation, // Updated to useAddImageMutation
} = cloudinaryApi;
