import { useState } from "react";
import { useUserData } from "../userdata/store";
import type { Review } from "../userdata/types";

export default function ReviewsSection({ gameId }: { gameId: number }) {
  const { state, dispatch } = useUserData();
  const [rating, setRating] = useState(8);
  const [text, setText] = useState("");

  const list = state.reviews[gameId] ?? [];
  const avg = list.length
    ? Math.round((list.reduce((a, r) => a + r.rating, 0) / list.length) * 10) /
      10
    : null;

  function submit() {
    const review: Review = {
      gameId,
      rating,
      text: text.trim() || undefined,
      createdAt: Date.now(),
    };
    dispatch({ type: "ADD_REVIEW", review });
    setText("");
    setRating(8);
  }

  return (
    <section
      className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5"
      style={{ marginBottom: "10px" }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Reviews & Ratings</h2>
        <div className="text-sm text-slate-300">
          {avg ? (
            <>
              Avg: <span className="font-medium">{avg}/10</span> · {list.length}{" "}
              review(s)
            </>
          ) : (
            "No reviews yet"
          )}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="mt-3 flex items-center gap-2"
      >
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="select w-28 shrink-0"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1} / 10
            </option>
          ))}
        </select>

        <button type="submit" className="btn shrink-0">
          Submit
        </button>
      </form>
      {/* second row: full-width review input */}
      <div className="mt-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a short review (optional)"
          className="input w-full min-w-0"
        />
      </div>
      {list.length > 0 && (
        <ul className="mt-4 space-y-3">
          {list.map((r, i) => (
            <li
              key={i}
              className="rounded-md border border-slate-800 bg-slate-950/60 p-3"
            >
              <div className="text-sm">
                <span className="font-medium">{r.rating}/10</span> ·{" "}
                <span className="text-slate-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>
              {r.text && (
                <div className="mt-1 text-[13.5px] text-slate-300">
                  {r.text}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
