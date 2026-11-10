# EM-NET · React + Vite
# Stage 1: build the static files.
FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: serve the static files with nginx.
FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# The nginx image already starts nginx in the foreground as root and drops
# privileges for worker processes, which is what we want for this demo.
CMD ["nginx", "-g", "daemon off;"]
