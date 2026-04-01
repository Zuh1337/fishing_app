import { WeatherSnapshot } from '../types/fishing';

type OpenMeteoCurrent = {
  temperature_2m: number;
  wind_speed_10m: number;
  weather_code: number;
  time: string;
};

type OpenMeteoResponse = {
  current?: OpenMeteoCurrent;
};

function assertValidCurrent(data: OpenMeteoResponse): asserts data is { current: OpenMeteoCurrent } {
  if (!data.current) {
    throw new Error('Open-Meteo response missing current weather payload');
  }
}

export async function getWeatherSnapshot(
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    current: 'temperature_2m,wind_speed_10m,weather_code',
    wind_speed_unit: 'kmh',
    timezone: 'auto',
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal });

  if (!response.ok) {
    throw new Error(`Open-Meteo request failed with status ${response.status}`);
  }

  const data = (await response.json()) as OpenMeteoResponse;
  assertValidCurrent(data);

  return {
    temperatureC: data.current.temperature_2m,
    windSpeedKph: data.current.wind_speed_10m,
    weatherCode: data.current.weather_code,
    fetchedAtIso: data.current.time,
  };
}
