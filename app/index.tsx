import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, MapPressEvent, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import ReportComposer from '../src/components/ReportComposer';
import { FishingReport, WeatherSnapshot } from '../src/types/fishing';
import { getWeatherSnapshot } from '../src/services/weather';

const seedReports: FishingReport[] = [
  {
    id: 'seed-1',
    userName: 'Mia R.',
    speciesCaught: 'Striped Bass',
    notes: 'Early morning bite. Soft plastics near channel edge worked best.',
    condition: 'excellent',
    lat: 37.8078,
    lng: -122.4177,
    timestampIso: '2026-03-30T12:40:00.000Z',
  },
];

const defaultRegion: Region = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.18,
  longitudeDelta: 0.15,
};

export default function App() {
  const [region, setRegion] = useState<Region>(defaultRegion);
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);
  const [reports, setReports] = useState<FishingReport[]>(seedReports);
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      setRegion((prev) => ({
        ...prev,
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      }));
    })();
  }, []);

  useEffect(() => {
    const target = pin ?? { lat: region.latitude, lng: region.longitude };
    getWeatherSnapshot(target.lat, target.lng)
      .then(setWeather)
      .catch(() => setWeather(null));
  }, [region.latitude, region.longitude, pin]);

  const onMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setPin({ lat: latitude, lng: longitude });
  };

  const feed = useMemo(
    () => [...reports].sort((a, b) => +new Date(b.timestampIso) - +new Date(a.timestampIso)),
    [reports],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Fishing Conditions</Text>
        <Text style={styles.subHeader}>Map + real-time field reports for anglers.</Text>

        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          onPress={onMapPress}
        >
          {pin && <Marker coordinate={{ latitude: pin.lat, longitude: pin.lng }} title="Your pin" />}
          {reports.map((report) => (
            <Marker
              key={report.id}
              coordinate={{ latitude: report.lat, longitude: report.lng }}
              title={`${report.userName}: ${report.speciesCaught}`}
              description={report.notes}
            />
          ))}
        </MapView>

        <View style={styles.weatherCard}>
          <Text style={styles.cardTitle}>Current weather snapshot</Text>
          {weather ? (
            <Text>
              {weather.temperatureC}°C • wind {weather.windSpeedKph} km/h • code {weather.weatherCode}
            </Text>
          ) : (
            <Text>Weather unavailable. Check network/API availability.</Text>
          )}
        </View>

        <ReportComposer
          lat={pin?.lat ?? region.latitude}
          lng={pin?.lng ?? region.longitude}
          onSubmit={(newReport) => setReports((prev) => [newReport, ...prev])}
        />

        <View style={styles.feed}>
          <Text style={styles.cardTitle}>Recent updates</Text>
          {feed.map((item) => (
            <View style={styles.feedItem} key={item.id}>
              <Text style={styles.feedTitle}>
                {item.userName} • {item.speciesCaught}
              </Text>
              <Text style={styles.feedMeta}>
                {item.condition.toUpperCase()} • {new Date(item.timestampIso).toLocaleString()}
              </Text>
              <Text>{item.notes}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EEF2FF' },
  content: { padding: 14, paddingBottom: 48 },
  header: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  subHeader: { marginTop: 4, marginBottom: 10, color: '#334155' },
  map: { height: 300, borderRadius: 12 },
  weatherCard: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  feed: { marginTop: 12, gap: 8 },
  feedItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  feedTitle: { fontWeight: '700' },
  feedMeta: { color: '#475569', marginBottom: 4 },
});
