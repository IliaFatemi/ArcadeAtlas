import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import type { GameDetails } from "../api";
import { fetchGameById } from "../api";
import axios from "axios";

const fix = (u?: string) => (!u ? "" : u.startsWith("//") ? `https:${u}` : u);
const yearOf = (sec?: number) =>
  sec ? new Date(sec * 1000).getUTCFullYear() : undefined;
const names = (xs?: { name: string }[], n = 99) =>
  (xs ?? []).slice(0, n).map((x) => x.name);
const devs = (ic?: GameDetails["involved_companies"]) =>
  (ic ?? [])
    .filter((x) => x.developer)
    .map((x) => x.company?.name)
    .filter(Boolean);
const pubs = (ic?: GameDetails["involved_companies"]) =>
  (ic ?? [])
    .filter((x) => x.publisher)
    .map((x) => x.company?.name)
    .filter(Boolean);
const webLabel = (c?: number, url?: string) => {
  if (!url) return "Link";
  const host = new URL(url, "https://x").hostname.replace("www.", "");
  if (c === 13 || host.includes("steam")) return "Steam";
  if (c === 3 || host.includes("wikipedia")) return "Wikipedia";
  if (c === 9 || host.includes("youtube")) return "YouTube";
  if (host.includes("fandom")) return "Fandom";
  if (c === 1) return "Official";
  return host;
};
const yt = (id?: string) => (id ? `https://www.youtube.com/embed/${id}` : "");

type Loc = { state?: { preview?: any } };

