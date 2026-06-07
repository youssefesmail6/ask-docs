import { useState } from "react";
import { CheckCircle2, FilePlus2, ShieldCheck } from "lucide-react";
import { createDocument } from "../api/documentsApi";
import { useAuth } from "../auth/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const initialFormState = {
  title: "",
  content: "",
};

function UploadDocument() {
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccessMessage("");
    setError("");

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Add a document title and internal document content.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createDocument({
        title: formData.title.trim(),
        filename: `${formData.title.trim()}.txt`,
        content: formData.content.trim(),
        uploaded_by_id: user?.id,
      });

      setSuccessMessage("Document uploaded and ingestion started.");
      setFormData(initialFormState);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <FilePlus2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-ink-950">
              Internal document intake
            </h2>
            <p className="text-sm text-ink-500">
              HR policies, SOPs, onboarding guides, sales playbooks, support FAQs.
            </p>
          </div>
        </div>

        {successMessage ? (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        {error ? (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="title"
              className="text-sm font-semibold text-ink-950"
            >
              Document title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Employee Onboarding Guide"
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="text-sm font-semibold text-ink-950"
            >
              Internal document content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={14}
              placeholder="Paste company policy, technical documentation, support FAQ content, or internal SOP text here."
              className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <LoadingSpinner label="Uploading" className="text-white" />
              ) : (
                <>
                  <FilePlus2 className="h-4 w-4" aria-hidden="true" />
                  Upload internal document
                </>
              )}
            </button>
            <p className="text-xs text-ink-500">
              Ingestion starts after submission.
            </p>
          </div>
        </form>
      </section>

      <aside className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-950">Admin area</p>
              <p className="text-xs text-ink-500">
                Upload documents, manage knowledge base
              </p>
            </div>
          </div>
        </div>

        {[
          "HR Policy",
          "Engineering Deployment Guide",
          "Sales Playbook",
          "Customer Support FAQ",
          "Employee Onboarding Guide",
        ].map((example) => (
          <div
            key={example}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
          >
            <CheckCircle2 className="h-4 w-4 text-signal-600" aria-hidden="true" />
            <span className="text-sm font-medium text-ink-700">{example}</span>
          </div>
        ))}
      </aside>
    </div>
  );
}

export default UploadDocument;
