import { useCallback, useState } from "react";
import type {
  AirQualityData,
  ForecastData,
  WeatherData,
} from "../types/weather";
import { useActor } from "./useActor";

const HISTORY_KEY = "climasphere_search_history";
const DARK_MODE_KEY = "climasphere_dark_mode";

// Type alias for the weather API methods on the actor
interface WeatherActor {
  getWeather: (city: string) => Promise<string>;
  getForecast: (city: string) => Promise<string>;
  getAirQuality: (lat: string, lon: string) => Promise<string>;
}

export function useWeather() {
  const { actor } = useActor();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState<string>("London");
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") as string[];
    } catch {
      return [];
    }
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(DARK_MODE_KEY);
      return stored ? (JSON.parse(stored) as boolean) : false;
    } catch {
      return false;
    }
  });

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem(DARK_MODE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addToHistory = useCallback((city: string) => {
    setSearchHistory((prev) => {
      const filtered = prev.filter(
        (c) => c.toLowerCase() !== city.toLowerCase(),
      );
      const next = [city, ...filtered].slice(0, 5);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const fetchWeather = useCallback(
    async (city: string) => {
      if (!actor) {
        setError("Service not ready. Please wait a moment and try again.");
        return;
      }

      // Cast to WeatherActor to access the typed methods
      const weatherActor = actor as unknown as WeatherActor;

      setLoading(true);
      setError(null);

      try {
        const [weatherRaw, forecastRaw] = await Promise.all([
          weatherActor.getWeather(city),
          weatherActor.getForecast(city),
        ]);

        let weatherData: WeatherData;
        let forecastData: ForecastData;

        try {
          weatherData = JSON.parse(weatherRaw) as WeatherData;
        } catch {
          throw new Error("Failed to parse weather data");
        }

        try {
          forecastData = JSON.parse(forecastRaw) as ForecastData;
        } catch {
          throw new Error("Failed to parse forecast data");
        }

        const codStr = String(weatherData.cod ?? "");
        if (codStr === "404") {
          throw new Error("City not found. Please try another search.");
        }
        if (codStr === "401") {
          throw new Error(
            "Invalid API key. Please configure your OpenWeatherMap API key.",
          );
        }
        if (codStr !== "200" && codStr !== "") {
          throw new Error(
            weatherData.message || "Failed to fetch weather data",
          );
        }

        setWeather(weatherData);
        setForecast(forecastData);
        setCurrentCity(city);
        addToHistory(city);

        // Fetch air quality using coordinates
        if (weatherData.coord) {
          try {
            const aqRaw = await weatherActor.getAirQuality(
              String(weatherData.coord.lat),
              String(weatherData.coord.lon),
            );
            const aqData = JSON.parse(aqRaw) as AirQualityData;
            setAirQuality(aqData);
          } catch {
            setAirQuality(null);
          }
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch weather data";
        setError(message);
        setWeather(null);
        setForecast(null);
        setAirQuality(null);
      } finally {
        setLoading(false);
      }
    },
    [actor, addToHistory],
  );

  return {
    weather,
    forecast,
    airQuality,
    loading,
    error,
    currentCity,
    searchHistory,
    darkMode,
    fetchWeather,
    toggleDarkMode,
  };
}
