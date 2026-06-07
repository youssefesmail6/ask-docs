import { useEffect, useState } from "react";
import { Database, FilePlus2 } from "lucide-react";
import { Link } from "react-router-dom";
import { deleteDocument, getDocuments } from "../api/documentsApi";
import DocumentCard from "../components/DocumentCard";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  async function loadDocuments() {
    setIsLoading(true);
    setError("");

    try {
      const response = await getDocuments();
      setDocuments(response.documents);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  async function handleDelete(id) {
    setDeletingId(id);
    setError("");
    setSuccessMessage("");

    try {
      await deleteDocument(id);
      setDocuments((currentDocuments) =>
        currentDocuments.filter((document) => document.id !== id),
      );
      setSuccessMessage("Internal document deleted.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Admin area
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            Uploaded documents
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage HR policies, technical documentation, sales enablement, support
            FAQs, and internal SOPs.
          </p>
        </div>
        <Link
          to="/admin/upload"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <FilePlus2 className="h-4 w-4" aria-hidden="true" />
          Upload document
        </Link>
      </div>

      {successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <LoadingSpinner label="Loading knowledge base" />
        </div>
      ) : documents.length > 0 ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onDelete={handleDelete}
              isDeleting={deletingId === document.id}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={Database}
          title="No internal documents yet"
          message="Upload company documents so employees can ask source-backed questions."
          action={
            <Link
              to="/admin/upload"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <FilePlus2 className="h-4 w-4" aria-hidden="true" />
              Upload internal document
            </Link>
          }
        />
      )}
    </div>
  );
}

export default Documents;
