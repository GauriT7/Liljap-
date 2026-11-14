# little japan — your trip companion

A responsive, static trip companion for the 4–14 December 2026 Japan itinerary: Tokyo → Kawaguchiko / Mt Fuji → Kyoto → Osaka + Nara → KIX.

## Run it locally

You can open `index.html` directly for most features. For the map and installable-app behaviour, run a tiny local server from this folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Publish with GitHub Pages

1. Create a GitHub repository (for example `little-japan-trip`).
2. Upload **all files in this folder** to the repository root: `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, `sw.js`, and `README.md`.
3. In the repository, open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for the Pages deployment. Your site will be available at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.
6. Open the site on your phone and use the browser's **Add to Home Screen** option.

## Features

- Day-by-day itinerary with optional stops and completion tracking.
- OpenStreetMap / Leaflet map with city and category filters, search, favourites and Google Maps directions links.
- Discovery cards for food, quiet neighbourhoods, shopping, photo stops and nightlife.
- Onsen comparison with explicit warnings about private-bath eligibility and shared-bath vs private-room distinctions.
- Yen expense tracker with editable INR planning conversion.
- Packing / booking checklist and Japanese phrase cards with browser speech synthesis.
- Local storage persistence, dark mode and basic service-worker caching.

## Important notes

- The itinerary uses the current December 4–14 plan. The older `J_4.0` PDF contained a different November 27–December 7 draft, so it was treated as inspiration rather than the current schedule.
- Map pins are approximate coordinates. Use the linked directions and confirm the precise entrance before travelling.
- Map tiles require internet. The app shell can be cached, but it is not a complete offline map.
- Opening hours, prices, club events, transport schedules, onsen access rules and reservation availability can change. The onsen prices shown are research-note estimates, not guaranteed live quotes. Confirm directly with the venue before booking or travelling.
- No live ticket inventory, train API, weather feed or booking checkout is connected. The app is a planner, not a booking agent.
- All personal progress, favourites, checklist ticks and spending entries are stored in the browser's local storage on that device. Clearing browser data will clear them.

## Data provenance

The saved-place selection and inspiration came from the uploaded `JAPAN!!! - Google Maps.pdf` and `J_4.0.pdf`, reconciled against the current itinerary notes for 4–14 December 2026. Extra descriptions and local tips are planning suggestions and should be checked against current venue information.
