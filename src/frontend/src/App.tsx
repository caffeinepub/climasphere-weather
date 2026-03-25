import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { createContext, useContext, useEffect, useMemo } from "react";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { Navbar } from "./components/Navbar";
import { Toaster } from "./components/ui/sonner";
import { useWeather } from "./hooks/useWeather";
import { AirQualityPage } from "./pages/AirQualityPage";
import { HomePage } from "./pages/HomePage";
import { RadarPage } from "./pages/RadarPage";
import type {
  AirQualityData,
  ForecastData,
  WeatherData,
} from "./types/weather";

interface WeatherContextValue {
  weather: WeatherData | null;
  forecast: ForecastData | null;
  airQuality: AirQualityData | null;
  loading: boolean;
  error: string | null;
  currentCity: string;
  searchHistory: string[];
  darkMode: boolean;
  fetchWeather: (city: string) => Promise<void>;
  toggleDarkMode: () => void;
}

const WeatherContext = createContext<WeatherContextValue | null>(null);

function useWeatherContext() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("WeatherContext missing");
  return ctx;
}

function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);
  return (
    <footer className="bg-navy-dark mt-auto py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-white/40 text-sm">
          © {year}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/70 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
        <div className="flex gap-6 text-white/40 text-sm">
          <span>ClimaSphere Weather</span>
          <span>Powered by OpenWeatherMap</span>
        </div>
      </div>
    </footer>
  );
}

function NavbarWrapper() {
  const { onSearch, searchHistory, darkMode, onToggleDarkMode } = {
    onSearch: useWeatherContext().fetchWeather,
    searchHistory: useWeatherContext().searchHistory,
    darkMode: useWeatherContext().darkMode,
    onToggleDarkMode: useWeatherContext().toggleDarkMode,
  };
  return (
    <Navbar
      onSearch={onSearch}
      searchHistory={searchHistory}
      darkMode={darkMode}
      onToggleDarkMode={onToggleDarkMode}
    />
  );
}

function HomeRoute() {
  const {
    weather,
    forecast,
    airQuality,
    loading,
    error,
    currentCity,
    fetchWeather,
  } = useWeatherContext();
  return (
    <>
      <NavbarWrapper />
      <HomePage
        weather={weather}
        forecast={forecast}
        airQuality={airQuality}
        loading={loading}
        error={error}
        city={currentCity}
        onRetry={() => fetchWeather(currentCity)}
      />
      <Footer />
    </>
  );
}

function AirQualityRoute() {
  const { airQuality, weather, currentCity } = useWeatherContext();
  return (
    <>
      <NavbarWrapper />
      <AirQualityPage
        airQuality={airQuality}
        weather={weather}
        city={currentCity}
      />
      <Footer />
    </>
  );
}

function RadarRoute() {
  const { weather, currentCity } = useWeatherContext();
  return (
    <>
      <NavbarWrapper />
      <RadarPage weather={weather} city={currentCity} />
      <Footer />
    </>
  );
}

// Build router once (outside component)
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Outlet />
    </div>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeRoute,
});

const airQualityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/air-quality",
  component: AirQualityRoute,
});

const radarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/radar",
  component: RadarRoute,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  airQualityRoute,
  radarRoute,
]);
const router = createRouter({ routeTree });

export default function App() {
  const weatherState = useWeather();

  const { darkMode, fetchWeather } = weatherState;

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Fetch default city on first load
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchWeather("London");
  }, [fetchWeather]);

  const contextValue = useMemo(
    () => weatherState,
    // biome-ignore lint/correctness/useExhaustiveDependencies: spread all state
    [weatherState],
  );

  return (
    <WeatherContext.Provider value={contextValue}>
      <LoadingSpinner show={weatherState.loading} />
      <RouterProvider router={router} />
      <Toaster />
    </WeatherContext.Provider>
  );
}
