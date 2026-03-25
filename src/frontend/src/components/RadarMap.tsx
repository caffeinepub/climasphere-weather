import { useEffect, useRef } from "react";

interface RadarMapProps {
  lat?: number;
  lon?: number;
  height?: string;
}

declare global {
  interface Window {
    L: any;
    _leafletLoaded?: boolean;
  }
}

function loadLeafletCss() {
  if (document.getElementById("leaflet-css")) return;
  const link = document.createElement("link");
  link.id = "leaflet-css";
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  document.head.appendChild(link);
}

function loadLeafletJs(): Promise<void> {
  return new Promise((resolve) => {
    if (window.L) {
      resolve();
      return;
    }
    if (document.getElementById("leaflet-js")) {
      // Already loading - wait
      const interval = setInterval(() => {
        if (window.L) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
      return;
    }
    const script = document.createElement("script");
    script.id = "leaflet-js";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

export function RadarMap({
  lat = 51.5074,
  lon = -0.1278,
  height = "400px",
}: RadarMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    loadLeafletCss();

    let mounted = true;

    loadLeafletJs().then(() => {
      if (!mounted || !mapContainerRef.current) return;
      const L = window.L;

      // Destroy existing map if any
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [lat, lon],
        zoom: 6,
        zoomControl: true,
      });
      mapRef.current = map;

      // Base tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Precipitation overlay (OWM) - will only work with real API key
      // This is a demonstration layer
      L.tileLayer(
        "https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=PLACEHOLDER",
        {
          attribution: "© OpenWeatherMap",
          opacity: 0.6,
          maxZoom: 19,
        },
      ).addTo(map);

      // City marker
      const icon = L.divIcon({
        html: `<div style="width:12px;height:12px;border-radius:50%;background:#2F5F8F;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
        className: "",
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });
      L.marker([lat, lon], { icon }).addTo(map);
    });

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lon]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden card-shadow"
      style={{ height }}
      data-ocid="radar.card"
    >
      <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
      <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-navy-dark/90 backdrop-blur-sm text-xs text-muted-foreground px-2 py-1 rounded-md">
        🌧 Precipitation layer requires valid OWM API key
      </div>
    </div>
  );
}
