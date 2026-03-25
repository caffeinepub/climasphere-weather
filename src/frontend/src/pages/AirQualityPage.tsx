import { motion } from "motion/react";
import { AirQualityCard } from "../components/AirQualityCard";
import type { AirQualityData, WeatherData } from "../types/weather";

interface AirQualityPageProps {
  airQuality: AirQualityData | null;
  weather: WeatherData | null;
  city: string;
}

const AQI_DESCRIPTIONS: Record<
  number,
  { label: string; color: string; desc: string }
> = {
  1: {
    label: "Good",
    color: "#22c55e",
    desc: "Air quality is satisfactory and poses little or no risk.",
  },
  2: {
    label: "Fair",
    color: "#86efac",
    desc: "Air quality is acceptable; however, there may be a moderate health concern for a very small number of sensitive people.",
  },
  3: {
    label: "Moderate",
    color: "#facc15",
    desc: "Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
  },
  4: {
    label: "Poor",
    color: "#f59e0b",
    desc: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects.",
  },
  5: {
    label: "Very Poor",
    color: "#ef4444",
    desc: "Health alert: everyone may experience more serious health effects.",
  },
};

export function AirQualityPage({
  airQuality,
  weather,
  city,
}: AirQualityPageProps) {
  const aqi = airQuality?.list?.[0]?.main?.aqi ?? null;
  const components = airQuality?.list?.[0]?.components;
  const aqiInfo = aqi !== null ? AQI_DESCRIPTIONS[aqi] : null;

  return (
    <>
      <div className="hero-gradient py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Air Quality
          </h1>
          <p className="text-white/50 text-sm mt-2">
            {weather ? `${weather.name}, ${weather.sys.country}` : city}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {!airQuality ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>No air quality data available. Search for a city first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AirQualityCard data={airQuality} compact={false} />

            {/* Status info */}
            {aqiInfo && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-2xl card-shadow p-6 flex flex-col gap-4"
                data-ocid="aqi.panel"
              >
                <div
                  className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white w-fit"
                  style={{ backgroundColor: aqiInfo.color }}
                >
                  {aqiInfo.label}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {aqiInfo.desc}
                </p>

                {components && (
                  <div className="mt-2">
                    <h3 className="font-semibold text-foreground mb-3 text-sm">
                      Pollutant Details
                    </h3>
                    <table className="w-full text-sm" data-ocid="aqi.table">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left text-muted-foreground font-medium py-2">
                            Pollutant
                          </th>
                          <th className="text-right text-muted-foreground font-medium py-2">
                            Concentration
                          </th>
                          <th className="text-right text-muted-foreground font-medium py-2">
                            Unit
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "PM2.5", val: components.pm2_5 },
                          { name: "PM10", val: components.pm10 },
                          { name: "NO₂", val: components.no2 },
                          { name: "O₃", val: components.o3 },
                          { name: "CO", val: components.co },
                          ...(components.so2 !== undefined
                            ? [{ name: "SO₂", val: components.so2 }]
                            : []),
                        ].map((row, i) => (
                          <tr
                            key={row.name}
                            className="border-b border-border/50"
                            data-ocid={`aqi.row.${i + 1}`}
                          >
                            <td className="py-2 text-foreground font-medium">
                              {row.name}
                            </td>
                            <td className="py-2 text-right text-foreground">
                              {row.val.toFixed(2)}
                            </td>
                            <td className="py-2 text-right text-muted-foreground">
                              μg/m³
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
