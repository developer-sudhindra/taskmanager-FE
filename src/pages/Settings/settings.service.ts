const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getUserName = async () => {
  const accessToken = getAccessToken();
  return await fetch("http://localhost:3000/profile/user-name", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const updateUserName = async (payload) => {
  const accessToken = getAccessToken();
  return await fetch("http://localhost:3000/profile/user-name", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
};
