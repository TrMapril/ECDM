FROM node:22.14.0-slim

# Cài đặt công cụ build để biên dịch bcrypt
RUN apt-get update && apt-get install -y python3 build-essential && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Expose port - QUAN TRỌNG!
EXPOSE 3001

CMD ["node", "dist/index.js"]