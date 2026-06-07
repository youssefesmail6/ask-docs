import apiClient, {
  getApiErrorMessage,
  isApiConfigured,
} from "./client";

export async function getSeededUserByRole(role) {
  if (!isApiConfigured) {
    throw new Error("Frontend API URL is not configured.");
  }

  try {
    const { data } = await apiClient.get(`/api/users/role/${role}`);
    return { user: data?.user };
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Unable to load the workspace user."),
    );
  }
}
