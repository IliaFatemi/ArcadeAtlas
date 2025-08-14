import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { http, API_BASE } from "../lib/http";
import { isAbort } from "../utils/isAbort";

type Status = "online" | "connecting" | "sleeping" | "offline" | "error";

type Ctx = {
  status: Status;
  message: string;
  showOverlay: boolean;
  retry: () => void;
};

const Ctx = createContext<Ctx | undefined>(undefined);

const STALL_MS = 700; // wait this long before showing overlay for pending reqs
const SLEEP_HINT_MS = 5000; // after this, tell users server may be waking (Render, Railway, etc.)

export function ServerStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<Status>("online");
  const [message, setMessage] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);

  const inflight = useRef(0);
  const stallTimer = useRef<number | null>(null);
  const startTime = useRef<number>(0);
  const retryBackoff = useRef<number>(1500); // grows up to ~15s

  // Show overlay only if we stall a bit
  function armStallTimer() {
    if (stallTimer.current != null) return;
    startTime.current = Date.now();
    stallTimer.current = window.setTimeout(() => {
      setShowOverlay(true);
      setStatus((s) => (s === "online" ? "connecting" : s));
      setMessage("Connecting to the server…");
    }, STALL_MS) as unknown as number;
  }
  function clearStallTimer() {
    if (stallTimer.current != null) {
      clearTimeout(stallTimer.current);
      stallTimer.current = null;
    }
  }

  // Attach axios interceptors (once)
  useEffect(() => {
    const reqId = http.interceptors.request.use((config) => {
      inflight.current += 1;
      armStallTimer();
      // show “waking up” hint after SLEEP_HINT_MS
      setTimeout(() => {
        if (showOverlay && Date.now() - startTime.current >= SLEEP_HINT_MS) {
          setStatus("sleeping");
          setMessage(
            "Waking the server… This can take 20–60s on free hosting. Please wait."
          );
        }
      }, SLEEP_HINT_MS + 50);
      return config;
    });

    const resId = http.interceptors.response.use(
      (res) => {
        inflight.current = Math.max(0, inflight.current - 1);
        if (inflight.current === 0) {
          clearStallTimer();
          setShowOverlay(false);
          setStatus("online");
          setMessage("");
          retryBackoff.current = 1500;
        }
        return res;
      },
      (err) => {
        inflight.current = Math.max(0, inflight.current - 1);
        clearStallTimer();

        if (!isAbort(err)) {
          // Network/offline vs server error
          if (!err?.response) {
            setStatus(navigator.onLine ? "sleeping" : "offline");
            setMessage(
              navigator.onLine
                ? "Server is starting or unavailable. Retrying…"
                : "You appear to be offline. Check your connection."
            );
          } else {
            setStatus("error");
            setMessage(`Server error (${err.response.status}). Retrying…`);
          }
          setShowOverlay(true);
          // schedule auto-retry ping
          scheduleRetry();
        } else if (inflight.current === 0) {
          setShowOverlay(false);
          setStatus("online");
          setMessage("");
        }
        return Promise.reject(err);
      }
    );

    return () => {
      http.interceptors.request.eject(reqId);
      http.interceptors.response.eject(resId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOverlay]); // stable enough

  // Online/offline browser events
  useEffect(() => {
    function onOnline() {
      if (status !== "online") {
        setStatus("connecting");
        setMessage("Back online. Reconnecting…");
        retry();
      }
    }
    function onOffline() {
      setStatus("offline");
      setMessage("You’re offline. We’ll reconnect when your internet is back.");
      setShowOverlay(true);
    }
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [status]);

  function scheduleRetry() {
    const delay = Math.min(retryBackoff.current, 15000);
    window.setTimeout(() => retry(), delay);
    retryBackoff.current = Math.min(retryBackoff.current * 1.6, 15000);
  }

  async function retry() {
    try {
      setStatus("connecting");
      setMessage("Connecting to the server…");
      setShowOverlay(true);
      // Any cheap endpoint works; latest-games is fine
      await http.get("/api/latest-games", { timeout: 45000 });
      setStatus("online");
      setMessage("");
      setShowOverlay(false);
      retryBackoff.current = 1500;
    } catch (e) {
      if (!isAbort(e)) {
        setShowOverlay(true);
        setStatus(navigator.onLine ? "sleeping" : "offline");
        setMessage(
          navigator.onLine
            ? "Server is still waking up… we’ll keep trying."
            : "You’re offline. Reconnect to continue."
        );
        scheduleRetry();
      }
    }
  }

  const value = useMemo<Ctx>(
    () => ({ status, message, showOverlay, retry }),
    [status, message, showOverlay]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <ServerOverlay /> {/* render overlay from inside the provider */}
    </Ctx.Provider>
  );
}

export function useServerStatus() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error(
      "useServerStatus must be used within <ServerStatusProvider>"
    );
  return ctx;
}

// --- Overlay UI ---
function ServerOverlay() {
  const { showOverlay, status, message, retry } = useServerStatus();
  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
      <div className="w-[92%] max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-200 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
          <h3 className="text-base font-semibold">
            {status === "offline"
              ? "Offline"
              : status === "error"
              ? "Server error"
              : status === "sleeping"
              ? "Waking server"
              : "Connecting…"}
          </h3>
        </div>
        <p className="mt-2 text-sm text-slate-300">
          {message || "Please wait while we connect to the server."}
        </p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={retry}
            className="rounded-md bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-sm text-white"
          >
            Try again
          </button>
          <a
            href={API_BASE}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-slate-700 hover:bg-slate-800 px-3 py-1.5 text-sm"
            title="Open API in a new tab"
          >
            Open API
          </a>
        </div>

        <p className="mt-3 text-xs text-slate-400">
          Tip: free hosting providers may sleep after inactivity. First response
          can take up to a minute.
        </p>
      </div>
    </div>
  );
}
