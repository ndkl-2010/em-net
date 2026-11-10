# Cloudflare Tunnel configuration

The compose file uses a **dashboard-managed tunnel** (the easy path): the
connector gets a token through `CLOUDFLARE_TUNNEL_TOKEN` and reads its public
hostnames from the Cloudflare dashboard.

Add these public hostnames under **Zero Trust → Networks → Tunnels → your
tunnel → Public Hostname**. The service URLs use the compose service names.

| Public hostname (example)     | Service             |
| ----------------------------- | ------------------- |
| `csharp.example.com`          | `http://csharp:8080`|
| `python.example.com`          | `http://python:8000`|
| `nodejs.example.com`          | `http://nodejs:3000`|
| `angular.example.com`         | `http://angular:80` |
| `react.example.com`           | `http://react:80`   |

Replace `example.com` with a domain that is active on your Cloudflare account.
No `localhost` and no host port is used here: cloudflared talks to the other
containers directly over the `em-net` Docker network.

## Option 2: locally-managed tunnel (config file)

If you prefer keeping the ingress rules in this repository, copy
`config.yml.example` to `config.yml`, fill in your tunnel name/UUID and the
credentials file, then swap the `cloudflared` service in
`docker-compose.yml` for something like:

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

Create the tunnel and DNS records once from your machine:

```bash
cloudflared tunnel login
cloudflared tunnel create em-net
cloudflared tunnel route dns em-net csharp.example.com
cloudflared tunnel route dns em-net python.example.com
cloudflared tunnel route dns em-net nodejs.example.com
cloudflared tunnel route dns em-net angular.example.com
cloudflared tunnel route dns em-net react.example.com
```

`cloudflared tunnel create` writes the credentials JSON to your home
directory; copy it into `cloudflared/` next to `config.yml` (both are ignored
by git through `cloudflared/*.json`, see `.gitignore`).

## Option 3: throw-away quick tunnel (no account, no DNS)

Great for a quick classroom check. This does not use the compose
`cloudflared` service; it starts a temporary connector:

```bash
docker compose up --build -d csharp python nodejs angular react
docker compose run --rm cloudflared tunnel --url http://react:80
```

Cloudflare prints a random `https://….trycloudflare.com` URL that lives as
long as the command runs.
