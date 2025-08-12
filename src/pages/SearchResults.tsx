import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { searchGames } from "../api";
import type { LatestGame } from "../types";
import GameCard from "../components/GameCard";
import SkeletonCard from "../components/SkeletonCard";

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get("title")?.trim() ?? "";
  const [games, setGames] = useState<LatestGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    if (!q) {
      setGames([]);
      return;
    }
    setLoading(true);
    searchGames(q, ctrl.signal)
      .then(setGames)
      .catch((e) => setError(e?.message || "Failed to search"))
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [q]);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-4">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Search
        </h1>
        <p className="mt-1 text-slate-300 text-sm">
          Results for: <span className="font-medium">{q || "—"}</span>
        </p>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-12">
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-200 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && !games.length && q && (
          <div className="text-slate-400 text-sm">
            No results. Try another keyword.
          </div>
        )}

        {!loading && games.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {games.map((g) => (
                <GameCard key={g.id} game={g} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </>
  );
}
