import { useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const roleOptions = [
  {
    id: "employee",
    label: "Employee",
    email: "employee@askdocs.test",
    icon: UserRound,
  },
  {
    id: "admin",
    label: "Admin",
    email: "admin@askdocs.test",
    icon: ShieldCheck,
  },
];

function Login() {
  const { user, enterAsRole } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("employee");
  const [email, setEmail] = useState("employee@askdocs.test");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (user) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/dashboard" : "/employee/ask"}
        replace
      />
    );
  }

  function handleRoleChange(nextRole) {
    const selectedRole = roleOptions.find((option) => option.id === nextRole);
    setRole(nextRole);
    setEmail(selectedRole?.email || "employee@askdocs.test");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const loggedInUser = await enterAsRole(role);
      navigate(
        loggedInUser.role === "admin" ? "/admin/dashboard" : "/employee/ask",
        { replace: true },
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8 text-slate-950">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
            <BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg font-semibold">AskDocs AI</p>
            <p className="text-sm text-slate-500">Company knowledge portal</p>
          </div>
        </div>

        <div className="mt-8">
          <h1 className="text-2xl font-semibold text-slate-950">Enter workspace</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Select your workspace role to continue.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {roleOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = role === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleRoleChange(option.id)}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {isSelected ? (
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  ) : null}
                </div>
                <p className="mt-2 text-sm font-semibold">{option.label}</p>
              </button>
            );
          })}
        </div>

        {error ? (
          <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Workspace user
            </label>
            <input
              id="email"
              type="email"
              value={email}
              readOnly
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {isSubmitting ? "Entering..." : "Continue"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
