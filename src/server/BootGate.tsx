import { useEffect, useRef, useState } from "react";
import { http } from "../lib/http";
import { isAbort } from "../utils/isAbort";

type Props = {
  children: React.ReactNode;
  pingPath?: string; // default: /api/latest-games
  minShowMs?: number; // optional: keep splash at least X ms for smoother UX
};

export default function BootGate({
  children,
  pingPath = "/api/latest-games",
  minShowMs = 500,
}: Props) {
  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState("Loading server…");
  const [attempt, setAttempt] = useState(1);
  const ctrl = useRef<AbortController | null>(null);
  const startedAt = useRef<number>(Date.now());
  const backoff = useRef<number>(1500); // 1.5s -> 15s

  useEffect(() => {
    let mounted = true;

    async function ping() {
      ctrl.current?.abort();
      ctrl.current = new AbortController();

      try {
        setMsg(
          attempt === 1
            ? "Server is loading (or waking up). This can take up to a minute…"
            : "Still preparing the server… trying again"
        );
        await http.get(pingPath, {
          signal: ctrl.current.signal,
          timeout: 45000,
        });
        // Smooth fade-out: ensure splash shows for at least minShowMs
        const elapsed = Date.now() - startedAt.current;
        const wait = Math.max(0, minShowMs - elapsed);
        setTimeout(() => mounted && setReady(true), wait);
      } catch (e: any) {
        if (isAbort(e)) return; // ignore
        // Always keep the “loading” message, even if offline/404/etc.
        setMsg(
          navigator.onLine
            ? "Server is loading (or waking up). This can take up to a minute…"
            : "You’re offline — we’ll connect as soon as your internet is back."
        );
        setAttempt((a) => a + 1);
        const delay = Math.min(backoff.current, 15000);
        setTimeout(() => mounted && ping(), delay);
        backoff.current = Math.min(backoff.current * 1.6, 15000);
      }
    }

    ping();
    return () => {
      mounted = false;
      ctrl.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pingPath]);

  if (ready) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950">
      <div className="w-[92%] max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-200 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
          <h3 className="text-base font-semibold">Starting ArcadeAtlas</h3>
        </div>
        <p className="mt-2 text-sm text-slate-300">{msg}</p>

        <p className="mt-3 text-[11px] leading-5 text-slate-400">
          Note: free hosting providers (Render, Railway, etc.) can put servers
          to sleep. First response may take 20–60s. We’ll keep trying
          automatically.
        </p>
      </div>
    </div>
  );
}
