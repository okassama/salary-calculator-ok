FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port 7770
EXPOSE 7770

# Serve the built app
CMD ["npm", "run", "preview", "--", "--port", "7770", "--host", "0.0.0.0"]
