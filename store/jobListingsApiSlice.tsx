import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const jobListingsApi = createApi({
  reducerPath: "jobListingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.weekday.technology/adhoc/",
  }),
  endpoints: (builder) => ({
    getJobListings: builder.query({
      query: ({ limit, offset }) => ({
        url: "getSampleJdJSON",
        method: "POST",
        body: { limit, offset },
      }),
    }),
  }),
});

export const { useGetJobListingsQuery } = jobListingsApi;
