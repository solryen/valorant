# Todayler

This repo is a Vite + React app for Todayler. It runs locally in development or as a built preview server.

## Local setup

1. Install dependencies with `npm install`
2. Start the dev server with `npm run dev`
3. Open `http://localhost:5173`
4. Open the onboarding app at `http://localhost:5173/run/`
5. Build for preview with `npm run build`
6. Start the preview server with `npm run preview`
7. Open `http://localhost:4173` and `http://localhost:4173/run/`

## Host behavior

- Dev server binds to `0.0.0.0:5173`
- Preview server binds to `0.0.0.0:4173`
- The standalone onboarding app is mounted at `/run/`
- The standalone explore app is deployed separately and is not mounted into the root site
- SPA refresh routes are handled by `BrowserRouter` in `src/App.jsx` and the `vercel.json` rewrite

## Notes

- If `vite` is missing locally, run `npm install` again before starting the server.
- The app keeps the existing Vite stack and does not require a framework migration.
