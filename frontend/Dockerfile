# using node version 18 image
FROM node:18

# Create app directory
WORKDIR /src/frontend/app

ENV PATH /src/frontend/node_modules/.bin:$PATH

# Copy package.json and package-lock.json file into working directory
COPY ./package*.json /src/frontend/app

# bundle app source
COPY . /src/frontend/app

EXPOSE 3000