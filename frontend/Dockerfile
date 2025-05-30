FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g @angular/cli

# Copy source code
COPY . .

# Turn off analytics (after copying source code)
RUN ng analytics off

# Expose port
EXPOSE 4200

# Start the development server
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--poll", "2000", "--disable-host-check"]