export default function GameDetailsPage() {
  const { id } = useParams();
  const loc = useLocation() as Loc;

  // Keep preview content if present (so no flicker)
  const [game, setGame] = useState<GameDetails | null>(
    loc.state?.preview
      ? ({
          id: loc.state.preview.id,
          name: loc.state.preview.title ?? loc.state.preview.name ?? "Unknown",
          summary: loc.state.preview.details ?? "",
          first_release_date:
            loc.state.preview.first_release_date ??
            (loc.state.preview.releaseYear
              ? Date.UTC(loc.state.preview.releaseYear, 0, 1) / 1000
              : undefined),
          cover: loc.state.preview.imgURL
            ? { url: loc.state.preview.imgURL }
            : undefined,
        } as GameDetails)
      : null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const ctrl = new AbortController();
    fetchGameById(Number(id), ctrl.signal)
      .then((d) => setGame((g) => ({ ...g, ...d } as GameDetails)))
      .catch((e: any) => {
        if (
          axios.isCancel?.(e) ||
          e?.name === "CanceledError" ||
          e?.code === "ERR_CANCELED"
        )
          return;
        setError(e?.message || "Failed to load");
      });
    return () => ctrl.abort();
  }, [id]);

  if (error)
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-red-300">{error}</div>
    );
  if (!game)
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-slate-300">
        Loading…
      </div>
    );

  const yr = yearOf(game.first_release_date);
  const bg = fix(game.artworks?.[0]?.url || game.screenshots?.[0]?.url);
  const cover = fix(game.cover?.url);
  const critics =
    Math.round(game.aggregated_rating ?? game.total_rating ?? 0) || undefined;
  const users = Math.round(game.rating ?? 0) || undefined;
  const votes = game.total_rating_count ?? game.aggregated_rating_count;
  const devList = devs(game.involved_companies);
  const pubList = pubs(game.involved_companies);
  const platforms = names(game.platforms, 8);
  const modes = names(game.game_modes, 6);
  const genres = names(game.genres, 6);
  const themes = names(game.themes, 6);
  const views = names(game.player_perspectives, 6);
  const sites = (game.websites ?? []).slice(0, 6);
  const shots = (game.screenshots ?? []).slice(0, 6).map((m) => fix(m.url));
  const trailer = yt(game.videos?.[0]?.video_id);
  const similar = (game.similar_games ?? []).slice(0, 10);

  return (
    <div className="relative">
      {/* Hero background */}
      {bg && (
        <div className="absolute inset-0 h-64 md:h-72 lg:h-[22rem] -z-10">
          <img src={bg} className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950" />
        </div>
      )}

      {/* Header row */}
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-4 md:pt-8 md:pb-6">
        <div className="flex gap-4">
          <div className="hidden md:block w-[120px] shrink-0">
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              {cover ? (
                <img src={cover} className="w-full aspect-[3/4] object-cover" />
              ) : (
                <div className="aspect-[3/4] bg-slate-800" />
              )}
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {game.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              {yr && (
                <span className="rounded bg-slate-800/90 px-2 py-1 text-slate-200">
                  {yr}
                </span>
              )}
              {critics && (
                <span className="rounded bg-emerald-600/90 px-2 py-1 text-white">
                  Critic: {critics}
                </span>
              )}
              {users && (
                <span className="rounded bg-indigo-600/90 px-2 py-1 text-white">
                  User: {users}
                </span>
              )}
              {platforms.map((p) => (
                <span key={p} className="rounded bg-slate-800 px-2 py-1">
                  {p}
                </span>
              ))}
              {modes.map((m) => (
                <span key={m} className="rounded bg-slate-800 px-2 py-1">
                  {m}
                </span>
              ))}
              {genres.map((g) => (
                <span key={g} className="rounded bg-slate-800 px-2 py-1">
                  {g}
                </span>
              ))}
              {views.map((v) => (
                <span key={v} className="rounded bg-slate-800 px-2 py-1">
                  {v}
                </span>
              ))}
              {themes.map((t) => (
                <span key={t} className="rounded bg-slate-800 px-2 py-1">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="mx-auto max-w-6xl px-4 pb-14 grid gap-6 md:grid-cols-[1fr,320px]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Overview / Storyline */}
          {(game.summary || game.storyline) && (
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              {game.summary && (
                <>
                  <h2 className="text-lg font-semibold">Overview</h2>
                  <p className="mt-2 text-[13.5px] leading-6 text-slate-300">
                    {game.summary}
                  </p>
                </>
              )}
              {game.storyline && (
                <>
                  <h3 className="mt-4 text-base font-semibold">Storyline</h3>
                  <p className="mt-1.5 text-[13.5px] leading-6 text-slate-300">
                    {game.storyline}
                  </p>
                </>
              )}
            </section>
          )}

          {/* Media */}
          {shots.length > 0 && (
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-lg font-semibold">Media</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {shots.map((s, i) => (
                  <img
                    key={i}
                    src={s}
                    className="rounded-lg border border-slate-800 object-cover w-full aspect-[16/9]"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Trailer */}
          {trailer && (
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-lg font-semibold">Trailer</h2>
              <div className="mt-3 aspect-video">
                <iframe
                  className="w-full h-full rounded-lg border border-slate-800"
                  src={trailer}
                  title="Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </section>
          )}

          {/* Similar games */}
          {similar.length > 0 && (
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="text-lg font-semibold">Similar Games</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {similar.map((sg) => (
                  <Link
                    key={sg.id}
                    to={`/game/${sg.id}`}
                    className="block rounded-xl border border-slate-800 bg-slate-950/50 overflow-hidden hover:-translate-y-0.5 transition"
                  >
                    <div className="aspect-[3/4] bg-slate-800">
                      {fix(sg.cover?.url) && (
                        <img
                          src={fix(sg.cover?.url)}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="px-3 py-2 text-center text-xs text-slate-200 truncate">
                      {sg.name}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column — Details card */}
        <aside className="rounded-xl border border-slate-800 bg-slate-900 p-5 h-fit">
          <h2 className="text-lg font-semibold">Details</h2>
          <dl className="mt-3 space-y-2 text-sm">
            {yr && <Row k="Release Year" v={String(yr)} />}
            {devList.length > 0 && <Row k="Developer" v={devList.join(", ")} />}
            {pubList.length > 0 && <Row k="Publisher" v={pubList.join(", ")} />}
            {(critics || users) && (
              <Row
                k="Critic / User"
                v={
                  `${critics ?? "–"} / ${users ?? "–"}` +
                  (votes ? ` (votes ${votes})` : "")
                }
              />
            )}
            {game.collection?.name && (
              <Row k="Collection" v={game.collection.name} />
            )}
            {/* Age ratings (show first available) */}
            {game.age_ratings?.length ? (
              <Row
                k="Age Rating"
                v={String(game.age_ratings[0].rating ?? "")}
              />
            ) : null}
          </dl>

          {/* Website buttons */}
          {sites.length > 0 && (
            <div className="mt-4 space-y-2">
              {sites.map((w, i) => (
                <a
                  key={i}
                  href={w.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center rounded-md border border-slate-700 hover:border-slate-600 bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 text-xs font-medium"
                >
                  {webLabel(w.category, w.url)}
                </a>
              ))}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <Link
              to="/"
              className="px-3 py-1.5 rounded-md text-xs border border-slate-700 hover:bg-slate-800"
            >
              Back
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-3 py-1.5 rounded-md text-xs border border-slate-700 hover:bg-slate-800"
            >
              Top
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-800/60 pb-2">
      <dt className="text-slate-400">{k}</dt>
      <dd className="text-slate-200 text-right">{v}</dd>
    </div>
  );
}
