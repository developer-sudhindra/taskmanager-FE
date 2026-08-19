import { apiSlice } from "../../app/apiSlice";

export const projectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProjects: builder.query<any, void>({
      query: () => "project",
      providesTags: ["Projects"],
      keepUnusedDataFor: 600,
    }),
    createProject: builder.mutation<any, any>({
      query: (payload) => ({
        method: "POST",
        url: "project",
        body: payload,
      }),
      invalidatesTags: ["Projects"],
    }),
    addProjectMember: builder.mutation<any, any>({
      query: (payload) => ({
        method: "POST",
        url: "auth/invite-user",
        body: payload,
      }),
    }),
    getProjectDetails: builder.query<any, string>({
      query: (projectId) => ({
        url: `project/${projectId}`,
        method: "GET",
      }),
      providesTags: (result, error, projectId) => [
        { type: "Projects", id: projectId },
      ],
    }),
  }),
});

export const {
  useGetAllProjectsQuery,
  useCreateProjectMutation,
  useGetProjectDetailsQuery,
  usePrefetch,
  useAddProjectMemberMutation,
} = projectApi;
