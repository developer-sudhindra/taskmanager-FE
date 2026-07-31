export const projectKeys = {
  // The root scope for all project-related queries
  all: ["projects"] as const,

  // Scope for lists of projects
  lists: () => [...projectKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...projectKeys.lists(), filters] as const,

  // Scope for individual project details
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (id: string | number) => [...projectKeys.details(), id] as const,
};

export const taskKeys = {
  all: ["tasks"] as const,

  // 1. Base lists identifier
  lists: () => [...taskKeys.all, "list"] as const,

  // 2. Project-specific lists key (Add this method)
  listByProject: (projectId: string) =>
    [...taskKeys.lists(), projectId] as const,

  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};
