import { useUserData } from "../userdata/store";
import type { ListType } from "../userdata/types";
import { Link } from "react-router-dom";

const lists: { key: ListType; label: string }[] = [
  { key: "favorites", label: "Favorites" },
  { key: "wishlist", label: "Wishlist" },
  { key: "playing", label: "Playing" },
  { key: "completed", label: "Completed" },
  { key: "backlog", label: "Backlog" },
];

export default function Collections() {
  const { state, dispatch } = useUserData();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
        My Collections
      </h1>

      {lists.map(({ key, label }) => {
        const items = Object.values(state.lists[key] ?? {});
        return (
          <section key={key} className="mt-6">
            <h2 className="text-lg font-semibold">
              {label} <span className="text-slate-400">({items.length})</span>
            </h2>
            {items.length === 0 ? (
              <p className="mt-2 text-slate-400 text-sm">Nothing here yet.</p>
            ) : (
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((g) => (
                  <div
                    key={g.id}
                    className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden"
                  >
                    <Link to={`/game/${g.id}`} className="block">
                      <div className="aspect-[16/9] bg-slate-800">
                        {g.imgURL && (
                          <img
                            src={g.imgURL}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-3">
                        <div className="text-sm font-semibold">{g.title}</div>
                        <div className="text-xs text-slate-400">
                          {g.genre ?? ""}
                        </div>
                      </div>
                    </Link>
                    <div className="p-3 pt-0">
                      <button
                        onClick={() =>
                          dispatch({
                            type: "REMOVE_FROM_LIST",
                            list: key,
                            gameId: g.id,
                          })
                        }
                        className="text-xs rounded-md border border-slate-700 hover:bg-slate-800 px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
