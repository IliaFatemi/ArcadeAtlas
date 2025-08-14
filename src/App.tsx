import { Routes, Route } from "react-router-dom";
import "./index.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import GameDetails from "./pages/GameDetails";
import Collections from "./pages/Collections";
import About from "./pages/About";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/game/:id" element={<GameDetails />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <footer className="border-t border-slate-800 py-5 text-center text-slate-400 text-xs">
        © {new Date().getFullYear()} ArcadeAtlas
      </footer>
    </div>
  );
}
