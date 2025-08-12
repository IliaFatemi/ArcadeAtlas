import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { LatestGame } from "../types";
import { fetchLatestGames } from "../api";
import GameCard from "../components/GameCard";
import SkeletonCard from "../components/SkeletonCard";

export default function Home() {
  const [games, setGames] = useState<LatestGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchLatestGames(ctrl.signal)
      .then(setGames)
      .catch((e) => setError(e?.message || "Failed to load"))
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-4">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Latest Releases
        </h1>
        <p className="mt-1 text-slate-300 max-w-2xl text-sm">
          Fresh drops from across platforms. Pulled live from your backend.
        </p>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-12">
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-200 text-sm">
            {error}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <AnimatePresence>
              {games.map((g) => (
                <GameCard key={g.id} game={g} />
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>
    </>
  );
}
