import axios from "axios";

export const apiBaseUrl = import.meta.env.VITE_API_URL?.trim();

export const isApiConfigured = Boolean(apiBaseUrl);

const apiClient = axios.create({
  baseURL: apiBaseUrl || "/",
  timeout: 12000,
});

export function getApiErrorMessage(error, defaultMessage) {
  const responseMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data?.errors?.join?.(", ");

  return responseMessage || defaultMessage;
}

export default apiClient;
