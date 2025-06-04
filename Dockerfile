FROM node:24.1.0-slim

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser



WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "node", "dist/main.js" ]