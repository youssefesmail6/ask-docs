import { useEffect, useMemo, useState } from "react";
import {
  Boxes,
  CheckCircle2,
  Database,
  FileStack,
  FileUp,
  MessageSquareText,
  SearchCheck,
  ServerCog,
} from "lucide-react";
import { getDocuments } from "../api/documentsApi";
import LoadingSpinner from "../components/LoadingSpinner";
import StatCard from "../components/StatCard";

const flowSteps = [
  { label: "Upload", detail: "Admin adds internal documents", icon: FileUp },
  { label: "Review", detail: "Documents move through processing", icon: ServerCog },
  { label: "Find", detail: "Users search approved content", icon: SearchCheck },
  { label: "Answer", detail: "Sources stay attached", icon: MessageSquareText },
];

function readQuestionCount() {
  try {
    return Number(window.localStorage.getItem("askdocs_employee_questions") || 0);
  } catch {
    return 0;
  }
}

function Dashboard({ role = "employee" }) {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadDocuments() {
      setIsLoading(true);
      setError("");

      try {
        const response = await getDocuments();

        if (isMounted) {
          setDocuments(response.documents);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setQuestionCount(readQuestionCount());
        }
      }
    }

    loadDocuments();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const readyDocuments = documents.filter(
      (document) => String(document.status).toLowerCase() === "ready",
    ).length;
    const processingDocuments = documents.filter((document) =>
      ["pending", "processing"].includes(String(document.status).toLowerCase()),
    ).length;
    const knowledgeChunks = documents.reduce((total, document) => {
      return total + Number(document.chunks_count ?? document.chunksCount ?? 0);
    }, 0);

    return {
      internalDocuments: documents.length,
      readyDocuments,
      processingDocuments,
      employeeQuestions: questionCount,
      knowledgeChunks,
    };
  }, [documents, questionCount]);

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <LoadingSpinner label="Loading company knowledge metrics" />
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            label="Internal documents"
            value={stats.internalDocuments}
            helper="Company files"
            icon={FileStack}
            tone="blue"
          />
          <StatCard
            label="Ready documents"
            value={stats.readyDocuments}
            helper="Available now"
            icon={CheckCircle2}
            tone="green"
          />
          <StatCard
            label="Processing documents"
            value={stats.processingDocuments}
            helper="Being prepared"
            icon={ServerCog}
            tone="amber"
          />
          <StatCard
            label="Employee questions"
            value={stats.employeeQuestions}
            helper="This browser"
            icon={MessageSquareText}
            tone="teal"
          />
          <StatCard
            label="Knowledge chunks"
            value={stats.knowledgeChunks}
            helper="Indexed content"
            icon={Boxes}
            tone="slate"
          />
        </section>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {role === "admin" ? "Admin workflow" : "Employee workflow"}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">
              {role === "admin"
                ? "Keep the company knowledge base organized"
                : "Use approved company documents to get work done"}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            {role === "admin"
              ? "Upload HR policies, onboarding guides, technical docs, sales playbooks, support FAQs, and SOPs."
              : "Ask questions or search documents without leaving the internal portal."}
          </p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {flowSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.label}
                className="relative rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-950">
                  {step.label}
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {step.detail}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {["HR Policy", "Engineering Deployment Guide", "Customer Support FAQ"].map(
          (title) => (
            <article
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <Database className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-950">{title}</p>
                  <p className="text-xs text-slate-500">Document example</p>
                </div>
              </div>
            </article>
          ),
        )}
      </section>
    </div>
  );
}

export default Dashboard;
