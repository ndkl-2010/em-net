# EM-NET · C# / ASP.NET Core
# Stage 1: build & publish the app with the .NET SDK image.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Restore first so Docker can cache the NuGet layer.
COPY EmNet.Courses.Api.csproj ./
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: tiny runtime image (no SDK, no compilers).
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Listen on all interfaces, port 8080 (non-root friendly).
ENV ASPNETCORE_URLS=http://+:8080 \
    DOTNET_NOLOGO=1 \
    DOTNET_CLI_TELEMETRY_OPTOUT=1
EXPOSE 8080

# The .NET 8+ runtime images ship a non-root "app" user (UID 1654).
USER $APP_UID

ENTRYPOINT ["dotnet", "EmNet.Courses.Api.dll"]
