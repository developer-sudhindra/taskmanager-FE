export const validateEmail = (emailId: string) => {
  if (!emailId) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(emailId);
};

export const validateUserName = (userName: string) => {
  if (!userName) return false;
  const userNameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,14}$/;
  return userNameRegex.test(userName);
};
