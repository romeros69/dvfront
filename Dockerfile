# Build stage
FROM node:20-alpine AS build
WORKDIR /app

ENV CI=true

COPY package*.json ./
RUN npm ci

COPY . .

# Allow API base URL override during build
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN npm run build

# Runtime stage - serve static files with nginx
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

COPY --from=build /app/build/ .
EXPOSE 80

# Default nginx config is fine for SPA static hosting
CMD ["nginx", "-g", "daemon off;"]
