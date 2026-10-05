# React Frontend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# API URL is baked into the bundle at build time
ARG VITE_REACT_APP_API_URL=http://localhost:5500
ENV VITE_REACT_APP_API_URL=$VITE_REACT_APP_API_URL

# Build the application
RUN npm run build

# Install serve to run the built app
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Serve the built application
CMD ["serve", "-s", "dist", "-l", "3000"]
