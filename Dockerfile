# Our base image
FROM node:16-alpine

# Create app directory
WORKDIR /src
RUN apk update && apk add curl tar git bash

COPY ["package.json", "yarn.*", "./"]

# Install app dependencies
# with yarn
RUN yarn

# Run the application
CMD [ "yarn", "start" ]
