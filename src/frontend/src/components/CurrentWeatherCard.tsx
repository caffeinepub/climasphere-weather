import { Droplets, Eye, Thermometer, Wind } from "lucide-react";
import { motion } from "motion/react";
import type { WeatherData } from "../types/weather";

interface CurrentWeatherCardProps {
  weather: WeatherData;
}

export function CurrentWeatherCard({ weather }: CurrentWeatherCardProps) {
  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const humidity = weather.main.humidity;
  const windKmh = Math.round(weather.wind.speed * 3.6);
  const visibilityKm = weather.visibility
    ? (weather.visibility / 1000).toFixed(1)
    : "N/A";
  const icon = weather.weather[0]?.icon;
  const description = weather.weather[0]?.description;
  const conditionMain = weather.weather[0]?.main;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-2xl card-shadow p-6 flex flex-col justify-between h-full"
      data-ocid="weather.card"
    >
      <div>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide mb-1">
              Current Conditions
            </p>
            <div className="text-huge-temp text-foreground">
              {temp}
              <span className="text-3xl font-normal">°C</span>
            </div>
            <p className="text-muted-foreground text-base capitalize mt-1">
              {description}
            </p>
            <p className="text-muted-foreground text-xs mt-0.5">
              {conditionMain}
            </p>
          </div>
          {icon && (
            <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={description}
              className="w-20 h-20 -mt-2"
            />
          )}
        </div>
      </div>

      {/* Metrics row */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
        <MetricItem
          icon={<Droplets className="w-4 h-4" />}
          label="Humidity"
          value={`${humidity}%`}
        />
        <MetricItem
          icon={<Wind className="w-4 h-4" />}
          label="Wind"
          value={`${windKmh} km/h`}
        />
        <MetricItem
          icon={<Thermometer className="w-4 h-4" />}
          label="Feels Like"
          value={`${feelsLike}°C`}
        />
        <MetricItem
          icon={<Eye className="w-4 h-4" />}
          label="Visibility"
          value={`${visibilityKm} km`}
        />
      </div>
    </motion.div>
  );
}

function MetricItem({
  icon,
  label,
  value,
}: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-primary/70">{icon}</div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
