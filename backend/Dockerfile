FROM node:22.0.0-alpine

# Build dependencies (needed for compiling native modules like bcrypt)
RUN apk add --no-cache --virtual .build-deps build-base python3

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Clean up build dependencies to reduce image size
RUN apk del .build-deps

EXPOSE 3000

CMD ["npm", "run", "dev"]
