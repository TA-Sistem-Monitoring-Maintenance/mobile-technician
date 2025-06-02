# Stage 1: Build the Vue.js application
FROM node:20.12.2-alpine as build-stage 

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install ALL dependencies (including devDependencies like Vite)
RUN npm install

# Clean npm cache to ensure no stale data interferes with the build
RUN npm cache clean --force

# Copy the rest of the application code
COPY . .

# Build the Vue.js application for production
RUN npm run build