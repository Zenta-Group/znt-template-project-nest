FROM node:24.1.0-slim

RUN groupadd -r appgroup && useradd -m -r -g appgroup appuser

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

USER appuser


CMD [ "node", "dist/main.js" ]