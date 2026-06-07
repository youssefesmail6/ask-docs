import { useState } from "react";
import {
  FileQuestion,
  FileText,
  MessageSquareText,
  Search,
  SendHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { askCompanyAI } from "../api/askApi";
import { useAuth } from "../auth/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import SourceCard from "../components/SourceCard";

function incrementQuestionCount() {
  try {
    const key = "askdocs_employee_questions";
    const currentCount = Number(window.localStorage.getItem(key) || 0);
    window.localStorage.setItem(key, String(currentCount + 1));
  } catch {
    return undefined;
  }
}

function AskAI() {
  const { user } = useAuth();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [isAsking, setIsAsking] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setAnswer("");
    setSources([]);

    if (!question.trim()) {
      setError("Write a question before submitting.");
      return;
    }

    setIsAsking(true);

    try {
      const response = await askCompanyAI(question.trim(), { userId: user?.id });
      setAnswer(response.answer || "No answer was returned.");
      setSources(response.sources || []);
      incrementQuestionCount();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <MessageSquareText className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    Ask a document question
                  </h2>
                  <p className="text-sm text-slate-500">
                    The answer should come from uploaded company documents.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/employee/search"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Search first
            </Link>
          </div>

          {error ? (
            <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={7}
              placeholder="Example: What approvals are required before a production deployment?"
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-4 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={isAsking}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isAsking ? (
                  <LoadingSpinner label="Checking documents" className="text-white" />
                ) : (
                  <>
                    <SendHorizontal className="h-4 w-4" aria-hidden="true" />
                    Get answer
                  </>
                )}
              </button>
              <p className="text-xs text-slate-500">
                Sources are shown below the answer.
              </p>
            </div>
          </form>
        </div>

        <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-950">
            Good questions
          </h3>
          <div className="mt-4 space-y-2">
            {[
              "How do I request paid time off?",
              "What is required before a production deployment?",
              "What should sales capture during discovery?",
              "How should support classify a new request?",
            ].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setQuestion(example)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
              >
                {example}
              </button>
            ))}
          </div>
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <article className="min-h-[220px] rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {answer ? (
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <FileQuestion className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Answer
                </p>
                <p className="mt-3 text-base leading-7 text-slate-700">{answer}</p>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[180px] flex-col items-center justify-center text-center">
              <FileText className="h-9 w-9 text-slate-300" aria-hidden="true" />
              <h3 className="mt-3 text-base font-semibold text-slate-950">
                No answer yet
              </h3>
              <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
                Ask a question to generate an answer with matching document
                references.
              </p>
            </div>
          )}
        </article>

        <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-950">Answer policy</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>Uses uploaded company documents as context.</li>
            <li>Shows source chunks under each answer.</li>
            <li>Answers stay grounded in retrieved document sources.</li>
          </ul>
        </aside>
      </section>

      {sources.length > 0 ? (
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Sources</h2>
            <p className="mt-1 text-sm text-slate-500">
              Document chunks used to support this answer.
            </p>
          </div>
          <div className="grid gap-3">
            {sources.map((source, index) => (
              <SourceCard
                key={`${source.document_title || source.title}-${index}`}
                source={source}
                index={index}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default AskAI;
