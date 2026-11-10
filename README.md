# EM-NET — five tiny apps, five stacks, one tunnel

A deliberately small school project: the **same dummy school data** built five
times, once per language/stack. Every folder is a complete, runnable mini app,
and the whole set is packaged with Docker Compose plus a **Cloudflare Tunnel**
connector so it can be published without opening any ports on the host.

No database, no authentication, no real personal data — just enough code to
show how different stacks get containerised and exposed.

## What is inside

| Folder      | Stack                                | Type        | Local URL              | Container port |
| ----------- | ------------------------------------ | ----------- | ---------------------- | -------------- |
| `csharp/`   | C# · ASP.NET Core 10 minimal API     | JSON API    | http://localhost:5001  | 8080           |
| `python/`   | Python · FastAPI + Uvicorn           | JSON API    | http://localhost:5002  | 8000           |
| `nodejs/`   | Node.js · Express 5                  | JSON API    | http://localhost:5003  | 3000           |
| `angular/`  | Angular 22 (standalone, signals)     | Web UI      | http://localhost:5004  | 80             |
| `react/`    | React 19 · Vite 8                    | Web UI      | http://localhost:5005  | 80             |
| `cloudflared/` | Cloudflare Tunnel config examples | Connector   | —                      | —              |

The three APIs share one small dataset (students, courses, teachers, timetable,
attendance) and expose `/health` plus a couple of read-only endpoints. The two
frontends keep their dummy data in the source, so they render even if the APIs
are offline.

```
                    ┌──────────────────────────────┐
  Internet ──HTTPS──▶  Cloudflare edge            │
                    │   *.example.com               │
                    └──────────────┬───────────────┘
                                   │ outbound-only tunnel
                    ┌──────────────▼───────────────┐
                    │  cloudflared container        │
                    │  (compose network: em-net)    │
                    └───┬────────┬────────┬─────────┘
            http://csharp:8080  http://python:8000  http://nodejs:3000
            http://angular:80   http://react:80
```

## Quick start

Requirements: Docker Engine (or Docker Desktop) with Compose v2.

```bash
# 1. Create your tunnel token file (see "Cloudflare Tunnel setup" below)
cp .env.example .env
$EDITOR .env

# 2. Build and start all six containers in the background
docker compose up --build -d

# 3. Check they are running
docker compose ps

# 4. Follow the tunnel logs to see requests arriving
docker compose logs -f cloudflared
```

Now open:

- http://localhost:5001 — C# Courses API (`/api/courses`)
- http://localhost:5002 — Python Students API (`/api/students`, `/docs`)
- http://localhost:5003 — Node.js Teachers API (`/api/teachers`)
- http://localhost:5004 — Angular Student Portal
- http://localhost:5005 — React Course Catalog

The host-side mappings are bound to `127.0.0.1` on purpose: these ports are for
you to test locally. Public access happens exclusively through the tunnel, so
nothing needs to be exposed on the LAN or the internet.

Stop everything with `docker compose down` (add `-v` if you ever add volumes).

### Start the apps without a tunnel

If you do not have a Cloudflare account yet, skip `cloudflared` entirely:

```bash
docker compose up --build csharp python nodejs angular react
```

The host ports above still work; nothing else is required.

## Cloudflare Tunnel setup

The compose file runs `cloudflare/cloudflared` as a **dashboard-managed
connector**: it dials out to Cloudflare, so no router ports, no public IP and no
TLS certificates are needed.

### Option 1 — token from the dashboard (recommended)

1. In the Cloudflare dashboard go to **Zero Trust → Networks → Tunnels** and
   create a tunnel (e.g. `em-net`).
2. Choose **Docker** as the environment and copy the token from the install
   command.
3. Put it in `.env` in this folder:

   ```dotenv
   CLOUDFLARE_TUNNEL_TOKEN=eyJhIjoi...your-token...
   ```

4. Add one **Public Hostname** per app (the service URLs use compose service
   names, not `localhost`):

   | Public hostname    | Service              |
   | ------------------ | -------------------- |
   | `csharp.example.com`  | `http://csharp:8080` |
   | `python.example.com`  | `http://python:8000` |
   | `nodejs.example.com`  | `http://nodejs:3000` |
   | `angular.example.com` | `http://angular:80`  |
   | `react.example.com`   | `http://react:80`    |

   Cloudflare creates the DNS records for you. Replace `example.com` with a
   domain in your account.
