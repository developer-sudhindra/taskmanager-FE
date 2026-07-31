import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllProjectsAPI,
  createProjectAPI,
  getProjectDetails,
} from "../api/project.api";
import { projectKeys } from "./projectKeys.factory";

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: getAllProjectsAPI,
  });
}

export function useGetProjectDetails(projectId: string) {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => getProjectDetails(projectId),
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProjectAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      });
    },
  });
}

export function usePrefetchProjectDetails() {
  const queryClient = useQueryClient();
  const prefetchProject = async (projectId: string) => {
    if (!projectId) return;

    await queryClient.prefetchQuery({
      queryKey: projectKeys.detail(projectId),
      queryFn: () => getProjectDetails(projectId),
      staleTime: 10 * 1000,
    });
  };
  return prefetchProject;
}
