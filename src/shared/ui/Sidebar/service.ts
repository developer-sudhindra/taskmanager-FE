const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getMenu = async () => {
  const accessToken = getAccessToken();
  return await fetch("http://localhost:3000/profile/menu", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
