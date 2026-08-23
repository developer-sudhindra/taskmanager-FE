import { apiSlice } from "../../app/apiSlice";

export const projectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProjects: builder.query<any, void>({
      query: () => "project",
      providesTags: ["Projects"],
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
      invalidatesTags: ["ProjectMembers"],
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
    getAllProjectMember: builder.query<any, any>({
      query: (projectId) => `projects/${projectId}/members/all`,
      providesTags: (result, error, projectId) => [
        {
          type: "ProjectMembers",
          id: projectId,
        },
      ],
    }),
    updateProjectMember: builder.mutation({
      query: (payload) => ({
        method: "PATCH",
        url: `projects/${payload.projectId}/members/update`,
        body: payload,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "ProjectMembers", id: projectId },
      ],
    }),
    removeMemberFromProject: builder.mutation({
      query: ({ projectId, memberId }) => ({
        method: "DELETE",
        url: `projects/${projectId}/members/${memberId}`,
      }),
      invalidatesTags: ["ProjectMembers"],
    }),
  }),
});

export const {
  useGetAllProjectsQuery,
  useCreateProjectMutation,
  useGetProjectDetailsQuery,
  usePrefetch,
  useAddProjectMemberMutation,
  useGetAllProjectMemberQuery,
  useUpdateProjectMemberMutation,
  useRemoveMemberFromProjectMutation,
} = projectApi;
