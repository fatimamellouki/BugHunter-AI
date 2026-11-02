# BugHunter AI - Frontend

AI-Powered Code Analysis & Debugging Assistant. React frontend for the existing FastAPI backend.

## Prerequisites

- Node.js 22 LTS (22.22.2 or newer) or 24.15+. Check with `node -v`.
- The FastAPI backend running on `http://127.0.0.1:8000` (see `backend/`, not modified by this project).
- Internet access in the browser: Monaco Editor loads from a CDN, and the fonts come from Google Fonts.

## Install and run (PowerShell)

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open http://localhost:5173. The landing page is at `/`; the app lives at `/analysis` and `/results`.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm test` | Run all tests once |
| `npm run test:watch` | Tests in watch mode |
| `npm run test:coverage` | Tests with a coverage report (`coverage/index.html`) |
| `npm run build` | Production build in `dist/` |
| `npm run preview` | Serve the production build locally |

## Configuration (`.env`)

```
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_API_TIMEOUT_MS=90000
```

Restart `npm run dev` after editing `.env`.

## Connecting to the backend

1. Start FastAPI (`uvicorn ...` in the backend folder) and open http://127.0.0.1:8000/docs.
2. Start the frontend, open **Code Analysis** and click **Analyze with AI**.
3. If the page shows "Backend unreachable", open the browser console (F12).
   A message mentioning *CORS policy* means the backend must allow the origin
   `http://localhost:5173` (and `http://127.0.0.1:5173`) with `CORSMiddleware`.
   Ask the backend owner to add it; do not change the backend from this repository.

## Architecture

```
src/
  components/  landing/ layout/ editor/ analysis/ common/   presentational components
  context/     AnalysisContext.jsx                  shares the analysis between pages
  hooks/       useCodeAnalysis.js                   state machine of an analysis
  pages/       Landing (route "/"), CodeAnalysis, AnalysisResults
  services/    api.js                               the only place that calls fetch
  utils/       validators, formatters, codeLines, clipboard, constants
  styles/      variables.css (light theme tokens), global.css, components.css, pages.css, landing.css
  test/        setup, Monaco mock, backend fixtures
```

Data flow: editor -> `useCodeAnalysis` -> `analyzeCode()` -> `POST /api/debug` -> `normalizeResponse()` -> context -> results page.

## Only confirmed endpoint

`POST /api/debug` with `{ "code": "...", "language": "python" }`. No other endpoint is called.
There is no history and no statistics: the backend does not provide them.
Generated tests are displayed as generated code; the backend does not execute them.
