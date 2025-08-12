import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import GameDetails from "./pages/GameDetails";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/game/:id" element={<GameDetails />} />
        </Routes>
        <footer className="border-t border-slate-800 py-5 text-center text-slate-400 text-xs">
          © {new Date().getFullYear()} ArcadeAtlas
        </footer>
      </div>
    </BrowserRouter>
  );
}
