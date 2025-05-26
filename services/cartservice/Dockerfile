FROM node:22.14.0

# Cài đặt công cụ build (python, make, g++) cho bcrypt
RUN apt-get update && apt-get install -y python3 build-essential

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "dist/index.js"]