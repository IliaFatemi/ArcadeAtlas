import type { LatestGame } from "./types";
import { http } from "./lib/http";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export type Named = { name: string };
export type Company = { name: string };
export type Involved = { company: Company; developer?: boolean; publisher?: boolean };

export type Web = { url: string; category?: number };
export type Media = { url: string };
export type SimilarGame = { id: number; name: string; cover?: { url: string } };

export type GameDetails = {
  id: number;
  name: string;
  summary?: string;
  storyline?: string;
  first_release_date?: number;
  rating?: number;                 // user
  aggregated_rating?: number;      // critic
  total_rating?: number;           // sometimes combined
  aggregated_rating_count?: number;
  total_rating_count?: number;
  genres?: Named[];
  themes?: Named[];
  game_modes?: Named[];
  player_perspectives?: Named[];
  platforms?: Named[];
  involved_companies?: Involved[];
  age_ratings?: { category?: number; rating?: number; content_descriptions?: { description: string }[] }[];
  websites?: Web[];
  cover?: Media;
  screenshots?: Media[];
  artworks?: Media[];
  videos?: { video_id: string }[];
  collection?: { name: string };
  similar_games?: SimilarGame[];
};

export async function fetchLatestGames(signal?: AbortSignal): Promise<LatestGame[]> {
  const res = await http.get<LatestGame[]>(`${API_BASE}/api/latest-games`, { signal });
  return res.data;
}

// expects your Flask /api/search/<title> to return the same shape as latest-games
export async function searchGames(q: string, signal?: AbortSignal) {
  if (!q.trim()) return [];
  try {
    const res = await http.get<LatestGame[]>(`${API_BASE}/api/search`, {
      params: { title: q.trim() }, signal
    });
    return res.data;
  } catch (e: any) {
    if (e?.response?.status === 404) {
      const res2 = await http.get<LatestGame[]>(
        `${API_BASE}/api/search/${encodeURIComponent(q.trim())}`, { signal }
      );
      return res2.data;
    }
    throw e;
  }
}


// details: /api/searchById/<id>
export async function fetchGameById(id: number, signal?: AbortSignal): Promise<GameDetails> {
  const res = await http.get(`${API_BASE}/api/searchById/${id}`, { signal });
  let raw: any = res.data;
  if (typeof raw === "string") { try { raw = JSON.parse(raw); } catch {} }
  raw = raw?.data ?? raw?.result ?? raw?.game ?? raw;
  const item: any = Array.isArray(raw) ? raw[0] : raw;

  // normalize similar games (works if API returns full objects or just IDs)
  const similar = Array.isArray(item?.similar_games)
    ? item.similar_games.map((s: any) =>
        typeof s === "number"
          ? { id: s, name: `Game #${s}` } // fallback if IDs only
          : { id: s?.id, name: s?.name ?? "Unknown", cover: s?.cover?.url ? { url: s.cover.url } : undefined }
      )
    : [];

  return {
    id: item?.id ?? 0,
    name: item?.name ?? item?.title ?? "Unknown",
    summary: item?.summary ?? item?.details ?? "",
    storyline: item?.storyline,
    first_release_date:
      item?.first_release_date ??
      (item?.releaseYear ? Date.UTC(item.releaseYear, 0, 1) / 1000 : undefined),
    aggregated_rating: item?.aggregated_rating ?? item?.total_rating ?? item?.rating,
    rating: item?.rating,
    genres: item?.genres ?? (item?.genre ? [{ name: item.genre }] : []),
    themes: item?.themes,
    game_modes: item?.game_modes,
    player_perspectives: item?.player_perspectives,
    platforms: item?.platforms ?? [],
    involved_companies: item?.involved_companies,
    age_ratings: item?.age_ratings,
    collection: item?.collection,
    cover: item?.cover ?? (item?.imgURL ? { url: item.imgURL } : undefined),
    screenshots: item?.screenshots ?? item?.artworks ?? [],
    artworks: item?.artworks ?? [],
    videos: item?.videos ?? [],
    websites: item?.websites ?? [],
    similar_games: similar,
  };
}


