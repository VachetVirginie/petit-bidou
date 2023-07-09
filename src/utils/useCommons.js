export const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split("T")[0];
};

export const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString();
};
