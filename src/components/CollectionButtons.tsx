// src/components/CollectionButtons.tsx
import { useUserData } from "../userdata/store";
import type { ListType, GameSnap } from "../userdata/types";
import type { GameDetails } from "../api";

const lists: ListType[] = [
  "favorites",
  "wishlist",
  "playing",
  "completed",
  "backlog",
];

export default function CollectionButtons({
  game,
  year,
}: {
  game: GameDetails;
  year?: number;
}) {
  const { state, dispatch } = useUserData(); // hook is always called (component mounts only when visible)

  const snap: GameSnap = {
    id: game.id,
    title: game.name,
    imgURL: game.cover?.url?.startsWith("//")
      ? `https:${game.cover.url}`
      : game.cover?.url,
    genre: game.genres?.[0]?.name ?? null,
    releaseYear: year ?? null,
  };

  const inList = (l: ListType) => Boolean(state.lists[l]?.[game.id]);
  const toggle = (l: ListType) =>
    inList(l)
      ? dispatch({ type: "REMOVE_FROM_LIST", list: l, gameId: game.id })
      : dispatch({ type: "ADD_TO_LIST", list: l, snap });

  return (
    <div className="mt-6">
      <h3 className="text-base font-semibold">Add to Collection</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {lists.map((l) => (
          <button
            key={l}
            onClick={() => toggle(l)}
            className={`px-2.5 py-1.5 text-xs rounded-md border ${
              inList(l)
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "border-slate-700 hover:bg-slate-800"
            }`}
          >
            {inList(l) ? "✓ " : ""}
            {l.charAt(0).toUpperCase() + l.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
