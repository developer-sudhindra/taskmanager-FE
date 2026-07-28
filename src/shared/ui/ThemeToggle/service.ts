const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getTheme = async () => {
  const accessToken = getAccessToken();
  return await fetch("http://localhost:3000/profile/theme", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const updateTheme = async (updatedTheme) => {
  const accessToken = getAccessToken();
  return await fetch("http://localhost:3000/profile/theme", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ theme: updatedTheme }),
  });
};
