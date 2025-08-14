import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import type { FormEvent } from "react";

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
      {/* allow wrapping on small screens */}
      <div className="mx-auto max-w-6xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* left group */}
        <button onClick={() => nav("/")} className="flex items-center gap-2">
          <img
            src="/logo/ArcadeAtlas.svg"
            alt="ArcadeAtlas"
            className="h-6 w-6 rounded-lg"
          />
          <span className="text-sm font-semibold">ArcadeAtlas</span>
        </button>

        {/* right group (wraps on xs) */}
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          {/* keep these visible on all sizes */}
          <Link
            to="/about"
            className="inline-flex text-xs rounded-lg border border-slate-700 px-3 py-1.5 shrink-0 order-1"
          >
            About
          </Link>
          <Link
            to="/collections"
            className="inline-flex text-xs rounded-lg border border-slate-700 px-3 py-1.5 shrink-0 order-1"
          >
            My Lists
          </Link>

          {/* search takes the remaining width; on xs it drops to next line */}
          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 flex-1 min-w-[200px] order-2 sm:order-none"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search games…"
              className="w-full flex-1 min-w-0 rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-sm placeholder-slate-400 outline-none focus:ring-2 ring-indigo-500/60"
            />
            <button
              type="submit"
              className="rounded-lg bg-indigo-500 hover:bg-indigo-400 px-3 py-1.5 text-xs font-medium text-white shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
