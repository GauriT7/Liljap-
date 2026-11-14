# little japan — your trip companion

A responsive, installable static travel companion for 4–14 December 2026: Tokyo → Kawaguchiko / Mt Fuji → Kyoto → Osaka + Nara → KIX.

## Run locally

```bash
python3 -m http.server 8000
```

Open http://localhost:8000. Use HTTPS or localhost for service-worker/PWA support.

## Publish with GitHub Pages

1. Create a new repository, e.g. `little-japan`.
2. Upload every file in this folder to the repository root.
3. Open **Settings → Pages → Deploy from a branch → main → /(root)**.
4. Save and open `https://YOUR-USERNAME.github.io/little-japan/`.
5. On iPhone, open the deployed site in Safari and choose **Share → Add to Home Screen**.

## Features

- Current December 4–14 itinerary; the old November draft is inspiration only and does not replace the current dates.
- Day cards, stop check-offs, day status and city filters.
- Leaflet + OpenStreetMap pins, category filters, search, favourites, directions and saved place list. Tile maps need internet; pin coordinates are approximate.
- Mood-led discoveries and low-energy / rainy-day / hidden-Fuji / slow-local-day fallback plans.
- Onsen shortlist, with explicit private-bath vs shared-bath / private-rest-room caveats. Prices are planning estimates, not verified live quotes or booking offers.
- Open-Meteo current weather and forecast where the provider's forecast horizon supports it. Forecasts for December 4–14 will only become available as those dates enter the forecast window. Fuji cloud cover is not a mountain webcam or a visibility guarantee.
- Booking status board with official links. It is a manual tracker: it does not purchase tickets, reserve seats, check availability or confirm email/QR codes.
- Transport launchpad linking live route services and operator timetables. There is no universal train API integration, live platform feed or disruption feed embedded in this static app.
- Yen expense log with editable INR planning rate.
- Pre-trip checklist, categorized packing list and Japanese phrases with speech playback where browser support exists.
- Local document/confirmation index (links and reference labels only; do not store sensitive identity/payment data).
- Memory journal with compressed photos, dates, locations and notes.
- JSON backup/export and restore for local app data; print/save guide.
- Dark mode, mobile layout, service-worker shell caching and browser-local persistence.

## Data, privacy and limitations

- Checklist, completed stops, favourites, spending, booking statuses, document index, packing ticks, and journal entries are stored in browser localStorage on that device. Export a JSON backup to move state between browsers/devices. Clearing browser data can erase it.
- Photos are resized and stored locally in browser storage. Add only a few per entry; large photo collections can hit browser quota. Keep the originals in your normal photo library / cloud backup.
- The app does not upload journal data to a server. Anyone with access to the same browser profile may see local entries.
- OpenStreetMap map tiles, weather feed, external directions and provider pages require internet. The service worker caches the app shell only; it is not a complete offline map or live itinerary sync.
- Weather is sourced from Open-Meteo and is only useful inside its forecast horizon. Recheck 1–3 days before each outdoor plan.
- Train departure / delay / platform information is not directly integrated. Use the linked official operator services / NAVITIME / Google Maps and station announcements.
- Booking links are provided for convenience. No inventory, pricing or checkout is connected. Booking status is user-entered.
- Onsen rates and eligibility are research-note estimates. Confirm exact prices, mixed-gender/family restrictions, guest-only rules, tattoo policy, time slots and reservations directly with each venue.
- This is a personal planning tool, not an emergency service or official travel provider. Confirm current rules, operating hours, transport, ticket details and contact numbers with official sources.

## Content provenance

The itinerary and saved-place selection were reconciled from the current Japan trip notes, `JAPAN!!! - Google Maps.pdf`, and `J_4.0.pdf`. `J_4.0.pdf` had a separate November draft; it was not used to overwrite the current December 4–14 dates. Added suggestions are clearly travel-planning ideas, not guaranteed bookings or venue endorsements.