import { format } from "date-fns";

export const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split("T")[0];
};

export const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString();
};

export function formatDate(date, formatStr, locale) {
  return format(new Date(date), formatStr, { locale });
}
