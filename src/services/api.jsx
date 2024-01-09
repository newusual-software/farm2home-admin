import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  tagTypes: ["Admin"],
  baseQuery: fetchBaseQuery({
    baseUrl: "https://farm2home.cyclic.app/",
    //baseUrl: "http://127.0.0.1:3001/"
  }),
  endpoints: (builder) => ({


    getProduct: builder.query({
      query: () => "product",
    }),
    // login customer
    loginAdmin: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),

    // create Admin
    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/create",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetProductQuery, useLoginAdminMutation, useCreateAdminMutation } = adminApi;
