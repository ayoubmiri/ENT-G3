# FROM node:18-alpine

# WORKDIR /app

# # Install dependencies first for better caching
# COPY package*.json ./
# RUN npm install

# # Copy all files
# COPY . .

# # Build the application
# RUN npm run build

# # Install serve to run the production build
# RUN npm install -g serve

# # Expose the port the app runs on
# EXPOSE 3000

# # Command to run the application
# CMD ["serve", "-s", "build", "-l", "3000"]





FROM node:20

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --force

# Copy the rest of the source code
COPY . .

# Optional: Fix react-scripts permission issue
RUN chmod +x node_modules/.bin/react-scripts

# Build the app
RUN npm run build

# Install 'serve' to serve the static files
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Serve the React build folder
CMD ["serve", "-s", "build", "-l", "3000"]