5. Restart the connector after changing `.env`:
   `docker compose up -d --force-recreate cloudflared`.

The `.env` file is git-ignored — never commit real tokens.

### Option 2 — keep ingress rules in the repo

For a locally-managed tunnel, copy `cloudflared/config.yml.example` to
`cloudflared/config.yml`, fill in the tunnel UUID and credentials JSON, and
replace the `command`/add a volume in the `cloudflared` service:

```yaml
  cloudflared:
    image: cloudflare/cloudflared:latest
    restart: unless-stopped
    command: tunnel --config /etc/cloudflared/config.yml --no-autoupdate run
    volumes:
      - ./cloudflared:/etc/cloudflared:ro
    networks:
      - em-net
```

Full instructions, including the `cloudflared tunnel create/route dns`
commands, are in [`cloudflared/README.md`](cloudflared/README.md).

### Option 3 — temporary quick tunnel (no account)

Handy for a live demo in class:

```bash
docker compose up --build -d csharp python nodejs angular react
docker compose run --rm cloudflared tunnel --url http://react:80
```

Cloudflare prints a random `https://…trycloudflare.com` URL that works while
the command runs. Repeat with `http://angular:80`, `http://csharp:8080`, etc.

> Cloudflare quick tunnels are for testing only; they are rate-limited and get
> a new random hostname every time.

## Developing each app without Docker

Every folder has its own README and its own local workflow:

| App     | Dev command                              | Port |
| ------- | ---------------------------------------- | ---- |
| C#      | `cd csharp && dotnet run`                | 5178 |
| Python  | `cd python && uvicorn app:app --reload`  | 8000 |
| Node.js | `cd nodejs && npm install && npm start`  | 3000 |
| Angular | `cd angular && npm install && npm start` | 4200 |
| React   | `cd react && npm install && npm run dev` | 5173 |

## How the containers are built

- **Multi-stage builds** everywhere: compilers/SDKs stay in the build stage;
  the final images only contain the published binaries or static files.
- **Non-root runtime users** for C#, Python and Node.js. The nginx images start
  as root and drop privileges for their workers, which is the upstream default.
- **nginx** serves both frontends with SPA fallback (`try_files … /index.html`)
  and a `/healthz` endpoint.
- **Ports inside the network** are fixed (`8080`, `8000`, `3000`, `80`) because
  the tunnel ingress refers to them. Only the host-side mappings in
  `docker-compose.yml` are convenient local numbers.

Rebuild a single app after changing it:

```bash
docker compose up -d --build python
```

## Project layout

```
em-net/
├── docker-compose.yml          # 5 apps + cloudflared on one network
├── .env.example                # copy to .env, add tunnel token
├── csharp/                     # ASP.NET Core minimal API + Dockerfile
├── python/                     # FastAPI app + Dockerfile
├── nodejs/                     # Express API + Dockerfile
├── angular/                    # Angular SPA + nginx + Dockerfile
├── react/                      # React + Vite SPA + nginx + Dockerfile
└── cloudflared/                # token vs. config-file tunnel examples
```

## A few useful endpoints

```bash
curl http://localhost:5001/health
curl http://localhost:5001/api/courses
curl http://localhost:5002/api/students
curl http://localhost:5002/api/attendance
curl http://localhost:5003/api/teachers
curl http://localhost:5003/api/timetable
```

## Troubleshooting

| Symptom | Likely cause |
| ------- | ------------ |
| `cloudflared` restarts in a loop | `CLOUDFLARE_TUNNEL_TOKEN` is empty or invalid. Check `docker compose logs cloudflared`. |
| Tunnel returns 502 | The service name/port in the public hostname does not match compose (`http://python:8000`, not `localhost:8000`). |
| `port is already allocated` | Another process uses 5001–5005; edit the host ports on the left side of the mappings. |
| Page shows old content | Rebuild that service: `docker compose up -d --build react`. |
| API returns 404 on `/` | The APIs only define `/`, `/health` and `/api/...`; see each README. |

## Notes for the lesson

- All data is fictional and hard-coded. Deleting a container deletes nothing
  important — there is no database.
- CORS is open on the APIs on purpose so you can experiment from the browser
  console or point a frontend at them.
- The tunnel is outbound-only. If it works, do not add `0.0.0.0` port forwards
  or firewall rules; that defeats the point of the exercise.

## License

MIT — see [LICENSE](LICENSE).
