import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { LatestGame } from "../types";

export default function GameCard({ game }: { game: LatestGame }) {
  const { imgURL, title, details, genre, releaseYear, id } = game;
  console.log(game);
  return (
    <motion.article
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group overflow-hidden rounded-xl bg-slate-900 border border-slate-800"
    >
      <div className="aspect-[16/9] relative">
        {imgURL ? (
          <img
            src={imgURL}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full bg-slate-800" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-100 truncate">
            {title}
          </h3>
          {releaseYear && (
            <span className="text-[10px] text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">
              {releaseYear}
            </span>
          )}
        </div>
        <div className="mt-1 text-[11px] text-indigo-300">
          {genre || "Unknown"}
        </div>
        <p className="mt-1 text-[13px] leading-5 text-slate-300 line-clamp-3">
          {details || "No description available."}
        </p>

        <Link
          to={`/game/${id}`}
          // state={{ preview: game }}
          className="inline-block mt-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 px-3 py-1.5 text-xs font-medium text-white transition-colors"
        >
          View details
        </Link>
      </div>
    </motion.article>
  );
}
