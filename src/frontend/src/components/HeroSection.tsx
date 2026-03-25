import { Clock, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { WeatherData } from "../types/weather";

interface HeroSectionProps {
  weather: WeatherData | null;
  city: string;
}

export function HeroSection({ weather, city }: HeroSectionProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="hero-gradient py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-white/60" />
          <span className="text-white/60 text-sm">
            {weather
              ? `${weather.coord.lat.toFixed(2)}°N, ${weather.coord.lon.toFixed(2)}°E`
              : "—"}
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
          {weather ? `${weather.name}, ${weather.sys.country}` : city}
        </h1>
        <p className="text-white/50 text-sm mt-3 flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatTime(time)}
          </span>
          <span className="w-px h-4 bg-white/20" />
          <span>{formatDate(time)}</span>
        </p>
      </motion.div>
    </div>
  );
}
