import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  tagTypes: ["Admin"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    // baseUrl: "http://localhost:3000/",
  }),
  endpoints: (builder) => ({
    singleProduct: builder.query({
      query: (id) => `product/get/${id}`,
    }),
    singleCustomer: builder.query({
      query: (id) => `customers/${id}`,
    }),

    relatedProducts: builder.query({
      query: (productCat) => `product?product_cat=${productCat}`,
    }),
    //get product
    getProduct: builder.query({
      query: () => "product",
    }),
    //get product
    getOrders: builder.query({
      query: () => "order",
    }),
    //get product
    getCustomer: builder.query({
      query: () => "customers",
    }),
    //get product
    getCategory: builder.query({
      query: () => "cartegorie/get",
    }),
    updateStatus: builder.mutation({
      query: (data) => ({
        url: "order/update",
        method: "PUT",
        body: data,
      }),
    }),
    // add product
    addProduct: builder.mutation({
      query: (data) => ({
        url: "product/add",
        method: "POST",
        body: data,
      }),
    }),
    // add product
    addCity: builder.mutation({
      query: (data) => ({
        url: "pricelist/add",
        method: "POST",
        body: data,
      }),
    }),
    // add product
    addMarket: builder.mutation({
      query: (data) => ({
        url: "marketplace/add-market",
        method: "POST",
        body: data,
      }),
    }),
    // add product
    addDistributors: builder.mutation({
      query: (data) => ({
        url: "marketplace/add-distributor",
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
    // delete product
    deleteDistributor: builder.mutation({
      query: (id) => ({
        url: "marketplace/delete-distributors",
        method: "DELETE",
        body: id,
      }),
    }),
    // delete product
    deleteMarket: builder.mutation({
      query: (id) => ({
        url: "marketplace/delete-market",
        method: "DELETE",
        body: id,
      }),
    }),
    // login customer
    loginAdmin: builder.mutation({
      query: (data) => ({
        url: "login",
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
    // update product
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `product/update`, // Assuming your endpoint for updating a product is like /product/update/:id
        method: "PUT",
        body: data,
      }),
    }),

    // delete customer
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `customers/${id}`, // Adjust the endpoint according to your API
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useUpdateStatusMutation,
  useGetProductQuery,
  useSingleCustomerQuery,
  useGetOrdersQuery,
  useUpdateProductMutation,
  useDeleteCustomerMutation,
  useSingleProductQuery,
  useRelatedProductsQuery,
  useGetCustomerQuery,
  useGetCategoryQuery,
  useLoginAdminMutation,
  useDeleteProductMutation,
  useAddProductMutation,
  useCreateAdminMutation,
  useAddMarketMutation,
  useAddDistributorsMutation,
  useDeleteDistributorMutation,
  useDeleteMarketMutation,
  useAddCityMutation
} = adminApi;
