import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function About() {
  useEffect(() => {
    const prev = document.title;
    document.title = "About — ArcadeAtlas";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-slate-200">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

        <div className="flex items-center gap-4">
          <img
            src="/logo/ArcadeAtlas.svg"
            alt="ArcadeAtlas"
            className="h-12 w-12"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              About <span className="text-indigo-300">ArcadeAtlas</span>
            </h1>
            <p className="mt-1 text-slate-400 text-sm">
              A sleek, modern game explorer with search, rich details, media,
              and local collections.
            </p>
          </div>
        </div>
      </section>

      {/* What/Features */}
      <section className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold">What it is</h2>
          <p className="mt-2 text-sm text-slate-300">
            ArcadeAtlas pulls live data from a games API and presents it with a
            smooth, modern UI. Browse latest releases, search titles, and dive
            into polished detail pages.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold">Key Features</h2>
          <ul className="mt-2 space-y-2 text-sm text-slate-300">
            <li>• Powerful search with instant results</li>
            <li>• Deep game pages: overview, media, trailer, similar games</li>
            <li>
              • <span className="font-medium">My Collections</span>: favorites,
              wishlist, backlog, etc.
            </li>
            <li>
              • <span className="font-medium">Reviews & Ratings</span> (stored
              locally)
            </li>
            <li>• Achievements checklist per game</li>
            <li>• Developer/Publisher profile pages</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold">Tech</h2>
          <ul className="mt-2 space-y-2 text-sm text-slate-300">
            <li>• React + Vite + TypeScript</li>
            <li>• Tailwind CSS (dark, glassy UI)</li>
            <li>• LocalStorage for user data (no login required)</li>
            <li>• Deployed on Netlify (frontend) + Render (API)</li>
          </ul>
        </div>
      </section>

      {/* Data + Privacy */}
      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold">Data Sources</h2>
          <p className="mt-2 text-sm text-slate-300">
            Game metadata, covers, screenshots, and trailers are fetched from a
            games database API. Titles and media belong to their respective
            owners.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold">Privacy</h2>
          <p className="mt-2 text-sm text-slate-300">
            Collections, reviews, and achievements are saved **locally** on your
            device using
            <span className="font-medium"> localStorage</span>. We don’t upload
            your personal data.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/"
          className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm"
        >
          Explore Games
        </Link>
        <Link
          to="/collections"
          className="rounded-lg border border-slate-700 hover:bg-slate-800 px-4 py-2 text-sm"
        >
          My Collections
        </Link>
      </section>

      {/* Footer-ish note */}
      <p className="mt-10 text-xs text-slate-500">
        ArcadeAtlas is a demo/portfolio project for exploring game data in a
        modern UI. All trademarks and images are property of their respective
        owners.
      </p>
    </main>
  );
}
