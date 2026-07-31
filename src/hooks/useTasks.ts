import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { taskKeys } from "./projectKeys.factory";
import {
  getAllTask,
  createTask,
  findOneTask,
  updateTaskAPI,
  deleteTaskService,
} from "../api/tasks.api";

export function useGetAllTasks(projectId: string) {
  return useQuery({
    queryKey: [...taskKeys.lists(), projectId],
    queryFn: () => getAllTask(projectId),
    enabled: !!projectId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.all,
      });
    },
  });
}

export function useGetOneTask(taskId: string) {
  return useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => findOneTask(taskId),
    enabled: !!taskId,
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: any }) =>
      updateTaskAPI(taskId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.taskId),
      });
    },
  });
}

export function useDeleteTask() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => deleteTaskService(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.all,
      });
    },
    onSettled: () => {
      navigate(-1);
    },
  });
}

export function usePrefetchTaskDetails() {
  const queryClient = useQueryClient();
  const prefetchTaskDetails = (taskId: string) => {
    if (!taskId) return;
    queryClient.prefetchQuery({
      queryKey: taskKeys.detail(taskId),
      queryFn: () => findOneTask(taskId),
      staleTime: 10 * 10000,
    });
  };
  return prefetchTaskDetails;
}
