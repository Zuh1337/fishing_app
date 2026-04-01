# Fishing Conditions App

A mobile-first concept application that blends map-based reporting (like social feeds) with local environmental context (like weather apps), focused on anglers sharing real-time fishing conditions.

## Product vision

Enable anglers to quickly answer:
1. **Where is action happening?**
2. **What are the current conditions?**
3. **What techniques/species are productive right now?**

This MVP provides:
- Interactive map with user-selected pin drops.
- Live weather snapshot for selected map area (Open-Meteo API).
- In-app reporting form to post a fishing update.
- Scrolling feed of recent reports.

---

## Research summary (for MVP decisions)

- **Cross-platform stack:** Expo + React Native keeps iteration fast across iOS/Android.
- **Maps:** `react-native-maps` remains the practical default for custom markers and map interactions in React Native apps.
- **Weather provider:** Open-Meteo offers unauthenticated current weather data and broad coverage, reducing onboarding friction for early prototypes.
- **Location:** `expo-location` handles runtime permission flow and current position retrieval.

These choices optimize for speed-to-MVP, while leaving room to migrate to production-grade mapping/forecast services later.

---

## System design plan

### 1) Client (current repository)
- Map screen and regional context.
- Report composer and in-memory feed.
- Weather lookup service.

### 2) Backend (next phase)
- Auth (phone/email/social).
- Report persistence + moderation flags.
- Geospatial query endpoint (`nearby reports by viewport`).
- Push notifications for watched spots.

### 3) Data model (target)
- User profile, trust score, privacy preferences.
- Fishing reports with species, method, condition score, media.
- Spot metadata (salt/freshwater, access, regulations).
- Cached weather/tide/wind observations.

### 4) Quality and safety
- Basic profanity/media moderation pipeline.
- Report confidence ranking (recency + user reliability).
- Optional coordinate obfuscation for sensitive spots.

---

## Delivery roadmap

### Phase 0 (done here)
- [x] Interactive map with pin drop.
- [x] Real-time weather request by selected coordinates.
- [x] Report compose + local feed rendering.

### Phase 1
- [ ] Backend + DB (Supabase/Firebase/Postgres).
- [ ] Photo uploads.
- [ ] Real-time subscriptions for nearby updates.
- [ ] Session/auth support.

### Phase 2
- [ ] Tides, moon phase, solunar windows.
- [ ] Species-specific forecasting hints.
- [ ] Personalized spot watchlists and alerts.

### Phase 3
- [ ] Trust ranking and anti-spam controls.
- [ ] Offline mode + sync.
- [ ] Local regulation overlays.

---

## Getting started

```bash
npm install
npm run start
```

Then open in Expo Go or simulator.

## Key files

- `app/index.tsx`: main map/feed screen and interactions.
- `src/components/ReportComposer.tsx`: report form UI.
- `src/services/weather.ts`: weather API client.
- `src/types/fishing.ts`: domain types.

## Suggested next implementation tasks

1. Add backend persistence and map viewport querying.
2. Add image attachments to reports.
3. Add clustering for dense marker regions.
4. Add condition scoring derived from weather/tide history.
