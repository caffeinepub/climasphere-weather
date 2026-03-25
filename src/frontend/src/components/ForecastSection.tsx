import { motion } from "motion/react";
import type { ForecastData, ForecastItem } from "../types/weather";

interface ForecastSectionProps {
  forecast: ForecastData;
}

function groupByDay(list: ForecastItem[]): Record<string, ForecastItem[]> {
  return list.reduce(
    (acc, item) => {
      const day = item.dt_txt.split(" ")[0];
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    },
    {} as Record<string, ForecastItem[]>,
  );
}

function getDayLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function ForecastSection({ forecast }: ForecastSectionProps) {
  const grouped = groupByDay(forecast.list);
  const days = Object.entries(grouped).slice(0, 5);

  return (
    <div className="mt-6" data-ocid="forecast.section">
      <h2 className="text-lg font-bold text-foreground mb-4">5-Day Forecast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 overflow-x-auto pb-2">
        {days.map(([dateStr, items], i) => {
          // Use noon entry or first entry
          const noonEntry =
            items.find((it) => it.dt_txt.includes("12:00")) || items[0];
          const temps = items.map((it) => it.main.temp);
          const maxTemp = Math.round(Math.max(...temps));
          const minTemp = Math.round(Math.min(...temps));
          const icon = noonEntry.weather[0]?.icon;
          const description = noonEntry.weather[0]?.description;
          const pop = Math.round((noonEntry.pop || 0) * 100);

          return (
            <motion.div
              key={dateStr}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className="bg-card rounded-xl card-shadow p-4 flex flex-col items-center gap-2 text-center"
              data-ocid={`forecast.item.${i + 1}`}
            >
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {getDayLabel(dateStr)}
              </p>
              {icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                  alt={description}
                  className="w-12 h-12"
                />
              )}
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="text-foreground">{maxTemp}°</span>
                <span className="text-muted-foreground font-normal">/</span>
                <span className="text-muted-foreground">{minTemp}°</span>
              </div>
              <p className="text-xs text-muted-foreground capitalize leading-tight">
                {description}
              </p>
              <p className="text-xs text-primary font-medium">💧 {pop}%</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
