import {
  Building2,
  Database,
  FilePlus2,
  LayoutDashboard,
  MessageSquareText,
  Search,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const roleNavigation = {
  admin: [
    {
      to: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/admin/upload",
      label: "Upload Document",
      icon: FilePlus2,
    },
    {
      to: "/admin/knowledge-base",
      label: "Knowledge Base",
      icon: Database,
    },
  ],
  employee: [
    {
      to: "/employee/ask",
      label: "Ask Documents",
      icon: MessageSquareText,
    },
    {
      to: "/employee/search",
      label: "Search Documents",
      icon: Search,
    },
  ],
};

function Sidebar() {
  const { user, logout } = useAuth();
  const links = roleNavigation[user?.role] || roleNavigation.employee;

  return (
    <aside className="border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:flex lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
          <Building2 className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-base font-semibold text-slate-950">AskDocs AI</p>
          <p className="text-xs font-medium capitalize text-slate-500">
            {user?.role || "employee"} workspace
          </p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:flex-1 lg:space-y-1 lg:overflow-y-auto">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition lg:min-w-0",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                ].join(" ")
              }
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-950">{user?.name}</p>
          <p className="mt-1 text-xs text-slate-500">{user?.email}</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold capitalize text-slate-600 ring-1 ring-slate-200">
              {user?.role}
            </span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-white hover:text-slate-950"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
