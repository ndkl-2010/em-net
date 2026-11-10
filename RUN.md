# Run commands

Copy/paste commands only. Start from the repository root unless a `cd` says otherwise.

## Docker Compose — all apps + tunnel

```bash
cp .env.example .env
# edit .env and set CLOUDFLARE_TUNNEL_TOKEN

docker compose up --build -d
docker compose ps
docker compose logs -f cloudflared

docker compose down
```

Without a tunnel:

```bash
docker compose up --build csharp python nodejs angular react
```

Rebuild one app:

```bash
docker compose up -d --build python
```

## C# — csharp

```bash
cd csharp
dotnet run
# http://localhost:5178/api/courses
```

```bash
docker build -t em-net/csharp-courses-api ./csharp
docker run --rm -p 5001:8080 em-net/csharp-courses-api
# http://localhost:5001/api/courses
```

## Python — python

```bash
cd python
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload
# http://localhost:8000/api/students
```

```bash
docker build -t em-net/python-students-api ./python
docker run --rm -p 5002:8000 em-net/python-students-api
# http://localhost:5002/api/students
```

## Node.js — nodejs

```bash
cd nodejs
npm install
npm start
# http://localhost:3000/api/teachers
```

```bash
docker build -t em-net/nodejs-teachers-api ./nodejs
docker run --rm -p 5003:3000 em-net/nodejs-teachers-api
# http://localhost:5003/api/teachers
```

## Angular — angular

```bash
cd angular
npm install
npm start
# http://localhost:4200
```

```bash
docker build -t em-net/angular-portal ./angular
docker run --rm -p 5004:80 em-net/angular-portal
# http://localhost:5004
```

## React — react

```bash
cd react
npm install
npm run dev
# http://localhost:5173
```

```bash
docker build -t em-net/react-catalog ./react
docker run --rm -p 5005:80 em-net/react-catalog
# http://localhost:5005
```

## Quick tunnel (no Cloudflare account)

```bash
docker compose up --build -d csharp python nodejs angular react
docker compose run --rm cloudflared tunnel --url http://react:80
```

## Smoke tests

```bash
curl http://localhost:5001/health
curl http://localhost:5002/health
curl http://localhost:5003/health
curl http://localhost:5001/api/courses
curl http://localhost:5002/api/students
curl http://localhost:5003/api/teachers
```
