# Use Node.js 14 as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app
ENV PORT 5000

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files to the container
COPY . .

# Expose port 8080
EXPOSE 5000

# Start the application
CMD [ "npm", "run", "start"]
