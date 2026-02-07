# Use lightweight Node.js Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (include dev deps needed for build)
RUN npm ci && \
    npm cache clean --force

# Copy application files
COPY . .

# Build the website
RUN npm run docs:build

# Expose port for preview/serving
EXPOSE 4173

# Command to preview the built site
CMD ["npm", "run", "docs:preview", "--", "--host", "0.0.0.0"]
