FROM node:20-slim
WORKDIR /app
RUN apt-get update && apt-get install -y openssl
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
RUN ls -la ./node_modules/.bin/prisma && cat ./node_modules/prisma/package.json | grep '"version"'
RUN ./node_modules/.bin/prisma generate
CMD ["node", "src/server.js"]