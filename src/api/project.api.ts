const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};
export const getAllProjectsAPI = async () => {
  const accessToken = getAccessToken();
  const response = await fetch("http://localhost:3000/project", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed");
  }
  return response.json();
};

export const createProjectAPI = async (payload) => {
  const accessToken = getAccessToken();
  const response = await fetch("http://localhost:3000/project", {
    method: "POST",
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

export const getProjectDetails = async (projectId: string) => {
  const accessToken = getAccessToken();
  const response = await fetch(`http://localhost:3000/project/${projectId}`, {
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
