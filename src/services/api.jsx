import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  tagTypes: ["Admin"],
  baseQuery: fetchBaseQuery({
    baseUrl: "https://farm2home.cyclic.app/",
    //baseUrl: "http://127.0.0.1:3001/"
  }),
  endpoints: (builder) => ({
    singleProduct: builder.query({
      query: (id) => `product/get/${id}`,
    }),

    relatedProducts: builder.query({
      query: (productCat) => `product?product_cat=${productCat}`,
    }),
    //get product
    getProduct: builder.query({
      query: () => "product",
    }),
    //get product
    getCategory: builder.query({
      query: () => "cartegorie/get",
    }),
    // add product
    addProduct: builder.mutation({
      query: (data) => ({
        url: "product/add",
        method: "POST",
        body: data,
      }),
    }),
    // delete product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: "product/remove",
        method: "DELETE",
        body: id,
      }),
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

export const {
  useGetProductQuery,
  useSingleProductQuery,
  useRelatedProductsQuery,
  useGetCategoryQuery,
  useLoginAdminMutation,
  useDeleteProductMutation,
  useAddProductMutation,
  useCreateAdminMutation,
} = adminApi;
