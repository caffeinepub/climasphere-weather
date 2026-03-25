import { motion } from "motion/react";
import type { AirQualityData } from "../types/weather";

interface AirQualityCardProps {
  data: AirQualityData | null;
  compact?: boolean;
}

const AQI_LEVELS = [
  { label: "Good", color: "#22c55e", range: [0, 1] },
  { label: "Fair", color: "#86efac", range: [1, 2] },
  { label: "Moderate", color: "#facc15", range: [2, 3] },
  { label: "Poor", color: "#f59e0b", range: [3, 4] },
  { label: "Very Poor", color: "#ef4444", range: [4, 5] },
];

function getAqiInfo(aqi: number) {
  return AQI_LEVELS[Math.min(aqi - 1, 4)] || AQI_LEVELS[0];
}

export function AirQualityCard({ data, compact = false }: AirQualityCardProps) {
  const aqiValue = data?.list?.[0]?.main?.aqi ?? null;
  const components = data?.list?.[0]?.components;
  const aqiInfo = aqiValue !== null ? getAqiInfo(aqiValue) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-card rounded-2xl card-shadow p-6 flex flex-col h-full"
      data-ocid="aqi.card"
    >
      <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide mb-4">
        Air Quality Index
      </p>

      {aqiValue === null ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">
            No air quality data available
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {/* Circular badge */}
          <div className="relative w-28 h-28">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full -rotate-90"
              role="img"
              aria-label={`AQI ${aqiValue}`}
            >
              <title>AQI Gauge</title>
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-border"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={aqiInfo?.color}
                strokeWidth="8"
                strokeDasharray={`${(aqiValue / 5) * 264} 264`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground">
                {aqiValue}
              </span>
              <span className="text-xs text-muted-foreground">AQI</span>
            </div>
          </div>

          <div className="text-center">
            <p
              className="font-semibold text-foreground"
              style={{ color: aqiInfo?.color }}
            >
              {aqiInfo?.label}
            </p>
          </div>

          {/* Color scale bar */}
          <div className="w-full">
            <div className="flex rounded-full overflow-hidden h-2 gap-0.5">
              {AQI_LEVELS.map((level, i) => (
                <div
                  key={level.label}
                  className="flex-1 h-full rounded-sm transition-all"
                  style={{
                    backgroundColor: level.color,
                    opacity: aqiValue - 1 >= i ? 1 : 0.25,
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">Good</span>
              <span className="text-xs text-muted-foreground">Very Poor</span>
            </div>
          </div>

          {/* Pollutants (non-compact) */}
          {!compact && components && (
            <div className="w-full mt-2 grid grid-cols-2 gap-2">
              <PollutantRow
                label="PM2.5"
                value={components.pm2_5}
                unit="μg/m³"
              />
              <PollutantRow label="PM10" value={components.pm10} unit="μg/m³" />
              <PollutantRow label="NO₂" value={components.no2} unit="μg/m³" />
              <PollutantRow label="O₃" value={components.o3} unit="μg/m³" />
              <PollutantRow label="CO" value={components.co} unit="μg/m³" />
              {components.so2 !== undefined && (
                <PollutantRow label="SO₂" value={components.so2} unit="μg/m³" />
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function PollutantRow({
  label,
  value,
  unit,
}: { label: string; value: number; unit: string }) {
  return (
    <div className="flex flex-col bg-muted/50 rounded-lg p-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">
        {value.toFixed(1)}{" "}
        <span className="font-normal text-xs text-muted-foreground">
          {unit}
        </span>
      </span>
    </div>
  );
}
