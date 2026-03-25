import { motion } from "motion/react";
import { AirQualityCard } from "../components/AirQualityCard";
import { CurrentWeatherCard } from "../components/CurrentWeatherCard";
import { ErrorCard } from "../components/ErrorCard";
import { ForecastSection } from "../components/ForecastSection";
import { HeroSection } from "../components/HeroSection";
import { RadarMap } from "../components/RadarMap";
import type {
  AirQualityData,
  ForecastData,
  WeatherData,
} from "../types/weather";

interface HomePageProps {
  weather: WeatherData | null;
  forecast: ForecastData | null;
  airQuality: AirQualityData | null;
  loading: boolean;
  error: string | null;
  city: string;
  onRetry: () => void;
}

export function HomePage({
  weather,
  forecast,
  airQuality,
  loading,
  error,
  city,
  onRetry,
}: HomePageProps) {
  return (
    <>
      <HeroSection weather={weather} city={city} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {error && !loading ? (
          <ErrorCard message={error} onRetry={onRetry} />
        ) : (
          <>
            {/* Top cards row */}
            {weather && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="md:col-span-2">
                  <CurrentWeatherCard weather={weather} />
                </div>
                <div>
                  <AirQualityCard data={airQuality} compact />
                </div>
              </motion.div>
            )}

            {/* 5-Day Forecast */}
            {forecast && <ForecastSection forecast={forecast} />}

            {/* Radar preview */}
            {weather && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <h2 className="text-lg font-bold text-foreground mb-4">
                  Weather Radar
                </h2>
                <RadarMap
                  lat={weather.coord.lat}
                  lon={weather.coord.lon}
                  height="360px"
                />
              </motion.div>
            )}

            {/* Placeholder when no weather yet */}
            {!weather && !error && !loading && (
              <div className="text-center py-16 text-muted-foreground">
                <p>Search for a city to see weather data.</p>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
