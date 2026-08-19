export const ProjectRole = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
  VIEWER: "VIEWER",
} as const;

export type ProjectRoleType = (typeof ProjectRole)[keyof typeof ProjectRole];
