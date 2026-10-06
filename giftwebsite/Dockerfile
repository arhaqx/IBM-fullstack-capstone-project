FROM node:18.12.1-bullseye-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# `build/` is produced by `npm run build` in giftlink-frontend and copied here before deploying
COPY server.js ./
COPY build ./build

EXPOSE 9000

CMD ["node", "server.js"]
