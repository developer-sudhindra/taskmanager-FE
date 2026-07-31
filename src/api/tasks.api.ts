const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};
export const getAllTask = async (projectId: string) => {
  const accessToken = getAccessToken();
  const response = await fetch(
    `http://localhost:3000/tasks/project/${projectId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  if (!response) {
    throw new Error("Failed");
  }
  return response.json();
};

export const createTask = async (payload) => {
  const accessToken = getAccessToken();
  const response = await fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failsed");
  }
  return response.json();
};

export const findOneTask = async (taskId: string) => {
  const accessToken = getAccessToken();
  const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed");
  }

  return response.json();
};

export const updateTaskAPI = async (taskId: string, payload) => {
  const accessToken = getAccessToken();
  const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed");
  }

  return response.json();
};

export const deleteTaskService = async (taskId: string) => {
  const accessToken = getAccessToken();
  const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed");
  }

  return response.json();
};
