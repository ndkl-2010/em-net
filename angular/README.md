# Angular · Student Portal

A small **Angular 22** single-page app: statistics computed with signals, a live
search filter and Angular's built-in `@for` / `@if` control flow. Dummy students
are defined in `src/app/app.ts` — no HTTP, no backend.

## Run locally

```bash
cd angular
npm install
npm start          # ng serve
# http://localhost:4200
```

Build a production bundle with `npm run build` (output in `dist/`).

## Run with Docker

```bash
docker build -t em-net/angular-portal .
docker run --rm -p 5004:80 em-net/angular-portal
# http://localhost:5004
```

The Dockerfile runs `npm ci && npm run build` in `node:24-alpine`, then copies
the static output into `nginx:alpine`. `nginx.conf` adds SPA fallback
(`try_files … /index.html`), a `/healthz` probe and long-lived caching for hashed
assets. nginx listens on port **80**.

Suggested tunnel hostname: `angular.example.com` → `http://angular:80`.

## Where things live

```
src/
├── main.ts              # bootstrapApplication
├── index.html           # single <app-root> element
├── styles.css           # page background + CSS variables
└── app/
    ├── app.ts           # component + dummy data + signals
    ├── app.html         # template (control flow, table)
    └── app.css          # component styles
```
