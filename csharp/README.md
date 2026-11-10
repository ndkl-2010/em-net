# C# · Courses API

ASP.NET Core 10 **minimal API** with hard-coded school data. One file
(`Program.cs`) defines everything: records, CORS and five read-only endpoints.

## Endpoints

| Method | Path              | Description                         |
| ------ | ----------------- | ----------------------------------- |
| GET    | `/`               | Service info and endpoint list      |
| GET    | `/health`         | `{"status":"ok"}` for checks        |
| GET    | `/api/courses`    | All courses                         |
| GET    | `/api/courses/1`  | One course, or `404`                |
| GET    | `/api/students`   | All students                        |

## Run locally

```bash
cd csharp
dotnet run
# http://localhost:5178/api/courses
```

Needs the .NET 10 SDK.

## Run with Docker

```bash
docker build -t em-net/csharp-courses-api .
docker run --rm -p 5001:8080 em-net/csharp-courses-api
# http://localhost:5001/api/courses
```

The image is built in two stages: `mcr.microsoft.com/dotnet/sdk:10.0` compiles
and publishes, then `mcr.microsoft.com/dotnet/aspnet:10.0` runs the DLL as the
non-root `app` user on port **8080**.

Suggested tunnel hostname: `csharp.example.com` → `http://csharp:8080`.
