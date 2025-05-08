FROM node:22.0.0-alpine

WORKDIR /app

COPY package*.json ./
COPY .env ./
COPY /prisma/* ./prisma/
RUN apk add --no-cache openssl3 
RUN npm install

# Copy the rest of the files
COPY . .

EXPOSE 3000

# Run Prisma commands after the container starts
CMD ["npm", "run", "dev"]
