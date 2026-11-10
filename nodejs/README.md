# Node.js · Teachers API

A tiny **Express 5** JSON API with dummy teacher and timetable data. Everything
lives in `server.js`; there is no build step.

## Endpoints

| Method | Path                | Description                      |
| ------ | ------------------- | -------------------------------- |
| GET    | `/`                 | Service info and endpoint list   |
| GET    | `/health`           | `{"status":"ok"}` + uptime       |
| GET    | `/api/teachers`     | `{count, teachers}`              |
| GET    | `/api/teachers/1`   | One teacher, or `404`            |
| GET    | `/api/timetable`    | `{count, timetable}`             |

Unknown paths return JSON (`404`) instead of Express' default HTML page.

## Run locally

```bash
cd nodejs
npm install
npm start          # or: npm run dev  (auto-restarts on changes)
# http://localhost:3000/api/teachers
```

Needs Node.js 20 or newer.

## Run with Docker

```bash
docker build -t em-net/nodejs-teachers-api .
docker run --rm -p 5003:3000 em-net/nodejs-teachers-api
# http://localhost:5003/api/teachers
```

Two-stage build: `npm ci --omit=dev` in `node:24-alpine`, then only
`node_modules` and the source are copied into the runtime image. It runs as the
non-root `node` user on port **3000**.

Suggested tunnel hostname: `nodejs.example.com` → `http://nodejs:3000`.
