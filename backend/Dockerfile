FROM node:18-alpine

WORKDIR /backend

COPY . .

RUN npm ci

EXPOSE 8000

CMD [ "node" "src/server.js" ]