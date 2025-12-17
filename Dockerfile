# Multi-stage build: build with Node, serve with nginx
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies first (better cache)
COPY package*.json ./
RUN npm ci --silent

# Copy the rest of the project and build
COPY . .
RUN npm run build
# Ensure any static `assets/` folder is copied into `dist/` so production nginx can serve them
RUN if [ -d "assests" ]; then mkdir -p dist && cp -a assets dist/ || true; fi


FROM nginx:stable-alpine

# Remove default nginx static assets and copy built files
COPY --from=build /app/dist /usr/share/nginx/html
# Also copy the assets folder (if present) so nginx can serve referenced static files
COPY --from=build /app/assests /usr/share/nginx/html/assests


# Add custom nginx config (SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
