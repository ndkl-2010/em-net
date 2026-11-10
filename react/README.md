# React · Course Catalog

A small **React 19 + Vite 8** single-page app with a searchable course grid.
Dummy courses live in `src/App.jsx`; there is no backend and no router.

## Run locally

```bash
cd react
npm install
npm run dev
# http://localhost:5173
```

Other scripts: `npm run build` (production bundle in `dist/`) and
`npm run preview` (serve that bundle locally).

## Run with Docker

```bash
docker build -t em-net/react-catalog .
docker run --rm -p 5005:80 em-net/react-catalog
# http://localhost:5005
```

Multi-stage build: Vite builds the static files in `node:24-alpine`, and
`nginx:alpine` serves them. `nginx.conf` provides SPA fallback, `/healthz` and
cache headers for hashed assets. nginx listens on port **80**.

Suggested tunnel hostname: `react.example.com` → `http://react:80`.

## Where things live

```
index.html          # Vite entry point
vite.config.js      # React plugin + dev server settings
src/
├── main.jsx        # createRoot(...)
├── App.jsx         # components, dummy data, search state
└── index.css       # all styles
```
