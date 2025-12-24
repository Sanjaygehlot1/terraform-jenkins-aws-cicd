FROM node:18-alpine AS build-frontend

WORKDIR /frontend

COPY . .

RUN npm ci && npm run build

COPY --from=build-frontend /frontend/dist /usr/share/nginx/html

EXPOSE 80