import { apiSlice } from "../../app/apiSlice";
export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    setGostUserPassword: builder.mutation({
      query: (payload) => ({
        method: "POST",
        url: "auth/activate",
        body: payload,
      }),
    }),
  }),
});

export const { useSetGostUserPasswordMutation } = usersApi;
