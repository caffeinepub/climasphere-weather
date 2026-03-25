import { RadarMap } from "../components/RadarMap";
import type { WeatherData } from "../types/weather";

interface RadarPageProps {
  weather: WeatherData | null;
  city: string;
}

export function RadarPage({ weather, city }: RadarPageProps) {
  return (
    <>
      <div className="hero-gradient py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Weather Radar
          </h1>
          <p className="text-white/50 text-sm mt-2">
            {weather ? `${weather.name}, ${weather.sys.country}` : city}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div
          className="bg-card rounded-2xl card-shadow p-4"
          data-ocid="radar.card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">
              Precipitation Radar
            </h2>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
              Live data requires OWM API key
            </span>
          </div>
          <RadarMap
            lat={weather?.coord?.lat}
            lon={weather?.coord?.lon}
            height="520px"
          />
        </div>
      </main>
    </>
  );
}
