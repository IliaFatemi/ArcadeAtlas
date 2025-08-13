// src/components/AchievementsSection.tsx
import { useState } from "react";
import { useUserData } from "../userdata/store";
import type { Achievement } from "../userdata/types";

export default function AchievementsSection({ gameId }: { gameId: number }) {
  const { state, dispatch } = useUserData();
  const list: Achievement[] = state.achievements[gameId] ?? [];
  const [title, setTitle] = useState("");

  const unlocked = list.filter((a) => a.unlocked).length;
  const pct = list.length ? Math.round((unlocked / list.length) * 100) : 0;

  function add() {
    const t = title.trim();
    if (!t) return;
    dispatch({ type: "ADD_ACHIEVEMENT", gameId, title: t });
    setTitle("");
  }

  return (
    <section className="card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Achievements</h2>
        <div className="text-sm text-slate-300">
          {unlocked}/{list.length} unlocked ({pct}%)
        </div>
      </div>

      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add new achievement"
          className="input flex-1 min-w-0"
        />
        <button onClick={add} className="btn w-full sm:w-auto">
          Add
        </button>
      </div>

      {list.length > 0 && (
        <ul className="mt-4 space-y-2">
          {list.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2"
            >
              <label className="flex items-center gap-2 text-sm min-w-0">
                <input
                  type="checkbox"
                  checked={a.unlocked}
                  onChange={() =>
                    dispatch({ type: "TOGGLE_ACHIEVEMENT", gameId, id: a.id })
                  }
                />
                <span
                  className={
                    (a.unlocked ? "line-through text-slate-400 " : "") +
                    "truncate"
                  }
                >
                  {a.title}
                </span>
              </label>
              {a.unlocked && (
                <span className="text-[11px] text-slate-400">
                  {new Date(a.dateUnlocked!).toLocaleDateString()}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
