import { Link } from "@tanstack/react-router";
import { Cloud, Moon, Search, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface NavbarProps {
  onSearch: (city: string) => void;
  searchHistory: string[];
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Navbar({
  onSearch,
  searchHistory,
  darkMode,
  onToggleDarkMode,
}: NavbarProps) {
  const [query, setQuery] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery("");
      setShowHistory(false);
    }
  };

  const handleHistoryClick = (city: string) => {
    onSearch(city);
    setQuery("");
    setShowHistory(false);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowHistory(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredHistory = searchHistory.filter(
    (c) => !query || c.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <header className="sticky top-0 z-40 bg-navy-dark border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 flex-shrink-0"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight hidden sm:block">
            ClimaSphere
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          <Link
            to="/"
            className="px-3 py-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
            data-ocid="nav.link"
          >
            My Weather
          </Link>
          <Link
            to="/radar"
            className="px-3 py-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
            data-ocid="nav.link"
          >
            Maps
          </Link>
          <Link
            to="/air-quality"
            className="px-3 py-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-md text-sm font-medium transition-colors"
            data-ocid="nav.link"
          >
            Alerts
          </Link>
        </nav>

        <div className="flex-1" />

        {/* Search bar */}
        <div className="relative" ref={containerRef}>
          <form onSubmit={handleSubmit} className="flex items-center">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowHistory(true)}
                placeholder="Search for city…"
                className="w-44 sm:w-56 bg-white/10 text-white placeholder-white/40 text-sm px-3 py-1.5 pr-8 rounded-lg border border-white/20 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
                data-ocid="nav.search_input"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                data-ocid="nav.button"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* History dropdown */}
          <AnimatePresence>
            {showHistory && filteredHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute right-0 top-full mt-1 w-56 bg-popover border border-border rounded-lg shadow-card-md overflow-hidden z-50"
                data-ocid="nav.dropdown_menu"
              >
                <p className="px-3 py-2 text-xs text-muted-foreground font-medium uppercase tracking-wide border-b border-border">
                  Recent searches
                </p>
                {filteredHistory.map((city, i) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleHistoryClick(city)}
                    className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors flex items-center gap-2"
                    data-ocid={`nav.item.${i + 1}`}
                  >
                    <Search className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    {city}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dark mode toggle */}
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors flex-shrink-0"
          aria-label="Toggle dark mode"
          data-ocid="nav.toggle"
        >
          {darkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
}
