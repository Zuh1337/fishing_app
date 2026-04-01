export type FishingCondition = 'excellent' | 'good' | 'fair' | 'poor';

export type FishingReport = {
  id: string;
  userName: string;
  speciesCaught: string;
  notes: string;
  condition: FishingCondition;
  lat: number;
  lng: number;
  timestampIso: string;
  waterTempC?: number;
};

export type WeatherSnapshot = {
  temperatureC: number;
  windSpeedKph: number;
  weatherCode: number;
  fetchedAtIso: string;
};
