import apiClient, {
  getApiErrorMessage,
  isApiConfigured,
} from "./client";

export async function searchInternalKnowledge(query) {
  if (!isApiConfigured) {
    throw new Error("Frontend API URL is not configured.");
  }

  try {
    const { data } = await apiClient.post("/api/search", { query });
    return { results: data?.results || [] };
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Unable to search internal knowledge."),
    );
  }
}
