import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import type { FormEvent } from "react"; // <-- type-only import

export default function Header() {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("title") ?? "");
  const nav = useNavigate();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    nav(q.trim() ? `/search?title=${encodeURIComponent(q.trim())}` : "/");
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center justify-between gap-3">
        {/* left group */}
        <button onClick={() => nav("/")} className="flex items-center gap-2">
          <img
            src="/logo/ArcadeAtlas.svg"
            alt="ArcadeAtlas"
            className="h-6 w-6 rounded-lg"
          />
          <span className="text-sm font-semibold">ArcadeAtlas</span>
        </button>

        {/* right group */}
        <div className="flex items-center gap-2">
          <Link
            to="/about"
            className="text-xs rounded-lg border border-slate-700 px-3 py-1.5"
          >
            About
          </Link>
          <Link
            to="/collections"
            className="text-xs rounded-lg border border-slate-700 px-3 py-1.5"
          >
            My Lists
          </Link>
          <form
            onSubmit={onSubmit}
            className="hidden md:flex items-center gap-2"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search games…"
              className="w-80 rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-sm placeholder-slate-400 outline-none focus:ring-2 ring-indigo-500/60"
            />
            <button
              type="submit"
              className="rounded-lg bg-indigo-500 hover:bg-indigo-400 px-3 py-1.5 text-xs font-medium text-white"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
