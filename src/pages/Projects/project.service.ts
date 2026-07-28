const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};
export const getAllProjectsAPI = async () => {
  const accessToken = getAccessToken();
  return await fetch("http://localhost:3000/project", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const createProjectAPI = async (payload) => {
  const accessToken = getAccessToken();
  return await fetch("http://localhost:3000/project", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
};

export const getProjectDetails = async (projectId: string) => {
  const accessToken = getAccessToken();
  return await fetch(`http://localhost:3000/project/${projectId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getAllTask = async (projectId: string) => {
  const accessToken = getAccessToken();
  return await fetch(`http://localhost:3000/tasks/project/${projectId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const createTask = async (payload) => {
  const accessToken = getAccessToken();
  return await fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
};

export const findOneTask = async (taskId: string) => {
  const accessToken = getAccessToken();
  return await fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const updateTaskAPI = async (taskId: string, payload) => {
  const accessToken = getAccessToken();
  return await fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
};

export const deleteTaskService = async (taskId: string) => {
  const accessToken = getAccessToken();
  return await fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
