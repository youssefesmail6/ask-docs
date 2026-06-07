import { useAuth } from "../auth/AuthContext";

function Header({ title, description }) {
  const { user } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white px-5 py-5 lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Signed in as
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-950">
            {user?.name} <span className="font-normal capitalize text-slate-500">({user?.role})</span>
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
