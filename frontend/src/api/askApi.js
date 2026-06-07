import apiClient, {
  getApiErrorMessage,
  isApiConfigured,
} from "./client";

export async function askCompanyAI(question, options = {}) {
  if (!isApiConfigured) {
    throw new Error("Frontend API URL is not configured.");
  }

  try {
    const { data } = await apiClient.post("/api/ask", {
      question,
      user_id: options.userId,
      document_id: options.documentId,
    });
    return data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "AskDocs AI could not answer this question."),
    );
  }
}
