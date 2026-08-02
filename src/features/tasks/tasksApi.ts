import type { ICreateTaskPayload, ITask } from "./types";
import { apiSlice } from "../../app/apiSlice";

export const tasksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTasks: builder.query<ITask[], string>({
      query: (projectId) => `tasks?projectId=${projectId}`,
      providesTags: ["Tasks"],
    }),
    getOneTask: builder.query<ITask, string>({
      query: (taskId) => `tasks/${taskId}`,
      providesTags: (resule, error, taskId) => [{ type: "Tasks", id: taskId }],
      keepUnusedDataFor: 60,
    }),
    createTask: builder.mutation<ITask, ICreateTaskPayload>({
      query: (payload) => ({
        url: "tasks",
        method: "POST",
        body: payload,
      }),
    }),
    updateTask: builder.mutation<
      ITask,
      { taskId: string; payload: Partial<ITask> }
    >({
      query: ({ taskId, payload }) => ({
        url: `tasks/${taskId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { taskId }) => [
        "Tasks",
        { type: "Tasks", id: taskId },
      ],
    }),
    deleteTask: builder.mutation<{ success: boolean }, string>({
      query: (taskId) => ({
        url: `tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetAllTasksQuery,
  useGetOneTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  usePrefetch,
} = tasksApi;
