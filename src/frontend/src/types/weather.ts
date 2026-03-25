export interface WeatherData {
  name: string;
  sys: { country: string };
  coord: { lat: number; lon: number };
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
  };
  wind: { speed: number };
  weather: Array<{ main: string; description: string; icon: string }>;
  visibility: number;
  dt: number;
  cod?: number | string;
  message?: string;
}

export interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{ main: string; description: string; icon: string }>;
  pop: number;
  wind: { speed: number };
}

export interface ForecastData {
  list: ForecastItem[];
  city: { name: string; country: string };
  cod?: string | number;
  message?: string;
}

export interface AirQualityData {
  list: Array<{
    main: { aqi: number };
    components: {
      co: number;
      no2: number;
      o3: number;
      pm2_5: number;
      pm10: number;
      so2?: number;
      nh3?: number;
    };
  }>;
  cod?: string | number;
  message?: string;
}

export interface AppState {
  city: string;
  weather: WeatherData | null;
  forecast: ForecastData | null;
  airQuality: AirQualityData | null;
  loading: boolean;
  error: string | null;
  darkMode: boolean;
  searchHistory: string[];
}
