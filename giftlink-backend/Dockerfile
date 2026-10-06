FROM node:18.12.1-bullseye-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV NODE_ENV=production
EXPOSE 3060

CMD ["node", "app.js"]
