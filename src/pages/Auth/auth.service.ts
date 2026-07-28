const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const updatePassword = async (payload) => {
  const accessToken = getAccessToken();
  return await fetch("http://localhost:3000/profile/change-password", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
};
