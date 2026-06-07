import apiClient, {
  getApiErrorMessage,
  isApiConfigured,
} from "./client";

function extractDocuments(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.documents)) return data.documents;
  return [];
}

export async function getDocuments() {
  if (!isApiConfigured) {
    throw new Error("Frontend API URL is not configured.");
  }

  try {
    const { data } = await apiClient.get("/api/documents");
    return { documents: extractDocuments(data) };
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Unable to load internal documents."),
    );
  }
}

export async function getDocument(id) {
  if (!isApiConfigured) {
    throw new Error("Frontend API URL is not configured.");
  }

  try {
    const { data } = await apiClient.get(`/api/documents/${id}`);
    return { document: data?.document || data };
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Unable to load this internal document."),
    );
  }
}

export async function createDocument(document) {
  if (!isApiConfigured) {
    throw new Error("Frontend API URL is not configured.");
  }

  try {
    const { data } = await apiClient.post("/api/documents", { document });
    return { document: data?.document || data };
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Unable to upload this internal document."),
    );
  }
}

export async function deleteDocument(id) {
  if (!isApiConfigured) {
    throw new Error("Frontend API URL is not configured.");
  }

  try {
    await apiClient.delete(`/api/documents/${id}`);
    return { deleted: true };
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Unable to delete this internal document."),
    );
  }
}
