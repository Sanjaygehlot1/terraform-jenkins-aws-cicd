FROM node:22-alpine AS build-frontend

WORKDIR /frontend

COPY . .

RUN npm ci && npm run build

FROM nginx:alpine

COPY --from=build-frontend /frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]