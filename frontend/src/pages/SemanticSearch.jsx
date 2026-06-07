import { useState } from "react";
import { ArrowLeft, FileSearch, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { searchInternalKnowledge } from "../api/searchApi";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";

function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResults([]);

    if (!query.trim()) {
      setError("Enter a search query.");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const response = await searchInternalKnowledge(query.trim());
      setResults(response.results || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Search className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Search uploaded documents
              </h2>
              <p className="text-sm text-slate-500">
                Find matching policy, guide, SOP, FAQ, or playbook passages.
              </p>
            </div>
          </div>

          <Link
            to="/employee/ask"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to ask
          </Link>
        </div>

        {error ? (
          <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by topic, policy name, or process"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSearching ? (
              <LoadingSpinner label="Searching" className="text-white" />
            ) : (
              <>
                <Search className="h-4 w-4" aria-hidden="true" />
                Search
              </>
            )}
          </button>
        </form>
      </section>

      {isSearching ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LoadingSpinner label="Searching documents" />
        </div>
      ) : results.length > 0 ? (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
            <p className="text-sm font-semibold text-slate-950">
              {results.length} result{results.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="divide-y divide-slate-200">
            {results.map((result, index) => (
              <article
                key={`${result.document_id || result.id}-${index}`}
                className="grid gap-4 p-5 lg:grid-cols-[220px_minmax(0,1fr)]"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <FileSearch className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Result {index + 1}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-slate-950">
                      {result.document_title ||
                        result.documentTitle ||
                        "Internal document"}
                    </h3>
                  </div>
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  {result.content || "No matching chunk content was returned."}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : hasSearched ? (
        <EmptyState
          title="No matching documents"
          message="Try a different company term, policy name, document title, or operating procedure."
        />
      ) : (
        <EmptyState
          title="Search documents"
          message="Use search when you want to inspect matching passages before asking a question."
        />
      )}
    </div>
  );
}

export default SemanticSearch;
