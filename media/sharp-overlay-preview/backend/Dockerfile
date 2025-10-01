# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install fontconfig and fonts for Sharp text rendering
RUN apk add --no-cache \
    fontconfig \
    ttf-dejavu \
    font-noto-cjk \
    font-liberation \
    font-freefont

# Update font cache
RUN fc-cache -fv

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start the server
CMD ["npm", "start"]