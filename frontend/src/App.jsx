import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import AskAI from "./pages/AskAI";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Entry from "./pages/Login";
import SemanticSearch from "./pages/SemanticSearch";
import UploadDocument from "./pages/UploadDocument";
import { useAuth } from "./auth/AuthContext";

const pageMeta = {
  "/admin/dashboard": {
    title: "Admin Dashboard",
    description:
      "Review document status, ingestion progress, and knowledge base activity.",
  },
  "/admin/upload": {
    title: "Upload Document",
    description:
      "Add internal company documents for ingestion into the knowledge base.",
  },
  "/admin/knowledge-base": {
    title: "Knowledge Base",
    description:
      "Manage uploaded documents and monitor their processing status.",
  },
  "/employee/ask": {
    title: "Ask Documents",
    description:
      "Ask a question and review the exact document sources used for the answer.",
  },
  "/employee/search": {
    title: "Search Documents",
    description:
      "Search across uploaded policies, guides, SOPs, FAQs, and playbooks.",
  },
};

function App() {
  const location = useLocation();
  const { user } = useAuth();
  const meta = pageMeta[location.pathname] || pageMeta["/employee/ask"];

  if (location.pathname === "/enter" || location.pathname === "/login") {
    return (
      <Routes>
        <Route path="/enter" element={<Entry />} />
        <Route path="/login" element={<Navigate to="/enter" replace />} />
      </Routes>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Navigate to="/enter" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1 lg:pl-64">
        <Header title={meta.title} description={meta.description} />
        <main className="mx-auto w-full max-w-7xl px-5 py-6 lg:px-8 lg:py-8">
          <Routes>
            <Route
              path="/"
              element={
                <Navigate
                  to={user?.role === "admin" ? "/admin/dashboard" : "/employee/ask"}
                  replace
                />
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard role="admin" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/upload"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UploadDocument />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/knowledge-base"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Documents />
                </ProtectedRoute>
              }
            />
            <Route path="/employee/dashboard" element={<Navigate to="/employee/ask" replace />} />
            <Route
              path="/employee/ask"
              element={
                <ProtectedRoute allowedRoles={["employee"]}>
                  <AskAI />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/search"
              element={
                <ProtectedRoute allowedRoles={["employee"]}>
                  <SemanticSearch />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/enter" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
