# using node version 18 image
FROM node:18

# Create app directory
WORKDIR /src/backend/app

# Copy package.json and package-lock.json file into working directory
COPY ./package*.json .

# install dependencies
RUN npm install

# bundle app source
COPY . .

EXPOSE 8000
CMD ["node", "server.js"]