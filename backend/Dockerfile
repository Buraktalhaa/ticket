FROM node:22.0.0-alpine

# Build dependencies (needed for compiling native modules like bcrypt)
RUN apk add --no-cache --virtual .build-deps build-base

WORKDIR /app

COPY package*.json ./
COPY .env ./

RUN npm install

# Copy the rest of the files
COPY . .



# Clean up build dependencies to reduce image size
RUN apk del .build-deps

EXPOSE 3000

# Run Prisma commands after the container starts
CMD npm run dev
