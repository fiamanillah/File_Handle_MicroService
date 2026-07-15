FROM node:lts-alpine

# Install bun (using official installation method)
RUN npm install -g bun@latest

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN bun run build

# Expose the port the app runs on
EXPOSE 5000

# Start the application with a delay to ensure MongoDB is ready
CMD ["sh", "-c", "sleep 5 && bun run start"]

# Healthcheck to ensure the app is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/ || exit 1