FROM node:22-alpine AS build-frontend

WORKDIR /frontend

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .

RUN npm ci && npm run build

FROM nginx:alpine

COPY --from=build-frontend /frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]